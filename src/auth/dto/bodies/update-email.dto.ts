import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateEmailDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
