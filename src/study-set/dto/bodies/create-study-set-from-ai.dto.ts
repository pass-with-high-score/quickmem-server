import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateStudySetFromAiDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}
