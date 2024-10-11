import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateStudySetByIdBodyDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsInt()
  @IsOptional()
  subjectId?: number;

  @IsInt()
  @IsOptional()
  colorId?: number;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}
