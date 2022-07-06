using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.Entity
{
    public class ShoeOrder
    {
        public int Id { get; set; }
        public DateTime? OrderDate { get; set; }
        public string OrderUser { get; set; }
        public string OrderNo { get; set; }
        public int OrderStatus { get; set; }
    }
}
