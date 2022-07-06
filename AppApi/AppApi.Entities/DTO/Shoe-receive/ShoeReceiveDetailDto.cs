using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.DTO.Shoe_receive
{
    public class ShoeReceiveDetailDto
    {
        public int ShoeReceiveId { get; set; }
        public int ShoeId { get; set; }
        public int DeliveryQty { get; set; } //sl giao
        public int ReceiveQty { get; set; } // sl nhận thực
        public int ShoeReceivedQtyInStock { get; set; } //sl đã nhận cập nhật vào đặt hàng
        public int CheckReceiveComplete { get; set; }
        public int OrderQty { get; set; } //sl đặt
        public float Price { get; set; }
    }
}
