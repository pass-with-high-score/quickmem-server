import { Column } from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsStrongPassword,
} from 'class-validator';

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
  reset_password_token: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @Column()
  new_password: string;
}
