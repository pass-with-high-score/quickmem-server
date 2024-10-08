import { IsNotEmpty, IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class AddStudySetsToFolderDto {
  @IsNotEmpty()
  @IsUUID()
  folderId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  studySetIds: string[];
}
