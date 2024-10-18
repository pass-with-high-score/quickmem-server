import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, LessThanOrEqual, Repository } from 'typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/bodies/create-subscription.dto';
import { SubscriptionInterface } from './interfaces/subscription.interface';
import { UserEntity } from '../auth/entities/user.entity';
import { logger } from '../winston-logger.service';
import { UpdateSubscriptionTypeParamDto } from './dto/params/update-subscription-type.param.dto';
import { UpdateSubscriptionBodyDto } from './dto/bodies/update-subscription.body.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionTypeEnum } from './enums/subscription.enum';
import { addDays } from 'date-fns';
import { UpdateAutoRenewParamDto } from './dto/params/update-auto-renew.param.dto';
import { UpdateAutoRenewBodyDto } from './dto/bodies/update-auto-renew.body.dto';
import { GetSubscriptionByIdParamDto } from './dto/params/get-subscription-by-id.param.dto';
import { GetSubscriptionByUserIdParamDto } from './dto/params/get-subscription-by-user-id.param.dto';

@Injectable()
export class SubscriptionRepository extends Repository<SubscriptionEntity> {
  constructor(private dataSource: DataSource) {
    super(SubscriptionEntity, dataSource.createEntityManager());
  }

  // Phương thức hỗ trợ tính toán ngày kết thúc
  private calculateEndDate(
    subscriptionType: SubscriptionTypeEnum,
    trialForType?: string,
  ): Date {
    const currentDate = new Date();
    let daysToAdd = 0;

    switch (subscriptionType) {
      case SubscriptionTypeEnum.FREE_TRIAL:
        daysToAdd = trialForType === 'MONTHLY' ? 7 : 14;
        break;
      case SubscriptionTypeEnum.MONTHLY:
        daysToAdd = 30;
        break;
      case SubscriptionTypeEnum.YEARLY:
        daysToAdd = 365;
        break;
      default:
        throw new InternalServerErrorException('Invalid subscription type');
    }

    return addDays(currentDate, daysToAdd);
  }

  // Tạo đăng ký mới
  async createSubscription(
    createSubscription: CreateSubscriptionDto,
  ): Promise<SubscriptionInterface> {
    const { userId, subscriptionType, trialForType } = createSubscription;
    const subscription = new SubscriptionEntity();
    const user = await this.dataSource
      .getRepository(UserEntity)
      .findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Kiểm tra xem người dùng đã từng sử dụng FREE_TRIAL chưa
    const hasUsedTrial =
      (await this.dataSource.getRepository(SubscriptionEntity).count({
        where: {
          user: { id: userId },
          subscriptionType: SubscriptionTypeEnum.FREE_TRIAL,
        },
      })) > 0;

    if (hasUsedTrial && subscriptionType === SubscriptionTypeEnum.FREE_TRIAL) {
      throw new ConflictException('User has already used a free trial');
    }

    // Vô hiệu hóa các đăng ký hiện tại
    const activeSubscriptions = await this.dataSource
      .getRepository(SubscriptionEntity)
      .find({ where: { user: { id: userId }, isActive: true } });

    if (activeSubscriptions.length > 0) {
      logger.info(
        `Deactivating ${activeSubscriptions.length} active subscriptions for user ID ${userId}`,
      );
      activeSubscriptions.forEach((sub) => (sub.isActive = false));
      await this.dataSource
        .getRepository(SubscriptionEntity)
        .save(activeSubscriptions);
    }

    // Thiết lập thông tin đăng ký mới
    subscription.user = user;
    subscription.subscriptionType = subscriptionType;

    if (subscriptionType === SubscriptionTypeEnum.FREE_TRIAL) {
      subscription.isTrial = true;
      subscription.trialForType = trialForType;
    }

    subscription.isActive = true;
    subscription.isAutoRenew = true;

    subscription.startDate = new Date();
    subscription.endDate = this.calculateEndDate(
      subscriptionType,
      trialForType,
    );

    await this.dataSource.getRepository(SubscriptionEntity).save(subscription);

    return {
      id: subscription.id,
      userId: subscription.user.id,
      subscriptionType: subscription.subscriptionType,
      trialForType: subscription.trialForType,
      isTrial: subscription.isTrial,
      isActive: subscription.isActive,
      isAutoRenew: subscription.isAutoRenew,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
    };
  }

