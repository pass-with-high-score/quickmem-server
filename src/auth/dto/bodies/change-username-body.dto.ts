import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ChangeUsernameBodyDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  newUsername: string;
}
