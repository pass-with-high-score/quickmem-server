import { IsNotEmpty, IsString } from 'class-validator';

export class GetSpeechQueryDto {
  @IsNotEmpty()
  @IsString()
  voiceCode: string;

  @IsNotEmpty()
  @IsString()
  input: string;
}
