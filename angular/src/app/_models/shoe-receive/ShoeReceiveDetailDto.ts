export class ShoeReceiveDetailDto {
    ShoeReceiveId : number;
    ShoeId:number;
    OrderQty:number; //sl  đặt
    DeliveryQty:number; //sl giao
    ReceiveQty:number; // sl nhận thực
    ShoeReceivedQtyInStock:number; //sl cần nhận thêm
    CheckReceiveComplete:number; // check xem mã giày đã nhận đủ chưa
    Price:number;
  }
