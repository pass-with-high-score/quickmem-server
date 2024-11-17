import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetTotalTimeByUserIdParamDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
