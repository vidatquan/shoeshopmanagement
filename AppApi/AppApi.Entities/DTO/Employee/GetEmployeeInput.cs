using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.Entities.DTO.Employee
{
    public class GetEmployeeInput
    {
        public string FullName { get; set; }
        public string Code { get; set; }
        public string Tel { get; set; }
        public int IsDeleted { get; set; }
    }
}
