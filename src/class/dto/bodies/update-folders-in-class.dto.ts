import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateFoldersInClassDto {
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  folderIds: string[];
}
