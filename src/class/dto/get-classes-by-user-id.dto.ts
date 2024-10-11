import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetClassesByUserIdDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
