import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateStatusParamDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
