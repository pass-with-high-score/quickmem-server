import { Column } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @Column()
  email: string;
}
