import { ReportEnum } from '../enums/report.enum';

export interface ReportResponseInterface {
  id: string;
  reason: string;
  status: string;
  reporter: string;
  reportedEntityId: string;
  reportedType: ReportEnum;
  createdAt: Date;
  updatedAt: Date;
}
