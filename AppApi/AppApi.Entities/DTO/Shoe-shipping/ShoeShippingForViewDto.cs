using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.DTO.Shoe_shipping
{
    public class ShoeShippingForViewDto
    {
        public int Id { get; set; }
        public string ShippingUser { get; set; } // cusname
        public string ShippingNo { get; set; }
        public DateTime ShippingDate { get; set; }
        public int Status { get; set; }
        public float TotalPrice { get; set; }
        public int CusId { get; set; }
        public int CusRate { get; set; }
        //public string CusName { get; set; }
        public string CusTel { get; set; }
        public string CusAdd { get; set; }
        public float ShoeBuyPrice { get; set; }
        public string SalesMan { get; set; }
        public string Note { get; set; }
        public List<ShoeShippingDetailForViewDto> ShoesList { get; set; }
    }
}
