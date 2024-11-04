import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetUserDetailParamDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
