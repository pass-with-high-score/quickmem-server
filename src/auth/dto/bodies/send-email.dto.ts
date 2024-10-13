import { Column } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @Column()
  email: string;
}
