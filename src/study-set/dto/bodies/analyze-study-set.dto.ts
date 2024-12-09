import { IsUUID, IsNotEmpty } from 'class-validator';

export class AnalyzeStudySetDto {
  @IsUUID()
  @IsNotEmpty()
  studySetId: string;
}
