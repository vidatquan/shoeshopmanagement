using AppApi.DL;
using AppApi.Entities;
using AppApi.Entities.DTO.Employee;
using AppApi.Entities.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace AppApi.Controllers
{
    public class EmployeeController : ApiController
    {
        EmployeeDL emp = new EmployeeDL();

        [HttpPost]
        [Route("auth/register")]
        public bool Register(User input)
        {
            try
            {
                return emp.RegisterDL(input);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("update-employee")]
        public bool Update(User input)
        {
            try
            {
                return emp.UpdateDL(input);
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        [HttpPost]
        [Route("auth/login")]
        public User Login(User input)
        {
            try
            {
                return emp.LoginDL(input);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("employees")]
        public List<User> GetEmployees(GetEmployeeInput input)
        {
            try
            {
                return emp.GetEmployees(input);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("delete-employee")]
        public bool DeleteEmployee(User input)
        {
            try
            {
                return emp.DeleteDL(input);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
