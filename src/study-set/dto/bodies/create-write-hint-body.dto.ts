import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateWriteHintBodyDto {
  @IsNotEmpty()
  @IsUUID()
  studySetId: string;
}
