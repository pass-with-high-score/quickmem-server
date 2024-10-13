import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetStreaksByUserIdParamDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
