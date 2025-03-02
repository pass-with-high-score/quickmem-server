import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class VerifyPasswordBodyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
