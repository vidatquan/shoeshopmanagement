using AppApi.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.DTO.Shoe_info
{
    public class GetShoeInfoInput
    {
        public string ShoeName { get; set; }
        public string ShoeCode { get; set; }
        public int? ShoeSize { get; set; }
        public string Color { get; set; }
        public Gender? Gender { get; set; }
        public ShoeType? ShoeType { get; set; }
        public int? IsDeleted { get; set; }
    }
}
