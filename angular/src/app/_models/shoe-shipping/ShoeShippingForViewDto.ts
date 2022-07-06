import { Moment } from "moment";
import { ShoeShippingDetailForViewDto } from "./ShoeShippingDetailForViewDto";

export class ShoeShippingForViewDto {
    Id:number;
    ShippingUser: string;
    ShippingNo:string;
    ShippingDate: Moment | null;
    Status:number;
    TotalPrice:number;
    CusId:number;
    CusTel:string;
    CusAdd:string;
    ShoeBuyPrice:number;
    SalesMan:number;
    Note:number;
    ShoesList: ShoeShippingDetailForViewDto[];
  }
