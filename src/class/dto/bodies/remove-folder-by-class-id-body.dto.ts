import { IsNotEmpty, IsUUID } from 'class-validator';

export class RemoveFolderByClassIdBodyDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsUUID()
  @IsNotEmpty()
  folderId: string;
}
