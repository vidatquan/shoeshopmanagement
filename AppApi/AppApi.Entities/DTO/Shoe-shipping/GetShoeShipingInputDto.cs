using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.DTO.Shoe_shipping
{
    public class GetShoeShipingInputDto
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string ShippingNo { get; set; }
        public string CusName { get; set; }
        public string CusTel { get; set; }
    }
}
