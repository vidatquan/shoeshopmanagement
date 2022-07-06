using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.DTO.Shoe_Report
{
    public class TopShoeSaleForViewDto
    {
        public string ShoeCode { get; set; }
        public string ShoeName { get; set; }
        public int ShoeQty { get; set; }
        public float TotalPrice { get; set; }
    }
}
