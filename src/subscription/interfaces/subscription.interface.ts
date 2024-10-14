export interface SubscriptionInterface {
  id: string;
  userId: string;
  subscriptionType: string;
  trialForType?: string;
  isTrial?: boolean;
  isActive?: boolean;
  isAutoRenew?: boolean;
  startDate?: Date;
  endDate?: Date;
}
