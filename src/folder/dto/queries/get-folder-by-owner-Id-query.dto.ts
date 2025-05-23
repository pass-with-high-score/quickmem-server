import { IsOptional, IsUUID } from 'class-validator';

export class GetFolderByOwnerIdQueryDto {
  @IsOptional()
  @IsUUID()
  studySetId: string;
}
