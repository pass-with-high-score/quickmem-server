import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class SearchFolderByTitleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  size?: number;

  @IsOptional()
  page?: number;
}
