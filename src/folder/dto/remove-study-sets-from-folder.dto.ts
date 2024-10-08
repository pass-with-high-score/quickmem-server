import { IsNotEmpty, IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class RemoveStudySetsFromFolderDto {
  @IsNotEmpty()
  @IsUUID()
  folderId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  studySetIds: string[];
}
