import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateRecentStudySetDto {
  @IsUUID()
  @IsNotEmpty()
  studySetId: string;
}
