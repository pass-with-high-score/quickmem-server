import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetFoldersByUserIdDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
