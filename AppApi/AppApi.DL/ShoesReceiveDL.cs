using AppApi.Entities.DTO.Shoe_receive;
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
    public class ShoesReceiveDL: DBConnect
    {
        #region GetShoeOrder

        public List<ShoeReceive> GetShoeReceive(GetShoeReceiveInput input)
        {
            _conn.Open();

            string spName = @"dbo.[GetShoeReceive]";
            SqlCommand cmd = new SqlCommand(spName, _conn);

            cmd.Parameters.AddWithValue("@ReceiveNo", input.ReceiveNo);
            cmd.Parameters.AddWithValue("@FromDate", input.FromDate);
            cmd.Parameters.AddWithValue("@ToDate", input.ToDate);

            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataReader sqlDataReader = cmd.ExecuteReader();

            var receives = new List<ShoeReceive>();
            if (sqlDataReader.HasRows)
            {
                while (sqlDataReader.Read())
                {
                    var receive = new ShoeReceive();
                    receive.Id = (int)sqlDataReader["id"];
                    receive.ReceiveUser = sqlDataReader["receiveuser"].ToString();
                    receive.ReceiveNo = sqlDataReader["receiveno"].ToString();
                    receive.OrderNo = sqlDataReader["orderno"].ToString();
                    if (!Convert.IsDBNull(sqlDataReader["receivedate"]))
                    {
                        receive.ReceiveDate = Convert.ToDateTime(sqlDataReader["receivedate"]);
                    }
                    receives.Add(receive);
                }
            }
            _conn.Close();
            return receives.ToList();
        }
        #endregion

        #region GetShoeOrderDetail
        public List<ShoeReceiveDetailForViewDto> GetShoeReceiveDetail(GetShoeReceiveDetailInput input)
        {
            _conn.Open();

            string spName = @"dbo.[GetShoeReceiveDetail]";
            SqlCommand cmd = new SqlCommand(spName, _conn);

            cmd.Parameters.AddWithValue("@ShoeReceiveId", input.Id);

            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataReader sqlDataReader = cmd.ExecuteReader();

            var receiveDetails = new List<ShoeReceiveDetailForViewDto>();
            if (sqlDataReader.HasRows)
            {
                while (sqlDataReader.Read())
                {
                    var receiveDetail = new ShoeReceiveDetailForViewDto();

                    receiveDetail.ShoeCode = sqlDataReader["shoecode"].ToString();
                    receiveDetail.ShoeName = sqlDataReader["shoename"].ToString();
                    receiveDetail.ShoeQty = (int)sqlDataReader["shoeqty"];
                    receiveDetail.OrderQty = (int)sqlDataReader["orderqty"];
                    receiveDetail.ReceiveActQty = (int)sqlDataReader["receiveqty"];
                    receiveDetail.DeliveryQty = (int)sqlDataReader["deliveryqty"];
                    // receiveDetail.RealPrice = (float)Convert.ToDouble(sqlDataReader["realprice"]);
                    receiveDetail.RealPrice = (float)Convert.ToDouble(sqlDataReader["price"]);
                    receiveDetail.ShoeId = (int)sqlDataReader["id"];
                    

                    receiveDetails.Add(receiveDetail);
                }
            }
            _conn.Close();
            return receiveDetails.ToList();
        }
        #endregion

        #region SaveReceive
        public bool SaveReceiveDL(SaveReceiveShoeDto input)
        {
            input.ReceiveDate = input.ReceiveDate.AddHours(7);
            int receiveId = 0;
            var date = DateTime.Now;
            input.ReceiveNo = "PGH" + date.Year.ToString().Substring(2, 2) + date.Month.ToString("00") + date.Day.ToString("00") + date.Hour.ToString("00") + date.Minute.ToString("00") + date.Second.ToString("00");
            #region --tạo thông tin của đơn hàng 
            _conn.Open();
            string SQL = string.Format("INSERT INTO dbo.shoereceive(receiveuser, receiveno, orderno, receivedate) VALUES (@ReceiveUser, @ReceiveNo, @OrderNo, @ReceiveDate)");
            SqlCommand sqlCommand = new SqlCommand(SQL, _conn);
            sqlCommand.Parameters.AddWithValue("@ReceiveUser", input.ReceiveUser);
            sqlCommand.Parameters.AddWithValue("@ReceiveNo", input.ReceiveNo);
            sqlCommand.Parameters.AddWithValue("@OrderNo", input.OrderNo);
            if (input.ReceiveDate != null)
            {
                sqlCommand.Parameters.AddWithValue("@ReceiveDate", input.ReceiveDate);
            }
            sqlCommand.ExecuteNonQuery();
            _conn.Close();
            #endregion

            #region --lấy id của đơn nhận hàng vừa tạo
            _conn.Open();
            string SQL1 = string.Format("select top 1 id from shoereceive where receiveno = @ReceiveNo");
            SqlCommand sqlCommand1 = new SqlCommand(SQL1, _conn);
            sqlCommand1.Parameters.AddWithValue("@ReceiveNo", input.ReceiveNo);
            SqlDataReader sqlDataReader1 = sqlCommand1.ExecuteReader();
            if (sqlDataReader1.HasRows)
            {
                sqlDataReader1.Read();
                if (!Convert.IsDBNull(sqlDataReader1["id"]))
                {
                    receiveId = Int32.Parse(sqlDataReader1["id"].ToString());
                }
            }
            _conn.Close();
            #endregion

            
            foreach (var inp in input.ShoesList)
            {
                #region --lưu thông tin chi tiết của đơn hàng 
                _conn.Open();
                string SQL2 = string.Format("INSERT INTO dbo.shoereceivedetail(shoereceiveid, shoesid,receiveqty, deliveryqty, orderqty, price) VALUES (@ShoeReceiveId,@ShoesId,@ReceiveQty,@DeliveryQty, @OrderQty, @Price)");

                SqlCommand sqlCommand2 = new SqlCommand(SQL2, _conn);

                sqlCommand2.Parameters.AddWithValue("@ShoeReceiveId", receiveId);
                sqlCommand2.Parameters.AddWithValue("@ShoesId", inp.ShoeId);
                sqlCommand2.Parameters.AddWithValue("@ReceiveQty", inp.ReceiveQty);
                sqlCommand2.Parameters.AddWithValue("@DeliveryQty", inp.DeliveryQty);
                sqlCommand2.Parameters.AddWithValue("@OrderQty", inp.OrderQty);
                sqlCommand2.Parameters.AddWithValue("@Price", inp.Price);

                sqlCommand2.ExecuteNonQuery();
                 _conn.Close();
                #endregion

                #region -- cập nhật số lượng đã nhận trong đơn đặt hàng
                _conn.Open();
                //cập nhật số lượng đã nhận 
                string SQL3 = string.Format("UPDATE dbo.shoeorderdetail SET receiveactqty = @ShoeReceivedQtyInStock WHERE shoeorderid = @ShoeOrderId AND shoesid = @ShoeId ");

                SqlCommand sqlCommand3 = new SqlCommand(SQL3, _conn);

                sqlCommand3.Parameters.AddWithValue("@ShoeReceivedQtyInStock", inp.ShoeReceivedQtyInStock);
                sqlCommand3.Parameters.AddWithValue("@ShoeOrderId", input.ShoeOrderId);
                sqlCommand3.Parameters.AddWithValue("@ShoeId", inp.ShoeId);

                sqlCommand3.ExecuteNonQuery();
                _conn.Close();
                #endregion

                #region -- cập nhật số lượng đã nhận vào kho
                _conn.Open();
                string SQL5 = string.Format("UPDATE dbo.shoes SET shoeqty = shoeqty +  @ReceiveQty WHERE id = @ShoeId ");

                SqlCommand sqlCommand5 = new SqlCommand(SQL5, _conn);

                sqlCommand5.Parameters.AddWithValue("@ReceiveQty", inp.ReceiveQty);
                sqlCommand5.Parameters.AddWithValue("@ShoeId", inp.ShoeId);

                sqlCommand5.ExecuteNonQuery();
                _conn.Close();
                #endregion
            }

            #region --kiểm tra nếu các đôi giày đã nhận đủ => chuyển trạng thái đơn hàng đặt sang Thành công
            if (input.CheckShoeOrderComplete == 1)
            {
                _conn.Open();

                string SQL4 = string.Format("UPDATE dbo.shoeorder SET orderstatus = 2 WHERE id = @ShoeOrderId ");

                SqlCommand sqlCommand4 = new SqlCommand(SQL4, _conn);

                sqlCommand4.Parameters.AddWithValue("@ShoeOrderId", input.ShoeOrderId);

                sqlCommand4.ExecuteNonQuery();
                _conn.Close();
            }
            #endregion

            return true;
        }
        #endregion

    }
}
