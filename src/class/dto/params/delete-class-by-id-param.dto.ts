import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteClassByIdParamDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
