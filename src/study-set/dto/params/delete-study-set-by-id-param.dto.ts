import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteStudySetByIdParamDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
