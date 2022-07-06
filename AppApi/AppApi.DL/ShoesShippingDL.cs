using AppApi.Entities.DTO.Shoe_receive;
using AppApi.Entities.DTO.Shoe_Report;
using AppApi.Entities.DTO.Shoe_shipping;
using AppApi.Entities.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppApi.DL
{
    public class ShoesShippingDL : DBConnect
    {
        #region GetShoeShipping

        public List<ShoeShippingForViewDto> GetShoeShipping(GetShoeShipingInputDto input)
        {
            if(input.FromDate.HasValue) input.FromDate = input.FromDate.Value.AddHours(7);
            if (input.ToDate.HasValue) input.ToDate = input.ToDate.Value.AddHours(7);

            _conn.Open();

            string spName = @"dbo.[GetShoeShipping]";
            SqlCommand cmd = new SqlCommand(spName, _conn);

            cmd.Parameters.AddWithValue("@ShippingNo", input.ShippingNo);
            cmd.Parameters.AddWithValue("@FromDate", input.FromDate);
            cmd.Parameters.AddWithValue("@ToDate", input.ToDate);
            cmd.Parameters.AddWithValue("@CusTel", input.CusTel);
            cmd.Parameters.AddWithValue("@CusName", input.CusName);

            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataReader sqlDataReader = cmd.ExecuteReader();

            var shippings = new List<ShoeShippingForViewDto>();
            if (sqlDataReader.HasRows)
            {
                while (sqlDataReader.Read())
                {
                    var shipping = new ShoeShippingForViewDto();
                    if (!Convert.IsDBNull(sqlDataReader["id"]))  shipping.Id = (int)sqlDataReader["id"];
                    if (!Convert.IsDBNull(sqlDataReader["shippinguser"]))  shipping.ShippingUser = sqlDataReader["shippinguser"].ToString();
                    if (!Convert.IsDBNull(sqlDataReader["shippingno"]))  shipping.ShippingNo = sqlDataReader["shippingno"].ToString();
                    if (!Convert.IsDBNull(sqlDataReader["cusid"]))  shipping.CusId = (int)sqlDataReader["cusid"];
                    if (!Convert.IsDBNull(sqlDataReader["custel"]))  shipping.CusTel = sqlDataReader["custel"].ToString();
                    //shipping.CusName = sqlDataReader["CusName"].ToString();
                    if (!Convert.IsDBNull(sqlDataReader["cusadd"])) shipping.CusAdd = sqlDataReader["cusadd"].ToString();
                    if (!Convert.IsDBNull(sqlDataReader["cusrate"])) shipping.CusRate = (int)sqlDataReader["cusrate"];
                    if (!Convert.IsDBNull(sqlDataReader["shoebuyprice"]))  shipping.ShoeBuyPrice = (float)Convert.ToDouble(sqlDataReader["shoebuyprice"]);
                    if (!Convert.IsDBNull(sqlDataReader["salesman"]))  shipping.SalesMan = sqlDataReader["salesman"].ToString();
                    if (!Convert.IsDBNull(sqlDataReader["shippingdate"]))
                    {
                        shipping.ShippingDate = Convert.ToDateTime(sqlDataReader["shippingdate"]);
                    }

                    shippings.Add(shipping);
                }
            }
            _conn.Close();

            foreach(var ship in shippings)
            {
                #region -- Lấy chi tiết đơn hàng
                var body = new GetShoeReceiveDetailInput();
                body.Id = ship.Id;
                ship.ShoesList = GetShoeShippingDetail(body);
                #endregion
            }



            return shippings.ToList();
        }
        #endregion

        #region GetShoeOrderDetail
        private List<ShoeShippingDetailForViewDto> GetShoeShippingDetail(GetShoeReceiveDetailInput input)
        {
            _conn.Open();

            string spName = @"dbo.[GetShoeShippingDetail]";
            SqlCommand cmd = new SqlCommand(spName, _conn);

            cmd.Parameters.AddWithValue("@ShoeShippingId", input.Id);

            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataReader sqlDataReader = cmd.ExecuteReader();

            var shippingDetails = new List<ShoeShippingDetailForViewDto>();
            if (sqlDataReader.HasRows)
            {
                while (sqlDataReader.Read())
                {
                    var shippingDetail = new ShoeShippingDetailForViewDto();

                    shippingDetail.ShoeCode = sqlDataReader["shoecode"].ToString();
                    shippingDetail.ShoeName = sqlDataReader["shoename"].ToString();
                    shippingDetail.ShoeQty = (int)sqlDataReader["shoeqty"];
                    shippingDetail.ShippingQty = (int)sqlDataReader["shipqty"];
                    shippingDetail.SellPrice = (float)Convert.ToDouble(sqlDataReader["price"]);
                    shippingDetail.ShoeId = (int)sqlDataReader["id"];

                    shippingDetails.Add(shippingDetail);
                }
            }
            _conn.Close();
            return shippingDetails.ToList();
        }
        #endregion

        #region SaveShipping
        public bool SaveShippingDL(SaveShippingShoeDto input)
        {
            #region --Tạo đơn hàng shipping
            input.ShippingDate = input.ShippingDate.AddHours(7);
            int shippingId = 0;
            input.ShippingNo = "DH" + input.ShippingDate.Year.ToString().Substring(2, 2) + input.ShippingDate.Month.ToString("00") + input.ShippingDate.Day.ToString("00") + input.ShippingDate.Hour.ToString("00") + input.ShippingDate.Minute.ToString("00") + input.ShippingDate.Second.ToString("00");
            //tạo thông tin của đơn hàng 
            _conn.Open();
            string SQL = string.Format("INSERT INTO dbo.shoeshipping(shippinguser, shippingno, shippingdate,totalprice,cusid,salesMan, status, cusrate) VALUES (@ShippingUser, @ShippingNo, @ShippingDate,@TotalPrice,@CusId,@SalesMan, 0, @CusRate)");
            SqlCommand sqlCommand = new SqlCommand(SQL, _conn);
            sqlCommand.Parameters.AddWithValue("@ShippingUser", input.ShippingUser);
            sqlCommand.Parameters.AddWithValue("@ShippingNo", input.ShippingNo);
            sqlCommand.Parameters.AddWithValue("@TotalPrice", input.TotalPrice);
            sqlCommand.Parameters.AddWithValue("@CusId", input.CusId);
            sqlCommand.Parameters.AddWithValue("@CusRate", input.CusRate);
            sqlCommand.Parameters.AddWithValue("@SalesMan", input.SalesMan);
            if (input.ShippingDate != null)
            {
                sqlCommand.Parameters.AddWithValue("@ShippingDate", input.ShippingDate);
            }
            sqlCommand.ExecuteNonQuery();
            _conn.Close();
            #endregion

            #region --lấy id của đơn hàng vừa tạo
            _conn.Open();
            string SQL1 = string.Format("select top 1 id from shoeshipping where shippingno = @ShippingNo");
            SqlCommand sqlCommand1 = new SqlCommand(SQL1, _conn);
            sqlCommand1.Parameters.AddWithValue("@ShippingNo", input.ShippingNo);
            SqlDataReader sqlDataReader1 = sqlCommand1.ExecuteReader();
            if (sqlDataReader1.HasRows)
            {
                sqlDataReader1.Read();
                if (!Convert.IsDBNull(sqlDataReader1["id"]))
                {
                    shippingId = Int32.Parse(sqlDataReader1["id"].ToString());
                }
            }
            _conn.Close();
            #endregion

            #region --lưu thông tin chi tiết của đơn hàng và cập nhật số lượng hàng tồn kho
            foreach (var inp in input.ShoesList)
            {
                #region --lưu thông tin chi tiết của đơn hàng
                _conn.Open();
                string SQL2 = string.Format("INSERT INTO dbo.shoeshippingdetail(shoeshippingid, shoesid, shipqty, price) VALUES (@ShoeShippingId,@ShoesId,@ShipQty,@Price)");

                SqlCommand sqlCommand2 = new SqlCommand(SQL2, _conn);

                sqlCommand2.Parameters.AddWithValue("@ShoeShippingId", shippingId);
                sqlCommand2.Parameters.AddWithValue("@ShoesId", inp.ShoeId);
                sqlCommand2.Parameters.AddWithValue("@ShipQty", inp.ShipQty);
                sqlCommand2.Parameters.AddWithValue("@Price", inp.Price);

                sqlCommand2.ExecuteNonQuery();
                _conn.Close();
                #endregion

                #region --cập nhật số lượng hàng tồn kho
                _conn.Open();
                string SQL4 = string.Format("UPDATE dbo.shoes SET shoeqty = shoeqty - @ShipQty WHERE id = @ShoesId ");

                SqlCommand sqlCommand4 = new SqlCommand(SQL4, _conn);

                sqlCommand4.Parameters.AddWithValue("@ShoesId", inp.ShoeId);
                sqlCommand4.Parameters.AddWithValue("@ShipQty", inp.ShipQty);

                sqlCommand4.ExecuteNonQuery();
                _conn.Close();
                #endregion
            }
            #endregion

            #region --cập nhật số tiền đã mua vào customer
            _conn.Open();
            string SQL3 = string.Format("UPDATE dbo.customer SET shoebuyprice = shoebuyprice + @TotalPrice WHERE id = @CusId ");

            SqlCommand sqlCommand3 = new SqlCommand(SQL3, _conn);

            sqlCommand3.Parameters.AddWithValue("@TotalPrice", input.TotalPrice);
            sqlCommand3.Parameters.AddWithValue("@CusId", input.CusId);

            sqlCommand3.ExecuteNonQuery();
            _conn.Close();
            #endregion

           

            return true;
        }
        #endregion

        #region GetReportProfits
        public List<ReportProfitsViewDto> GetReportProfits(GetReportInput input)
        {
            if (input.FromDate.HasValue) input.FromDate = input.FromDate.Value.AddHours(7);
            if (input.ToDate.HasValue) input.ToDate = input.ToDate.Value.AddHours(7);

            _conn.Open();

            string spName = @"dbo.[GetReportProfits]";
            SqlCommand cmd = new SqlCommand(spName, _conn);

            cmd.Parameters.AddWithValue("@FromDate", input.FromDate);
            cmd.Parameters.AddWithValue("@ToDate", input.ToDate);

            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataReader sqlDataReader = cmd.ExecuteReader();

            var shippings = new List<ReportProfitsViewDto>();
            if (sqlDataReader.HasRows)
            {
                while (sqlDataReader.Read())
                {
                    var shipping = new ReportProfitsViewDto();
                    if (!Convert.IsDBNull(sqlDataReader["code"])) shipping.Code = sqlDataReader["code"].ToString();
                    if (!Convert.IsDBNull(sqlDataReader["sosanpham"])) shipping.ShoeQty = (int)sqlDataReader["sosanpham"];
                    if (!Convert.IsDBNull(sqlDataReader["soluongsanpham"])) shipping.TotalQty = (int)sqlDataReader["soluongsanpham"];
                    if (!Convert.IsDBNull(sqlDataReader["totalprice"])) shipping.TotalPrice = (float)Convert.ToDouble(sqlDataReader["totalprice"]);
                    if (!Convert.IsDBNull(sqlDataReader["status"])) shipping.Status = (int)sqlDataReader["status"];
                    if (!Convert.IsDBNull(sqlDataReader["date"]))
                    {
                        shipping.Date = Convert.ToDateTime(sqlDataReader["date"]);
                    }

                    shippings.Add(shipping);
                }
            }
            _conn.Close();

            return shippings.ToList();
        }
        #endregion

        #region GetReportTopShoeSale
        public List<TopShoeSaleForViewDto> GetReportTopShoeSale(GetReportInput input)
        {
            if (input.FromDate.HasValue) input.FromDate = input.FromDate.Value.AddHours(7);
            if (input.ToDate.HasValue) input.ToDate = input.ToDate.Value.AddHours(7);

            _conn.Open();

            string spName = @"dbo.[GetReportTopShoeSale]";
            SqlCommand cmd = new SqlCommand(spName, _conn);

            cmd.Parameters.AddWithValue("@FromDate", input.FromDate);
            cmd.Parameters.AddWithValue("@ToDate", input.ToDate);

            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataReader sqlDataReader = cmd.ExecuteReader();

            var shippings = new List<TopShoeSaleForViewDto>();
            if (sqlDataReader.HasRows)
            {
                while (sqlDataReader.Read())
                {
                    var shipping = new TopShoeSaleForViewDto();
                    if (!Convert.IsDBNull(sqlDataReader["shoecode"])) shipping.ShoeCode = sqlDataReader["shoecode"].ToString();
                    if (!Convert.IsDBNull(sqlDataReader["shoename"])) shipping.ShoeName = sqlDataReader["shoename"].ToString();
                    if (!Convert.IsDBNull(sqlDataReader["soluongbanduoc"])) shipping.ShoeQty = (int)sqlDataReader["soluongbanduoc"];
                    if (!Convert.IsDBNull(sqlDataReader["tongtien"])) shipping.TotalPrice = (float)Convert.ToDouble(sqlDataReader["tongtien"]);
                   
                    shippings.Add(shipping);
                }
            }
            _conn.Close();

            return shippings.ToList();
        }
        #endregion
    }
}
