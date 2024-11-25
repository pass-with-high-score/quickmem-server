import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateRecentFolderBodyDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  folderId: string;
}
