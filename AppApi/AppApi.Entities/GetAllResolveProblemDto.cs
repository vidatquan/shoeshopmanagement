using System;
using System.ComponentModel.DataAnnotations;

namespace AppApi.Entities
{
    public class GetAllResolveProblemDto
    {
        public int Id { get; set; }
        public int CardId { get; set; }
        [StringLength(20)]
        public string RegisterNo { get; set; }
        public int InGateEmpId { get; set; }
        public string InGateEmpName { get; set; }
        public int ResolveEmpId { get; set; }
        public string ResolveEmpName { get; set; }
        public DateTime InGateDate { get; set; }
        public DateTime ResolveTime { get; set; }
        public int VehicleType { get; set; }
    }
}
