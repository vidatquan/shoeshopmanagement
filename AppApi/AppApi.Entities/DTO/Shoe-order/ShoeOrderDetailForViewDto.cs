using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.DTO.Shoe_order
{
    public class ShoeOrderDetailForViewDto
    {
        public string ShoeCode { get; set; }
        public string ShoeName { get; set; }
        public int ShoeQty { get; set; }
        public float? RealPrice { get; set; }
        public int OrderQty { get; set; }
        public int ReceiveActQty { get; set; }
        public int ShoeId { get; set; }
        public float Price { get; set; }

    }
}
