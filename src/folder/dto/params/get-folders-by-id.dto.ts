import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetFoldersByIdDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
