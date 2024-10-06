export interface IMessaginToTokensParams {
  title: string;
  body: string;
  payload: { [key: string]: string };
  tokens: string[];
  userId?: string;
}

export interface IMessaginToTopicParams {
  title: string;
  body: string;
  payload: { [key: string]: string };
  topic: string;
}

export interface IMessaginToConditionParams {
  title: string;
  body: string;
  payload: { [key: string]: string };
  condition: string;
}

export interface IMessaging {
  sendMessageToTokens(params: IMessaginToTokensParams): Promise<string[]>;

  sendMessageToTopic(params: IMessaginToTopicParams): Promise<string>;

  sendMessageToCondition(params: IMessaginToConditionParams): Promise<string>;
}
