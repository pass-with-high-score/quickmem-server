import { IsNotEmpty, IsUUID } from 'class-validator';

export class UploadAvatarParamDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
