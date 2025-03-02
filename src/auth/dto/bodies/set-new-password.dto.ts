import { IsNotEmpty, MinLength } from 'class-validator';

export class SetNewPasswordDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
