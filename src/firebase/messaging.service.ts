import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
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
import { Repository } from 'typeorm';

@Injectable()
export class MessagingService implements IMessaging {
  constructor(
    @Inject(MessagingProvider)
    private readonly messaging: admin.messaging.Messaging,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
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

  async sendMessageToTokens(
    params: IMessaginToTokensParams,
  ): Promise<string[]> {
    const { title, body, payload, userId, tokens } = params;
    console.log('Running sendMessageToTokens');

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
      console.log(err);
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
        console.log(err);
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
        console.log(err);
        throw new HttpException(
          `Error sending message: ${err.message}`,
          HttpStatus.NO_CONTENT,
        );
      });
  }
}
