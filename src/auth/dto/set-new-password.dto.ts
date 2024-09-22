import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class SetNewPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  old_password: string;

  @IsNotEmpty()
  @IsStrongPassword()
  new_password: string;
}
