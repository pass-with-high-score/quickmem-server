import { IsOptional } from 'class-validator';

export class GetStudySetsBySubjectIdQueryDto {
  @IsOptional()
  page: number;

  @IsOptional()
  size: number;
}
