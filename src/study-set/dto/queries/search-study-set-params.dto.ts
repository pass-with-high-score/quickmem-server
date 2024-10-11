import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FlashCardCountOption } from '../../enums/flash-card-count-option.enum';
import { CreatorTypeEnum } from '../../enums/creator-type.enum';

export class SearchStudySetParamsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsEnum(FlashCardCountOption)
  @IsOptional()
  size?: FlashCardCountOption;

  @IsEnum(CreatorTypeEnum)
  @IsOptional()
  creatorType?: CreatorTypeEnum;

  @IsOptional()
  page?: number;
}
