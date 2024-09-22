import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsUUID,
} from 'class-validator';

export class CreateStudySetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUUID()
  ownerId: string;

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
