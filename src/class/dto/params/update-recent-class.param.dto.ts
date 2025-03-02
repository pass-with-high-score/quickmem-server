import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateRecentClassParamDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
