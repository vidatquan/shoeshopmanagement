import { Moment } from "moment";

export class ShoeReceive {
    Id : number;
    ReceiveUser: string;
    ReceiveNo:string;
    OrderNo: string;
    ReceiveDate: Moment | null;
  }