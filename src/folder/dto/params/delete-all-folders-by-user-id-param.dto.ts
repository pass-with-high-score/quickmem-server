import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteAllFoldersByUserIdParamDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
