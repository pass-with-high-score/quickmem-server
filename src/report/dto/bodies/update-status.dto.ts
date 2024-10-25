import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReportStatusEnum } from '../../enums/report-status.enum';

export class UpdateStatusDto {
  @IsEnum(ReportStatusEnum)
  @IsNotEmpty()
  status: ReportStatusEnum;
}
