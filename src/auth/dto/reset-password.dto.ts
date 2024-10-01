import { Column } from 'typeorm';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @Column()
  email: string;

  @IsNotEmpty()
  @Column()
  otp: string;

  @IsNotEmpty()
  @Column()
  resetPasswordToken: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @Column()
  newPassword: string;
}
