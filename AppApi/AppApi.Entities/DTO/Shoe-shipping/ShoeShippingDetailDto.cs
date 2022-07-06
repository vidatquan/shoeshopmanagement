using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.DTO.Shoe_shipping
{
    public class ShoeShippingDetailDto
    {
        public int ShoeShippingId { get; set; }
        public int ShoeId { get; set; }
        public int ShipQty { get; set; } 
        public float Price { get; set; } 
    }
}

