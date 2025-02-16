import { IsEmail, IsNotEmpty } from 'class-validator';

export class CheckEmailQueryDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
