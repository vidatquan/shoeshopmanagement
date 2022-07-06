import { Moment } from "moment";
import { ShoeReceiveDetailDto } from "./ShoeReceiveDetailDto";

export class SaveReceiveShoeDto {
    ShoeOrderId: number;
    ReceiveUser: string;
    ReceiveNo:string;
    OrderNo:string;
    ReceiveDate: Moment | null;
    ShoesList: ShoeReceiveDetailDto[];
    CheckShoeOrderComplete: number; // kiểm tra đơn hàng đã nhận được hết hay chưa
  }
