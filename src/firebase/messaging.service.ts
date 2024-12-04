import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MessagingProvider } from './messaging.provider';
import * as admin from 'firebase-admin';
import {
  IMessaging,
  IMessaginToConditionParams,
  IMessaginToTokensParams,
  IMessaginToTopicParams,
} from './imessaging.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity } from './entities/device.entity';
import { DataSource, In, Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { logger } from '../winston-logger.service';

@Injectable()
export class MessagingService implements IMessaging {
  constructor(
    @Inject(MessagingProvider)
    private readonly messaging: admin.messaging.Messaging,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private readonly dataSource: DataSource,
  ) {}

  private android: admin.messaging.AndroidConfig = {
    priority: 'high',
  };

  private apns: admin.messaging.ApnsConfig = {
    payload: {
      aps: {
        contentAvailable: true,
      },
    },
    headers: {
      'apns-priority': '5',
    },
  };

  async registerDeviceToken(
    userId: string,
    deviceToken: string,
  ): Promise<void> {
    const userEntity = await this.dataSource
      .getRepository(UserEntity)
      .findOne({ where: { id: userId } });
    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    const existingDevice = await this.deviceRepository.findOne({
      where: { user: { id: userId }, deviceToken: deviceToken },
    });

    if (existingDevice) {
      return;
    }

    const device = new DeviceEntity();
    device.user = userEntity;
    device.deviceToken = deviceToken;
    await this.deviceRepository.save(device);
  }

  async sendMessageToTokens(
    params: IMessaginToTokensParams,
  ): Promise<string[]> {
    const { title, body, payload, userId, tokens } = params;

    const devices = await this.deviceRepository.find({
      where: { user: { id: userId } },
    });
    const deviceTokens = devices.map((device) => device.deviceToken);
    console.log(deviceTokens);

    try {
      const response = await this.messaging.sendEachForMulticast({
        tokens: tokens || deviceTokens,
        data: payload,
        notification: {
          title: title,
          body: body,
        },
        android: this.android,
        apns: this.apns,
      });

      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        console.log(response);
        response.responses.forEach((resp, idx) => {
          console.log(resp);
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
          }
        });
        console.log(failedTokens);
        return failedTokens;
      } else {
        return [];
      }
    } catch (err) {
      await this.removeInvalidTokens(tokens);
      throw new HttpException(
        `Error sending message: ${err.message}`,
        HttpStatus.NO_CONTENT,
      );
    }
  }

  async sendMessageToTopic(params: IMessaginToTopicParams): Promise<string> {
    const { title, body, payload, topic } = params;
    return await this.messaging
      .send({
        topic: topic,
        data: payload,
        notification: {
          title: title,
          body: body,
        },
        android: this.android,
        apns: this.apns,
      })
      .catch((err) => {
        throw new HttpException(
          `Error sending message: ${err.message}`,
          HttpStatus.NO_CONTENT,
        );
      });
  }

  async sendMessageToCondition(
    params: IMessaginToConditionParams,
  ): Promise<string> {
    const { title, body, payload, condition } = params;
    return await this.messaging
      .send({
        condition: condition,
        data: payload,
        notification: {
          title: title,
          body: body,
        },
        android: this.android,
        apns: this.apns,
      })
      .catch((err) => {
        throw new HttpException(
          `Error sending message: ${err.message}`,
          HttpStatus.NO_CONTENT,
        );
      });
  }

  async removeInvalidTokens(tokens: string[]): Promise<void> {
    try {
      await this.dataSource
        .getRepository(DeviceEntity)
        .delete({ deviceToken: In(tokens) });
      logger.info('Invalid tokens removed');
    } catch (error) {
      logger.error('Failed to remove invalid tokens', error);
      throw new InternalServerErrorException('Failed to remove invalid tokens');
    }
  }
}
