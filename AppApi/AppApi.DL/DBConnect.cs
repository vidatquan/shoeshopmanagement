using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.DL
{
    public class DBConnect
    {
        //protected SqlConnection _conn = new SqlConnection("server=171.244.3.173,1433;database=shippers;uid=sa;password=chuongtq@1999;");
        protected SqlConnection _conn = new SqlConnection(@"Data Source=DESKTOP-AIS0QJ5\KTEAM;Initial Catalog=quanlyshopgiay; Integrated Security=True");
    }
}
