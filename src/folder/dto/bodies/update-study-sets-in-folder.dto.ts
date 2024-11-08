import { IsNotEmpty, IsUUID, IsArray } from 'class-validator';

export class UpdateStudySetsInFolderDto {
  @IsNotEmpty()
  @IsUUID()
  folderId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  studySetIds: string[];
}
