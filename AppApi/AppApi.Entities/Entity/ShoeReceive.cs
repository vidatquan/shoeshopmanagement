using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.Entity
{
    public class ShoeReceive
    {
        public int Id { get; set; }
        public DateTime? ReceiveDate { get; set; }
        public string ReceiveUser { get; set; }
        public string ReceiveNo { get; set; }
        public string OrderNo { get; set; }
    }
}

