import { IsNotEmpty, IsUUID } from 'class-validator';

export class RemoveMembersFromClassDto {
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID(4, { each: true })
  memberIds: string[];
}
