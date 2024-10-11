import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteFolderByIdDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
