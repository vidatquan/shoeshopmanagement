using AppApi.Entities;
using AppApi.Entities.DTO.Employee;
using AppApi.Entities.Entity;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace AppApi.DL
{
    public class EmployeeDL : DBConnect
    {
        public List<User> GetEmployees(GetEmployeeInput input)
        {
            _conn.Open();

            string spName = @"dbo.[GetEmployee]";
            SqlCommand cmd = new SqlCommand(spName, _conn);

            cmd.Parameters.AddWithValue("@FullName", input.FullName);
            cmd.Parameters.AddWithValue("@Tel", input.Tel);
            cmd.Parameters.AddWithValue("@Code", input.Code);
            cmd.Parameters.AddWithValue("@IsDeleted", input.IsDeleted);

            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataReader sqlDataReader = cmd.ExecuteReader();

            var employees = new List<User>();
            if (sqlDataReader.HasRows)
            {
                while (sqlDataReader.Read())
                {
                    var employee = new User();
                    employee.Id = (int)sqlDataReader["id"];
                    employee.FullName = sqlDataReader["full_name"].ToString();
                    employee.EmpCode = sqlDataReader["code"].ToString();
                    employee.Tel = sqlDataReader["tel"].ToString();
                    employee.Email = sqlDataReader["email"].ToString();
                    employee.Cmnd = sqlDataReader["cmnd"].ToString();
                    employee.Address = sqlDataReader["address"].ToString();
                    employee.IsDeleted = (int)sqlDataReader["isdeleted"];
                    employee.Username = sqlDataReader["user_name"].ToString();
                    employee.Password = sqlDataReader["password"].ToString();
                    employee.RoleId = (int)sqlDataReader["role_id"];
                    if (!Convert.IsDBNull(sqlDataReader["image"]))
                    {
                        employee.Img = (byte[])sqlDataReader["image"];
                        string base64String = Convert.ToBase64String(employee.Img, 0, employee.Img.Length);
                        employee.ImageString = base64String;
                    }
                    
                    employee.RoleId = (int)sqlDataReader["role_id"];
                    employees.Add(employee);
                }
            }
            _conn.Close();
            return employees.ToList();
        }

        public bool RegisterDL(User input)
        {
            _conn.Open();

            string SQL = string.Format("INSERT INTO dbo.users(full_name, code, cmnd, tel, email,user_name,password,role_id,image, isdeleted, address) VALUES(@FullName, @Code, @Cmnd, @Tel, @Email,@UserName,@Password,2,@Image,@IsDeleted, @Address)");
            SqlCommand sqlCommand = new SqlCommand(SQL, _conn);
            sqlCommand.Parameters.AddWithValue("@FullName", input.FullName??"");
            sqlCommand.Parameters.AddWithValue("@Code", input.EmpCode??"");
            sqlCommand.Parameters.AddWithValue("@Tel", input.Tel??"");
            sqlCommand.Parameters.AddWithValue("@Email", input.Email ?? "");
            sqlCommand.Parameters.AddWithValue("@Type", "");
            sqlCommand.Parameters.AddWithValue("@UserName", input.Username??"");
            sqlCommand.Parameters.AddWithValue("@Password", input.Password??"1");
            sqlCommand.Parameters.AddWithValue("@Cmnd", input.Cmnd ?? "");
            sqlCommand.Parameters.AddWithValue("@Address", input.Address ?? "");
            sqlCommand.Parameters.AddWithValue("@IsDeleted", input.IsDeleted);
            byte[] myByteArray = Convert.FromBase64String(input.ImageString);
            sqlCommand.Parameters.AddWithValue("@Image", myByteArray);

            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            _conn.Close();
            return false;
        }

       public bool UpdateDL(User input)
        {
            _conn.Open();

            string SQL = string.Format("UPDATE dbo.users SET isdeleted = @IsDeleted, address = @Address, image = @Image, cmnd = @Cmnd, full_name = @FullName, code = @Code, tel = @Tel, email = @Email, user_name = @UserName, password = @Password WHERE Id = @Id");

            SqlCommand sqlCommand = new SqlCommand(SQL, _conn);
            sqlCommand.Parameters.AddWithValue("@FullName", input.FullName??"");
            sqlCommand.Parameters.AddWithValue("@Code", input.EmpCode??"");
            sqlCommand.Parameters.AddWithValue("@Tel", input.Tel??"");
            sqlCommand.Parameters.AddWithValue("@Email", input.Email ?? "" );
            sqlCommand.Parameters.AddWithValue("@Type", "");
            sqlCommand.Parameters.AddWithValue("@UserName", input.Username??"");
            sqlCommand.Parameters.AddWithValue("@Password", input.Password??"1");
            sqlCommand.Parameters.AddWithValue("@Cmnd", input.Cmnd ?? "");
            sqlCommand.Parameters.AddWithValue("@Address", input.Address ?? "");
            sqlCommand.Parameters.AddWithValue("@IsDeleted", input.IsDeleted);

            byte[] myByteArray = Convert.FromBase64String(input.ImageString);
            sqlCommand.Parameters.AddWithValue("@Image", myByteArray);
            //sqlCommand.Parameters.AddWithValue("@Birthday", input.Birthday);
            sqlCommand.Parameters.AddWithValue("@Id", input.Id);

            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            _conn.Close();
            return false;
        }

        public bool DeleteDL(User input)
        {
            _conn.Open();

            string SQL = string.Format("delete from users WHERE Id = @id");

            SqlCommand sqlCommand = new SqlCommand(SQL, _conn);
            sqlCommand.Parameters.AddWithValue("@id", input.Id);
            sqlCommand.ExecuteNonQuery();

            if (  sqlCommand.ExecuteNonQuery() > 0) return true;
            _conn.Close();

            return false;
        }

        public string GetToken()
        {
            string key = "my_secret_key_12345"; //Secret key which will be used later during validation    
            var issuer = "http://mysite.com";  //normally this will be your site URL    

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            //Create a List of Claims, Keep claims name short    
            var permClaims = new List<Claim>();
            permClaims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));

            //Create Security Token object by giving required parameters    
            var token = new JwtSecurityToken(issuer, //Issure    
                            issuer,  //Audience    
                            permClaims,
                            expires: DateTime.Now.AddDays(1),
                            signingCredentials: credentials);
            var jwt_token = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt_token;
        }

        public User LoginDL(User dep)
        {
            _conn.Open();

            string SQL = string.Format("select * from users where user_name = @Username and password = @Password ");
            SqlCommand sqlCommand = new SqlCommand(SQL, _conn);
            sqlCommand.Parameters.AddWithValue("@Username", dep.Username);
            sqlCommand.Parameters.AddWithValue("@Password", dep.Password);
            SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();

            var employees = new List<User>();
            if (sqlDataReader.HasRows)
            {
                while (sqlDataReader.Read())
                {
                    var employee = new User();
                    employee.Id = (int)sqlDataReader["Id"];
                    employee.Username = sqlDataReader["user_name"].ToString();
                    employee.Password = sqlDataReader["password"].ToString();
                    employee.FullName = sqlDataReader["full_name"].ToString();
                    employee.EmpCode = sqlDataReader["code"].ToString();
                    employee.Tel = sqlDataReader["tel"].ToString();
                    employee.Email = sqlDataReader["email"].ToString();
                    employee.Cmnd = sqlDataReader["cmnd"].ToString();
                    employee.Address = sqlDataReader["address"].ToString();
                    if (!Convert.IsDBNull(sqlDataReader["image"]))
                    {
                        employee.Img = (byte[])sqlDataReader["image"];
                        string base64String = Convert.ToBase64String(employee.Img, 0, employee.Img.Length);
                        employee.ImageString = base64String;
                    }
                    employee.Token = GetToken();
                    employee.RoleId = (int)sqlDataReader["role_id"];
                        
                    employees.Add(employee);
                }

                return employees.ToList()[0];
            }
            _conn.Close();
            return null;
        }
    }
}
