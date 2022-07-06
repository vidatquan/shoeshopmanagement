import { Moment } from "moment";
import { ShoeShippingDetailDto } from "./ShoeShippingDetailDto";

export class SaveShippingShoeDto {
    Id:number;
    ShippingUser: string;
    ShippingNo:string;
    ShippingDate: Moment | null;
    Status:number;
    TotalPrice:number;
    CusId:number;
    SalesMan:number;
    Note:number;
    CusRate:number;
    ShoesList: ShoeShippingDetailDto[];
  }