import { IsNotEmpty, IsString } from 'class-validator';

export class GetStudySetByCodeParamDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
