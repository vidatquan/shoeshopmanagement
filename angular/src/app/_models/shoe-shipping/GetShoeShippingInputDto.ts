import { Moment } from "moment";

export class GetShoeShippingInputDto {
    FromDate: Moment | null;
    ToDate: Moment | null;
    ShippingNo: string;
    CusName:string;
    CusTel:string;
  }