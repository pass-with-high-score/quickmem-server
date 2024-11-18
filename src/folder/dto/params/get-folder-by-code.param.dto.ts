import { IsNotEmpty, IsString } from 'class-validator';

export class GetFolderByCodeParamDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
