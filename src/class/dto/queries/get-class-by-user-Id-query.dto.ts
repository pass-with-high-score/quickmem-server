import { IsOptional, IsUUID } from 'class-validator';

export class GetClassByUserIdQueryDto {
  @IsOptional()
  @IsUUID()
  studySetId: string;

  @IsOptional()
  @IsUUID()
  folderId: string;
}
