import { IsNotEmpty, IsUUID } from 'class-validator';

export class DuplicateStudySetDto {
  @IsNotEmpty()
  @IsUUID()
  studySetId: string;
}
