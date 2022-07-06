import { Moment } from "moment";

export class GetShoeOrdersInput {
    OrderNo: string;
    Orderstatus: number;
    FromDate: Moment | null;
    ToDate: Moment | null;
  }
  