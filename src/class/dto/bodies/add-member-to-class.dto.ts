import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class AddMemberToClassDto {
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  memberIds: string[];
}
