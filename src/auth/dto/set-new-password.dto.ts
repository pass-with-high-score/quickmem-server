import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class SetNewPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  @IsStrongPassword()
  newPassword: string;
}
