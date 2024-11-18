import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetClassByJoinTokenQueryDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
