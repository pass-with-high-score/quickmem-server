import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateAutoRenewBodyDto {
  @IsBoolean()
  @IsNotEmpty()
  isAutoRenew: boolean;
}
