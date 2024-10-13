import { StreakInterface } from './streak.interface';

export interface GetStreaksResponseInterface {
  userId: string;
  streaks: StreakInterface[];
}
