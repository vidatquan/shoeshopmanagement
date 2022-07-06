using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.DTO.Shoe_order
{
    public class GetShoeOrderInput
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string OrderNo { get; set; }
        public int OrderStatus { get; set; }
    }
}
