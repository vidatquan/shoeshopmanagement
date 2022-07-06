using AppApi.DL;
using AppApi.Entities.DTO.Shoe_order;
using AppApi.Entities.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using HttpPostAttribute = System.Web.Http.HttpPostAttribute;
using RouteAttribute = System.Web.Http.RouteAttribute;

namespace AppApi.Controllers
{
    public class ShoesOrderController : ApiController
    {
        ShoesOrderDL order = new ShoesOrderDL();

        [HttpPost]
        [Route("save-order")]
        public bool SaveOrder(DataOrder input)
        {
            try
            {
                return order.SaveOrderDL(input);
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        [HttpPost]
        [Route("get-order")]
        public List<ShoeOrder> GetShoeOrder(GetShoeOrderInput input)
        {
            try
            {
                return order.GetShoeOrder(input);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("order-detail")]
        public List<ShoeOrderDetailForViewDto> GetShoeOrderDetail(GetShoeOrderDetailInput input)
        {
            try
            {
                return order.GetShoeOrderDetail(input);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("cancel-order")]
        public bool CancelShoeOrder(CancelShoeOrderInput input)
        {
            try
            {
                return order.CancelShoeOrder(input);
            }
            catch (Exception)
            {
                throw;
            }
        }


    }
}
