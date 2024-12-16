import { InviteStatusEnum } from '../enums/invite-status.enum';

export interface InviteUserJoinClassResponseInterface {
  message: string;
  status: boolean;
  inviteStatus: InviteStatusEnum;
}
