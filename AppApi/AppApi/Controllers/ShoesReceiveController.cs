using AppApi.DL;
using AppApi.Entities.DTO.Shoe_receive;
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
    public class ShoesReceiveController : ApiController
    {
        ShoesReceiveDL receive = new ShoesReceiveDL();

        [HttpPost]
        [Route("save-receive")]
        public bool SaveReceive(SaveReceiveShoeDto input)
        {
            try
            {
                return receive.SaveReceiveDL(input);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("get-receive")]
        public List<ShoeReceive> GetShoeReceive(GetShoeReceiveInput input)
        {
            try
            {
                return receive.GetShoeReceive(input);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("receive-detail")]
        public List<ShoeReceiveDetailForViewDto> GetShoeReceiveDetail(GetShoeReceiveDetailInput input)
        {
            try
            {
                return receive.GetShoeReceiveDetail(input);
            }
            catch (Exception)
            {
                throw;
            }
        }


    }
}
