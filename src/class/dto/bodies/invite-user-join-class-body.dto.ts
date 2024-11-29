import { IsNotEmpty, IsUUID } from 'class-validator';

export class InviteUserJoinClassBodyDto {
  @IsUUID()
  @IsNotEmpty()
  classId: string;
  @IsNotEmpty()
  username: string;
}
