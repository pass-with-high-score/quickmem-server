import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SearchFoldersByTitleQueryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  size?: number;

  @IsOptional()
  page?: number;
}
