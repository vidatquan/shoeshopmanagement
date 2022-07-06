import { Moment } from "moment";


export class Order {
  Id: number;
  OrderName: string;
  OrderCode: string;
  DeliveryAdd: string;
  Status: string;
  ErrStatus: string;
  ReceiveDate: Moment | null;
  CreateDate : Moment | null;
  AreaId: number;
  UserId: number;
  CustomerId: number;
  Price: number;
  Weight: number;
}
