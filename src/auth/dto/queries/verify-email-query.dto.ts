import { IsNotEmpty, IsUUID } from 'class-validator';

export class VerifyEmailQueryDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  token: string;
}
