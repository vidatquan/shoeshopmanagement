using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.DTO.Shoe_order
{
    public class ShoesOrderDetail
    {
        public int ShoeOrderId { get; set; }
        public int ShoeId { get; set; }
        public int OrderQty { get; set; }
        public float Price { get; set; }
    }
}
