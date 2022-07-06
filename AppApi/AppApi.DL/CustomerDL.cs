using AppApi.Entities.DTO.Customer;
using AppApi.Entities.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace AppApi.DL
{
    public class CustomerDL : DBConnect
    {
        public List<Customer> GetCustomer(GetCusInputDto input)
        {
            _conn.Open();

            string spName = @"dbo.[GetCustomers]";
            SqlCommand cmd = new SqlCommand(spName, _conn);

            cmd.Parameters.AddWithValue("@CusName", input.CusName ?? "");
            cmd.Parameters.AddWithValue("@CusTel", input.CusTel ?? "");

            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataReader sqlDataReader = cmd.ExecuteReader();

            var customers = new List<Customer>();
            if (sqlDataReader.HasRows)
            {
                while (sqlDataReader.Read())
                {
                    var cus = new Customer();
                    cus.Id = (int)sqlDataReader["id"];
                    cus.CusName = sqlDataReader["cus_name"].ToString();
                    cus.CusEmail = sqlDataReader["cus_email"].ToString();
                    cus.CusTel = sqlDataReader["cus_tel"].ToString();
                    cus.CusAdd = sqlDataReader["cus_add"].ToString();
                    cus.CusShoeBuyPrice = (float)Convert.ToDouble(sqlDataReader["shoebuyprice"]); 
                    customers.Add(cus);
                }
            }
            _conn.Close();
            return customers.ToList();
        }

        public bool RegisterDL(Customer input)
        {
            _conn.Open();

            string SQL = string.Format("INSERT INTO dbo.customer(cus_name, cus_add,cus_email, cus_tel, shoebuyprice, isdeleted) VALUES(@CusName, @CusAdd,@CusEmail, @CusTel, 0, 0)");
            SqlCommand sqlCommand = new SqlCommand(SQL, _conn);
            sqlCommand.Parameters.AddWithValue("@CusName", input.CusName ??"");
            sqlCommand.Parameters.AddWithValue("@CusAdd", input.CusAdd??"");
            sqlCommand.Parameters.AddWithValue("@CusEmail", input.CusEmail?? "");
            sqlCommand.Parameters.AddWithValue("@CusTel", input.CusTel ?? "");

            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            _conn.Close();
            return false;
        }

        public bool UpdateDL(Customer input)
        {
            _conn.Open();

            string SQL = string.Format("UPDATE dbo.customer SET cus_name = @CusName, cus_add = @CusAdd, cus_email = @CusEmail, cus_tel = @CusTel,shoebuyprice = @ShoeBuyPrice WHERE Id = @Id");

            SqlCommand sqlCommand = new SqlCommand(SQL, _conn);
            sqlCommand.Parameters.AddWithValue("@CusName", input.CusName??"");
            sqlCommand.Parameters.AddWithValue("@CusAdd", input.CusAdd??"");
            sqlCommand.Parameters.AddWithValue("@CusEmail", input.CusEmail??"");
            sqlCommand.Parameters.AddWithValue("@CusTel", input.CusTel ??"");
            sqlCommand.Parameters.AddWithValue("@Id", input.Id);
            sqlCommand.Parameters.AddWithValue("@ShoeBuyPrice", input.CusShoeBuyPrice);

            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            _conn.Close();
            return false;
        }

        public bool DeleteDL(Customer input)
        {
            _conn.Open();

            string SQL = string.Format("UPDATE dbo.customer SET isdeleted = 1 WHERE Id = @Id");

            SqlCommand sqlCommand = new SqlCommand(SQL, _conn);
            sqlCommand.Parameters.AddWithValue("@id", input.Id);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            _conn.Close();
            return false;
        }

    }
}
