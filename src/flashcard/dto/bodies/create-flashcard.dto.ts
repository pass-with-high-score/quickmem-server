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
}
