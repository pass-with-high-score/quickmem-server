import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateStudySetByIdParamDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
