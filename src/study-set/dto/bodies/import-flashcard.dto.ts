import { IsString, IsUrl } from 'class-validator';

export class ImportFlashcardDto {
  @IsString()
  @IsUrl()
  url: string;
}
