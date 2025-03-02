import { IsNotEmpty, IsUUID } from 'class-validator';

export class RemoveStudySetByClassIdBodyDto {
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsUUID()
  @IsNotEmpty()
  studySetId: string;
}
