import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetUserProfileParamDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
