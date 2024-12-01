import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetFlashcardsByFolderIdDto {
  @IsNotEmpty({ message: 'Folder Id is required' })
  @IsUUID()
  id: string;
}
