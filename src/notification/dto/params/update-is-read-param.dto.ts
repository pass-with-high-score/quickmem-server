import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateIsReadParamDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
