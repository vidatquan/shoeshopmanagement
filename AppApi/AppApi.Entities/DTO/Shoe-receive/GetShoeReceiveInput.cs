using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.DTO.Shoe_receive
{
    public class GetShoeReceiveInput
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string ReceiveNo { get; set; }
    }
}
