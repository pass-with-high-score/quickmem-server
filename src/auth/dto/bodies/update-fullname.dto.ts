import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFullnameDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;
}
