import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class AddFolderToClassDto {
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  folderIds: string[];
}
