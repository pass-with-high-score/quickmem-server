import { IsNotEmpty, IsUUID } from 'class-validator';

export class ExitClassDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  classId: string;
}
