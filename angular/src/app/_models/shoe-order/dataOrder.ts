import { Moment } from "moment";
import { ShoeOrderDetailDto } from "./shoeOrderDetailDto";

export class DataOrder {
    OrderUser: string;
    OrderNo: string;
    OrderDate: Moment | null;
    ShoesList: ShoeOrderDetailDto[];
  }
  