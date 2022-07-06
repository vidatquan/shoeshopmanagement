using AppApi.Entities.DTO.Shoe_order;
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
    public class ShoesOrderDL : DBConnect
    {
        #region GetShoeOrder

        public List<ShoeOrder> GetShoeOrder(GetShoeOrderInput input)
        {
            _conn.Open();

            string spName = @"dbo.[GetShoeOrder]";
            SqlCommand cmd = new SqlCommand(spName, _conn);

            cmd.Parameters.AddWithValue("@OrderStatus", input.OrderStatus);
            cmd.Parameters.AddWithValue("@OrderNo", input.OrderNo);
            cmd.Parameters.AddWithValue("@FromDate", input.FromDate);
            cmd.Parameters.AddWithValue("@toDate", input.ToDate);

            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataReader sqlDataReader = cmd.ExecuteReader();

            var orders = new List<ShoeOrder>();
            if (sqlDataReader.HasRows)
            {
                while (sqlDataReader.Read())
                {
                    var order = new ShoeOrder();
                    order.Id = (int)sqlDataReader["id"];
                    order.OrderUser = sqlDataReader["orderuser"].ToString();
                    order.OrderNo = sqlDataReader["orderno"].ToString();
                    if (!Convert.IsDBNull(sqlDataReader["orderdate"]))
                    {
                        order.OrderDate = Convert.ToDateTime(sqlDataReader["orderdate"]);
                    }
                    order.OrderStatus = (int)sqlDataReader["orderstatus"];
                    //if (!Convert.IsDBNull(sqlDataReader["user_id"]))
                    //{
                    //    order.UserId = (int)sqlDataReader["user_id"];
                    //}
                    //if (!Convert.IsDBNull(sqlDataReader["customer_id"]))
                    //{
                    //    order.CustomerId = (int)sqlDataReader["customer_id"];
                    //}
                    orders.Add(order);
                }
            }
            _conn.Close();
            return orders.ToList();
        }
        #endregion

        #region GetShoeOrderDetail
        public List<ShoeOrderDetailForViewDto> GetShoeOrderDetail(GetShoeOrderDetailInput input)
        {
            _conn.Open();

            string spName = @"dbo.[GetShoeOrderDetail]";
            SqlCommand cmd = new SqlCommand(spName, _conn);

            cmd.Parameters.AddWithValue("@ShoeOrderId", input.Id);

            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataReader sqlDataReader = cmd.ExecuteReader();

            var orderDetails = new List<ShoeOrderDetailForViewDto>();
            if (sqlDataReader.HasRows)
            {
                while (sqlDataReader.Read())
                {
                    var orderDetail = new ShoeOrderDetailForViewDto();

                    orderDetail.ShoeId = (int)sqlDataReader["id"];
                    orderDetail.ShoeCode = sqlDataReader["shoecode"].ToString();
                    orderDetail.ShoeName = sqlDataReader["shoename"].ToString();
                    orderDetail.ShoeQty = (int)sqlDataReader["shoeqty"];
                    orderDetail.OrderQty = (int)sqlDataReader["orderqty"];
                   // orderDetail.RealPrice = (float)Convert.ToDouble(sqlDataReader["realprice"]);
                    orderDetail.ReceiveActQty = (int)sqlDataReader["receiveactqty"];
                    if (!Convert.IsDBNull(sqlDataReader["price"])) orderDetail.Price = (float)Convert.ToDouble(sqlDataReader["price"]);

                    orderDetails.Add(orderDetail);
                }
            }
            _conn.Close();
            return orderDetails.ToList();
        }
        #endregion

        #region SaveOrder
        public bool SaveOrderDL(DataOrder input)
        {
            input.OrderDate = input.OrderDate.AddHours(7);
            int orderId = 0;

            input.OrderNo = "DH" + input.OrderDate.Year.ToString().Substring(2, 2) + input.OrderDate.Month.ToString("00") + input.OrderDate.Day.ToString("00") + input.OrderDate.Hour.ToString("00")+ input.OrderDate.Minute.ToString("00")+ input.OrderDate.Second.ToString("00");
            _conn.Open();
            string SQL = string.Format("INSERT INTO dbo.shoeorder(orderuser, orderno, orderdate,orderstatus) VALUES (@OrderUser,@OrderNo,@OrderDate,0)");
            SqlCommand sqlCommand = new SqlCommand(SQL, _conn);
            sqlCommand.Parameters.AddWithValue("@OrderUser", input.OrderUser);
            sqlCommand.Parameters.AddWithValue("@OrderNo", input.OrderNo);
            if (input.OrderDate != null)
            {
                sqlCommand.Parameters.AddWithValue("@OrderDate", input.OrderDate);
            }
            sqlCommand.ExecuteNonQuery();
            _conn.Close();

            _conn.Open();
            string SQL1 = string.Format("select top 1 id from shoeorder where orderno = @OrderNo");
            SqlCommand sqlCommand1 = new SqlCommand(SQL1, _conn);
            sqlCommand1.Parameters.AddWithValue("@OrderNo", input.OrderNo);
            SqlDataReader sqlDataReader1 = sqlCommand1.ExecuteReader();
            if (sqlDataReader1.HasRows)
            {
                sqlDataReader1.Read();
                if (!Convert.IsDBNull(sqlDataReader1["id"]))
                {
                    orderId = Int32.Parse(sqlDataReader1["id"].ToString());
                }
            }
            _conn.Close();

            foreach(var inp in input.ShoesList)
            {
                _conn.Open();
                string SQL2 = string.Format("INSERT INTO dbo.shoeorderdetail(shoeorderid, shoesid, orderqty, receiveactqty,price) VALUES (@ShoeOrderId,@ShoesId,@OrderQty , 0,@Price)");

                SqlCommand sqlCommand2 = new SqlCommand(SQL2, _conn);

                sqlCommand2.Parameters.AddWithValue("@ShoeOrderId", orderId);
                sqlCommand2.Parameters.AddWithValue("@ShoesId", inp.ShoeId);
                sqlCommand2.Parameters.AddWithValue("@OrderQty", inp.OrderQty);
                sqlCommand2.Parameters.AddWithValue("@Price", inp.Price);

                sqlCommand2.ExecuteNonQuery();
                _conn.Close();
            }

            return true;
        }
        #endregion

        #region Huỷ đơn hàng
        public bool CancelShoeOrder(CancelShoeOrderInput input)
        {
            _conn.Open();
            string SQL1 = string.Format("UPDATE dbo.shoeorder SET orderstatus = 3 where orderno = @OrderNo ");

            SqlCommand sqlCommand1 = new SqlCommand(SQL1, _conn);

            sqlCommand1.Parameters.AddWithValue("@OrderNo", input.OrderNo);

            sqlCommand1.ExecuteNonQuery();
            _conn.Close();

            return true;
        }
        #endregion
    }
}
