import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetTotalTimeByStudySetIdParamDto {
  @IsUUID()
  @IsNotEmpty()
  studySetId: string;
}
