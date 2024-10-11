import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateFullnameDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  fullname: string;
}
