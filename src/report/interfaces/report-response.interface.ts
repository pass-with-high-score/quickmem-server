import { ReportEnum } from "../enums/report.enum";

export interface ReportResponseInterface {
    id: string;
    reason: string;
    reportedType: ReportEnum;
    createdAt: Date;
    updatedAt: Date;
  }