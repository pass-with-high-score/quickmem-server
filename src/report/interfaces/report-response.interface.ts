import { ReportEnum } from '../enums/report.enum';

export interface ReportResponseInterface {
  id: string;
  reason: string;
  status: string;
  reporter: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatarUrl: string;
  };
  reportedEntityId: string;
  reportedType: ReportEnum;
  ownerOfReportedEntityId: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatarUrl: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
