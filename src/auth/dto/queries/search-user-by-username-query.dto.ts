import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SearchUserByUsernameQueryDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  size?: number;

  @IsOptional()
  page?: number;
}
