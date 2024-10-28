import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateAvatarParamDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
