import { IsNotEmpty } from 'class-validator';

export class GetStudySetsBySubjectIdParamDto {
  @IsNotEmpty()
  subjectId: number;
}
