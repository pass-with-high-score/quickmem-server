import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class AddFoldersToClassDto {
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  folderIds: string[];
}
