import { IsNotEmpty, IsUUID } from 'class-validator';

export class ExitClassDto {
  @IsNotEmpty()
  @IsUUID()
  classId: string;
}
