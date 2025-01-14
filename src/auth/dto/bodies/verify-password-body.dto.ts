import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class VerifyPasswordBodyDto {
  @IsUUID()
  @IsNotEmpty()
  readonly userId: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
