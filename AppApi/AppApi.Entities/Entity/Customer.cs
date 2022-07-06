using System;
using System.ComponentModel.DataAnnotations;

namespace AppApi.Entities.Entity
{
    public class Customer
    {
        public int Id { get; set; }
        [StringLength(50)]
        public string CusName { get; set; }
        public DateTime Birthday { get; set; }
        public string CusEmail { get; set; }
        public string CusTel { get; set; }
        public string CusCmnd { get; set; }
        public string CusAdd { get; set; }
        public int AreaId { get; set; }
        public float CusShoeBuyPrice { get; set; }
        public int IsDeleted { get; set; }
        
    }
}
