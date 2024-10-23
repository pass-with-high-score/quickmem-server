import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ReportEnum } from '../../enums/report.enum';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsEnum(ReportEnum)
  reportedType: ReportEnum;

  @IsString()
  @IsNotEmpty()
  reporterId: string;
}