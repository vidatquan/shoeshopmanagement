using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.DTO.Shoe_receive
{
    public class SaveReceiveShoeDto
    {
        public int ShoeOrderId { get; set; }
        public string ReceiveUser { get; set; }
        public string ReceiveNo { get; set; }
        public string OrderNo { get; set; }
        public DateTime ReceiveDate { get; set; }
        public List<ShoeReceiveDetailDto> ShoesList { get; set; }
        public int CheckShoeOrderComplete { get; set; } // kiểm tra đơn hàng đã nhận được hết hay chưa

    }
}
