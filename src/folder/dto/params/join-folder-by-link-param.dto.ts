import { IsNotEmpty } from 'class-validator';

export class JoinFolderByLinkParamDto {
  @IsNotEmpty()
  folderLinkCode: string;
}
