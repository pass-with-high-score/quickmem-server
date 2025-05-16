import { IsOptional, IsUUID } from 'class-validator';

export class GetStudySetsByOwnerIdQueryDto {
  @IsOptional()
  @IsUUID()
  folderId: string;
}
