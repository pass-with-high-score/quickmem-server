import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetStudySetsByOwnerIdDto {
  @IsNotEmpty()
  @IsUUID()
  ownerId: string;
}
