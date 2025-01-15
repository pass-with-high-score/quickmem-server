import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteAllClassByUserIdParamDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
