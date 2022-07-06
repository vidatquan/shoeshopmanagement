import { Moment } from "moment";

export class ReportProfitsViewDto {
    Code: string;
    Date: Moment | null;
    ShoeQty:number;
    TotalQty: number;
    TotalPrice: number;
    Status:number;
  }
