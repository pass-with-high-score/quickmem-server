import { IsNotEmpty, IsString } from 'class-validator';

export class JoinClassByTokenParamDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
