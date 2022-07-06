import { Moment } from "moment";

export class ShoeOrderDetailDto {
   // Id: number;
    ShoeOrderId: number;
    ShoeId: number;
    OrderQty: Moment | null;
    Price:number;
  }
  