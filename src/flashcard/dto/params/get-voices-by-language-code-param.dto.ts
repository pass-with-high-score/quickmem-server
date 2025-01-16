import { IsNotEmpty, IsString } from 'class-validator';

export class GetVoicesByLanguageCodeParamDto {
  @IsNotEmpty()
  @IsString()
  languageCode: string;
}
