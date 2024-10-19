import { IsBoolean, IsNotEmpty } from 'class-validator';

export class StarredFlashcardDto {
  @IsNotEmpty()
  @IsBoolean()
  isStarred: boolean;
}
