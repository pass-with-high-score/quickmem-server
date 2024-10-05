import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { MessagingProvider } from './messaging.provider';
import * as admin from 'firebase-admin';
import {
  IMessaging,
  IMessaginToConditionParams,
  IMessaginToTokensParams,
  IMessaginToTopicParams,
} from './imessaging.interface';

@Injectable()
export class MessagingService implements IMessaging {
  constructor(
    @Inject(MessagingProvider)
    private readonly messaging: admin.messaging.Messaging,
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
    const { title, body, payload, tokens } = params;
    return await this.messaging
      .sendEachForMulticast({
        tokens: tokens,
        data: payload,
        notification: {
          title: title,
          body: body,
        },
        android: this.android,
        apns: this.apns,
      })
      .then((response) => {
        if (response.failureCount > 0) {
          const failedTokens: string[] = [];
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              failedTokens.push(tokens[idx]);
            }
          });
          return failedTokens;
        } else {
          return [];
        }
      })
      .catch((err) => {
        throw new HttpException(
          `Error sending message: ${err.message}`,
          HttpStatus.NO_CONTENT,
        );
      });
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
}
