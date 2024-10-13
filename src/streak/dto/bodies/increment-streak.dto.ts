import { IsNotEmpty, IsUUID } from 'class-validator';

export class IncrementStreakDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
