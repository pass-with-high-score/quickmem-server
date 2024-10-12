import { IsEnum, IsInt, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';
import { CoinAction } from '../../enums/coin-action.enum';

export class UpdateCoinDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10)
  coin: number;

  @IsNotEmpty()
  @IsEnum(CoinAction)
  action: CoinAction;
}
