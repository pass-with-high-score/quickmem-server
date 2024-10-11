import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchClassByTitleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  size?: number;

  @IsOptional()
  page?: number;
}
