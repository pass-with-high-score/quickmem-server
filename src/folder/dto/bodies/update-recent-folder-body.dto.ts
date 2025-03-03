import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateRecentFolderBodyDto {
  @IsUUID()
  @IsNotEmpty()
  folderId: string;
}
