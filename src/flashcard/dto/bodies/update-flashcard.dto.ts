import { IsOptional, IsString } from 'class-validator';

export class UpdateFlashcardDto {
  @IsOptional()
  @IsString()
  term?: string;

  @IsOptional()
  @IsString()
  termImageURL?: string;

  @IsOptional()
  @IsString()
  definition?: string;

  @IsOptional()
  @IsString()
  definitionImageURL?: string;

  @IsOptional()
  @IsString()
  hint?: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsString()
  termVoiceCode?: string;

  @IsOptional()
  @IsString()
  definitionVoiceCode?: string;
}
