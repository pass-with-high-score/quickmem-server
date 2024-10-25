import { ReportEnum } from "../enums/report.enum";

export interface ReportResponseInterface {
    id: string;
    reason: string;
    status: string;
    reportedType: ReportEnum;
    createdAt: Date;
    updatedAt: Date;
  }