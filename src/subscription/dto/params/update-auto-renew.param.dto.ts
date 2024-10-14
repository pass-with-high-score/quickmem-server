import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateAutoRenewParamDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
