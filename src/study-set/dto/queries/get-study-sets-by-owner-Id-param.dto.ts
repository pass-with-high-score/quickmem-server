import { IsOptional, IsUUID } from 'class-validator';

export class GetStudySetsByOwnerIdParamDto {
  @IsOptional()
  @IsUUID()
  folderId: string;

  @IsOptional()
  @IsUUID()
  classId: string;
}
