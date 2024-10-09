import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateClassByIdParamDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
