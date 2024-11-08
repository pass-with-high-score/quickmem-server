import { IsNotEmpty, IsUUID, IsArray } from 'class-validator';

export class UpdateClassesInStudySetDto {
  @IsNotEmpty()
  @IsUUID()
  studySetId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  classIds: string[];
}
