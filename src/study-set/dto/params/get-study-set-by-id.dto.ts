import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetStudySetByIdDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
