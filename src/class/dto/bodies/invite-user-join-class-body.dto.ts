import { IsNotEmpty, IsUUID } from 'class-validator';

export class InviteUserJoinClassBodyDto {
  @IsUUID()
  @IsNotEmpty()
  classId: string;
  @IsUUID()
  @IsNotEmpty()
  userId: string;
  @IsUUID()
  @IsNotEmpty()
  ownerUserId: string;
}
