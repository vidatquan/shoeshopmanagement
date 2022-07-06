using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.DTO.Shoe_shipping
{
    public class SaveShippingShoeDto
    {
            public int Id { get; set; }
            public string ShippingUser { get; set; }
            public string ShippingNo { get; set; }
            public DateTime ShippingDate { get; set; }
            public int Status { get; set; }
            public float TotalPrice { get; set; }
            public int CusId { get; set; } // lấy sdt
            public int CusRate { get; set; }
            public string SalesMan { get; set; }
            public string Note { get; set; }
            public List<ShoeShippingDetailDto> ShoesList { get; set; }
    }
}

