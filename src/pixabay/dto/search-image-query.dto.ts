import { IsNotEmpty, IsString } from 'class-validator';

export class SearchImageQueryDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
