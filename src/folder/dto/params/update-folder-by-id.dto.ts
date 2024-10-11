import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateFolderByIdDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
