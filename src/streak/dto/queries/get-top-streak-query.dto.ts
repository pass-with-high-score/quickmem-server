import { IsOptional } from 'class-validator';

export class GetTopStreakQueryDto {
  @IsOptional()
  limit: number;
}
