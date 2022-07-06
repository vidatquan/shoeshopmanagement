using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.DTO.Shoe_receive
{
    public class ShoeReceiveDetailForViewDto
    {
        public string ShoeCode { get; set; }
        public string ShoeName { get; set; }
        public int ShoeQty { get; set; }
        public float? RealPrice { get; set; }
        public int OrderQty { get; set; } // SL đặt
        public int DeliveryQty { get; set; } // SL giao
        public int ReceiveActQty { get; set; } //SL thực nhận
        public int ShoeId { get; set; }
    }
}
