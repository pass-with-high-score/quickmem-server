import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateFlashcardDto {
  @IsNotEmpty()
  @IsString()
  term: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  termImageURL: string;

  @IsNotEmpty()
  @IsString()
  definition: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  definitionImageURL: string;

  @IsOptional()
  @IsString()
  hint: string;

  @IsOptional()
  @IsString()
  explanation: string;

  @IsNotEmpty()
  @IsUUID()
  studySetId: string;

  @IsOptional()
  @IsString()
  termVoiceCode: string;

  @IsOptional()
  @IsString()
  definitionVoiceCode: string;
}
