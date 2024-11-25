import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetStudySetsByUserIdDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
