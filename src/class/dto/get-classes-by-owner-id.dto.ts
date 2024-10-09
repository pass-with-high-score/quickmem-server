import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetClassesByOwnerIdDto {
  @IsNotEmpty()
  @IsUUID()
  ownerId: string;
}
