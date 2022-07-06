using AppApi.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.Entity
{
    public class Shoes
    {
        public int Id { get; set; }
        public string ShoeName { get; set; }
        public string ShoeCode { get; set; }
        public int? ShoeQty { get; set; }
        public int? ShoeSize { get; set; }
        public float? RealPrice { get; set; }
        public float? SellPrice { get; set; }
        public string Color { get; set; }
        public Gender? Gender { get; set; }
        public ShoeType? ShoeType { get; set; }
        public string Note { get; set; }
        public byte[] Img { get; set; }
        public string ImageString { get; set; }
        public int? IsDeleted { get; set; }
        public DateTime ModifyPriceTime { get; set; }
        
    }
}
