import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';

export class VerifyPasswordBodyDto {
  @IsUUID()
  @IsNotEmpty()
  readonly userId: string;
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  readonly password: string;
}
