import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteAllStudySetByUserIdParamDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
