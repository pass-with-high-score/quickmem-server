import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetFoldersByOwnerIdDto {
  @IsNotEmpty()
  @IsUUID()
  ownerId: string;
}
