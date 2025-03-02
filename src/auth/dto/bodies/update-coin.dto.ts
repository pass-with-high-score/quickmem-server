import { IsEnum, IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { CoinAction } from '../../enums/coin-action.enum';

export class UpdateCoinDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10)
  coin: number;

  @IsNotEmpty()
  @IsEnum(CoinAction)
  action: CoinAction;
}
