import { IsEnum, IsNotEmpty } from 'class-validator';
import { TrueFalseStatusEnum } from '../../enums/true-false-status.enum';

export class UpdateFlashcardTrueFalseStatusDto {
  @IsNotEmpty()
  @IsEnum(TrueFalseStatusEnum)
  trueFalseStatus: TrueFalseStatusEnum;
}
