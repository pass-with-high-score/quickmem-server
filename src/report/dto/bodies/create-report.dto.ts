import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ReportEnum } from '../../enums/report.enum';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsUUID()
  @IsNotEmpty()
  reportedEntityId: string;

  @IsEnum(ReportEnum)
  reportedType: ReportEnum;

  @IsUUID()
  @IsNotEmpty()
  reporterId: string;

  @IsUUID()
  @IsNotEmpty()
  ownerOfReportedEntityId: string;
}
