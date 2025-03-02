import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateStudySetsInClassDto {
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  studySetIds: string[];
}
