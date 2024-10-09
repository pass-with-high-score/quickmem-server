import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetClassByIdParamDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
