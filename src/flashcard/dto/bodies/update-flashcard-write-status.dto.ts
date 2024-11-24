import { IsEnum, IsNotEmpty } from 'class-validator';
import { WriteStatusEnum } from '../../enums/write-status.enum';

export class UpdateFlashcardWriteStatusDto {
  @IsNotEmpty()
  @IsEnum(WriteStatusEnum)
  writeStatus: WriteStatusEnum;
}
