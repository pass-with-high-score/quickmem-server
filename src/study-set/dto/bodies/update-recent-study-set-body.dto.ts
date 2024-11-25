import { IsUUID } from 'class-validator';

export class UpdateRecentStudySetDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  studySetId: string;
}
