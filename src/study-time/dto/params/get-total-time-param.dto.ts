import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetTotalTimeParamDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
