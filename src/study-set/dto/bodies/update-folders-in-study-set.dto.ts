import { IsNotEmpty, IsUUID, IsArray } from 'class-validator';

export class UpdateFoldersInStudySetDto {
  @IsNotEmpty()
  @IsUUID()
  studySetId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  folderIds: string[];
}
