import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeUsernameBodyDto {
  @IsString()
  @IsNotEmpty()
  newUsername: string;
}
