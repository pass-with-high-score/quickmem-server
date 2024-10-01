import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class OptionDto {
  @IsOptional()
  @IsString()
  answerText: string;

  @IsNotEmpty()
  @IsBoolean()
  isCorrect: boolean;

  @IsOptional()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  imageURL: string[];
}
