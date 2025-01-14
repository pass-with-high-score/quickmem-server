import { Column } from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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
  @MinLength(6)
  @Column()
  newPassword: string;
}
