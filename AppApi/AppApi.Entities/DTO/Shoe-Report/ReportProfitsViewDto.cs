using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.DTO.Shoe_Report
{
    public class ReportProfitsViewDto
    {
        public string Code { get; set; }
        public DateTime Date { get; set; }
        public int ShoeQty { get; set; }
        public int TotalQty { get; set; } // tổng số lượng sản phẩm
        public float TotalPrice { get; set; }
        public int Status { get; set; }
    }
}
