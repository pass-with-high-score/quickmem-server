import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SetNewPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
