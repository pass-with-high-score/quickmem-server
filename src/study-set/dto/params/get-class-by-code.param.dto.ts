import { IsNotEmpty, IsString } from 'class-validator';

export class GetClassByCodeParamDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
