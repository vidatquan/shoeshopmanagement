using AppApi.DL;
using AppApi.Entities.DTO.Customer;
using AppApi.Entities.Entity;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace AppApi.Controllers
{
    public class CustomerController : ApiController
    {
        CustomerDL cus = new CustomerDL();


        [HttpPost]
        [Route("update-customer")]
        public bool Update(Customer input)
        {
            try
            {
                return cus.UpdateDL(input);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("customer")]
        public List<Customer> GetCustomer(GetCusInputDto input)
        {
            try
            {
                return cus.GetCustomer(input);
            }
            catch (Exception)
            {
                throw;
            }
        }

        //[HttpPost]
        //[Route("cus-tel")]
        //public List<Customer> GetCustomerByTel(GetCusInputDto input)
        //{
        //    try
        //    {
        //        return cus.GetCustomerByTel(input);
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //}

        //[HttpPost]
        //[Route("cus-by-id")]
        //public List<Customer> GetCustomerById(GetCusInputDto input)
        //{
        //    try
        //    {
        //        return cus.GetCustomerById(input);
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //}

        [HttpPost]
        [Route("delete-customer")]
        public bool DeleteCustomer(Customer input)
        {
            try
            {
                return cus.DeleteDL(input);
            }
            catch (Exception)
            {
                throw;
            }
        }


        [HttpPost]
        [Route("add-customer")]
        public bool RegisterCustomer(Customer input)
        {
            try
            {
                return cus.RegisterDL(input);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
