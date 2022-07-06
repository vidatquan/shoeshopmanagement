using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.Entity
{
    public class HistoryShoePrice
    {
        public int Id { get; set; }
        public int ShoeId { get; set; }
        public float RealPrice { get; set; }
        public float SellPrice { get; set; }
        public DateTime ApplyDate { get; set; }
        public DateTime ExpiryDate { get; set; }

    }
}
