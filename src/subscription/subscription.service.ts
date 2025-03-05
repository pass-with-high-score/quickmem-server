import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from './subscription.repository';
import { CreateSubscriptionDto } from './dto/bodies/create-subscription.dto';
import { SubscriptionInterface } from './interfaces/subscription.interface';
import { UpdateSubscriptionTypeParamDto } from './dto/params/update-subscription-type.param.dto';
import { UpdateSubscriptionBodyDto } from './dto/bodies/update-subscription.body.dto';
import { UpdateAutoRenewParamDto } from './dto/params/update-auto-renew.param.dto';
import { UpdateAutoRenewBodyDto } from './dto/bodies/update-auto-renew.body.dto';
import { GetSubscriptionByIdParamDto } from './dto/params/get-subscription-by-id.param.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async createSubscription(
    createSubscription: CreateSubscriptionDto,
    userId: string,
  ): Promise<SubscriptionInterface> {
    return this.subscriptionRepository.createSubscription(
      createSubscription,
      userId,
    );
  }

  async updateSubscription(
    updateSubscriptionTypeParamDto: UpdateSubscriptionTypeParamDto,
    updateSubscriptionBodyDto: UpdateSubscriptionBodyDto,
  ): Promise<SubscriptionInterface> {
    return this.subscriptionRepository.updateSubscription(
      updateSubscriptionTypeParamDto,
      updateSubscriptionBodyDto,
    );
  }

  async updateAutoRenewStatus(
    updateAutoRenewParamDto: UpdateAutoRenewParamDto,
    updateAutoRenewBodyDto: UpdateAutoRenewBodyDto,
  ): Promise<SubscriptionInterface> {
    return this.subscriptionRepository.updateAutoRenewStatus(
      updateAutoRenewParamDto,
      updateAutoRenewBodyDto,
    );
  }

  async getSubscriptionById(
    getSubscriptionByIdParamDto: GetSubscriptionByIdParamDto,
  ): Promise<SubscriptionInterface> {
    return this.subscriptionRepository.getSubscriptionById(
      getSubscriptionByIdParamDto,
    );
  }

  async getSubscriptionsByUserId(
    userId: string,
  ): Promise<SubscriptionInterface[]> {
    return this.subscriptionRepository.getSubscriptionsByUserId(userId);
  }
}