  // Cập nhật loại đăng ký
  async updateSubscription(
    updateSubscriptionTypeParamDto: UpdateSubscriptionTypeParamDto,
    updateSubscriptionBodyDto: UpdateSubscriptionBodyDto,
  ): Promise<SubscriptionInterface> {
    const id = updateSubscriptionTypeParamDto.id;
    const { subscriptionType, trialForType } = updateSubscriptionBodyDto;

    const subscription = await this.dataSource
      .getRepository(SubscriptionEntity)
      .findOne({
        where: { id },
        relations: ['user'],
      });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (!subscription.isActive) {
      throw new ConflictException('Subscription is not active');
    }

    // Nếu là FREE_TRIAL, cập nhật loại gói và loại thử nghiệm
    if (subscription.subscriptionType === SubscriptionTypeEnum.FREE_TRIAL) {
      subscription.subscriptionType = subscriptionType;
      subscription.trialForType = trialForType;
    } else {
      subscription.subscriptionType = subscriptionType;
    }

    await this.dataSource.getRepository(SubscriptionEntity).save(subscription);

    return {
      id: subscription.id,
      userId: subscription.user.id,
      subscriptionType: subscription.subscriptionType,
      trialForType: subscription.trialForType,
      isTrial: subscription.isTrial,
      isActive: subscription.isActive,
      isAutoRenew: subscription.isAutoRenew,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiredSubscriptions() {
    const currentDate = new Date();

    logger.info('Checking for expired subscriptions...');
    const expiredSubscriptions = await this.dataSource
      .getRepository(SubscriptionEntity)
      .find({
        where: {
          endDate: LessThanOrEqual(currentDate),
          isActive: true,
        },
      });

    for (const subscription of expiredSubscriptions) {
      try {
        if (subscription.isAutoRenew) {
          logger.info(`Renewing subscription ID ${subscription.id}...`);
          if (subscription.isTrial) {
            logger.info(`Renewing trial subscription ID ${subscription.id}...`);
            switch (subscription.trialForType) {
              case 'MONTHLY':
                subscription.subscriptionType = SubscriptionTypeEnum.MONTHLY;
                break;
              case 'YEARLY':
                subscription.subscriptionType = SubscriptionTypeEnum.YEARLY;
                break;
              default:
                throw new InternalServerErrorException('Invalid trialForType');
            }

            subscription.isTrial = false;
            subscription.isAutoRenew = true;
          }

          // Gia hạn subscription
          subscription.startDate = currentDate;
          subscription.endDate = this.calculateEndDate(
            subscription.subscriptionType,
          );

          await this.dataSource
            .getRepository(SubscriptionEntity)
            .save(subscription);
          logger.info(
            `Successfully renewed subscription ID ${subscription.id}`,
          );
        } else {
          subscription.isActive = false;

          await this.dataSource
            .getRepository(SubscriptionEntity)
            .save(subscription);
          logger.info(`Subscription ID ${subscription.id} has been canceled.`);
        }
      } catch (error) {
        logger.error(
          `Failed to process subscription ID ${subscription.id}: ${error.message}`,
        );
        continue;
      }
    }
  }

  // Update auto renew status
  async updateAutoRenewStatus(
    updateAutoRenewParamDto: UpdateAutoRenewParamDto,
    updateAutoRenewBodyDto: UpdateAutoRenewBodyDto,
  ): Promise<SubscriptionInterface> {
    const id = updateAutoRenewParamDto.id;
    const { isAutoRenew } = updateAutoRenewBodyDto;

    const subscription = await this.dataSource
      .getRepository(SubscriptionEntity)
      .findOne({
        where: { id },
        relations: ['user'],
      });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (!subscription.isActive) {
      throw new ConflictException('Subscription is not active');
    }

    if (subscription.isAutoRenew === isAutoRenew) {
      throw new ConflictException(
        'Auto renew status is already set to the desired value',
      );
    }

    subscription.isAutoRenew = isAutoRenew;

    await this.dataSource.getRepository(SubscriptionEntity).save(subscription);

    return {
      id: subscription.id,
      userId: subscription.user.id,
      subscriptionType: subscription.subscriptionType,
      trialForType: subscription.trialForType,
      isTrial: subscription.isTrial,
      isActive: subscription.isActive,
      isAutoRenew: subscription.isAutoRenew,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
    };
  }

  // Get subscription by ID
  async getSubscriptionById(
    getSubscriptionByIdParamDto: GetSubscriptionByIdParamDto,
  ): Promise<SubscriptionInterface> {
    const id = getSubscriptionByIdParamDto.id;
    const subscription = await this.dataSource
      .getRepository(SubscriptionEntity)
      .findOne({ where: { id }, relations: ['user'] });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return {
      id: subscription.id,
      userId: subscription.user.id,
      subscriptionType: subscription.subscriptionType,
      trialForType: subscription.trialForType,
      isTrial: subscription.isTrial,
      isActive: subscription.isActive,
      isAutoRenew: subscription.isAutoRenew,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
    };
  }

  // Get subscriptions by user ID
  async getSubscriptionsByUserId(
    getSubscriptionByUserIdParamDto: GetSubscriptionByUserIdParamDto,
  ): Promise<SubscriptionInterface[]> {
    const userId = getSubscriptionByUserIdParamDto.id;
    const subscriptions = await this.dataSource
      .getRepository(SubscriptionEntity)
      .find({ where: { user: { id: userId } }, relations: ['user'] });

    return subscriptions.map((subscription) => ({
      id: subscription.id,
      userId: subscription.user.id,
      subscriptionType: subscription.subscriptionType,
      trialForType: subscription.trialForType,
      isTrial: subscription.isTrial,
      isActive: subscription.isActive,
      isAutoRenew: subscription.isAutoRenew,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
    }));
  }
}
