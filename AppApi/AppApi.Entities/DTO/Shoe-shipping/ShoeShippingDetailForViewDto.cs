using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.DTO.Shoe_shipping
{
    public class ShoeShippingDetailForViewDto
    {
        public string ShoeCode { get; set; }
        public string ShoeName { get; set; }
        public int ShoeQty { get; set; }
        public float? SellPrice { get; set; }
        public int ShippingQty { get; set; }
        public int ShoeId { get; set; }
    }
}
