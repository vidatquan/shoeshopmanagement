using AppApi.DL;
using AppApi.Entities.DTO.Shoe_info;
using AppApi.Entities.DTO.Shoe_receive;
using AppApi.Entities.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace AppApi.Controllers
{
    public class ShoesController : ApiController
    {
        ShoeDL shoe = new ShoeDL();

        [HttpPost]
        [Route("shoes")]
        public List<Shoes> GetShoesInfo(GetShoeInfoInput input)
        {
            try
            {
                return shoe.GetShoesInfo(input);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("create-shoes")]
        public bool CreateShoeInfoDL(Shoes input)
        {
            try
            {
                return shoe.CreateShoeInfoDL(input);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("update-shoes")]
        public bool UpdateShoeInfoDL(Shoes input)
        {
            try
            {
                return shoe.UpdateShoeInfoDL(input);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("delete-shoes")]
        public bool DeleteEmployee(int input)
        {
            try
            {
                return shoe.DeleteShoeInfoDL(input);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("get-log")]
        public List<HistoryShoePrice> GetHistoryShoePrice(GetShoeReceiveDetailInput input)
        {
            try
            {
                return shoe.GetHistoryShoePrice(input);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("create-log")]
        public bool CreateHistoryShoePrice(HistoryShoePrice input)
        {
            try
            {
                return shoe.CreateHistoryShoePrice(input);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}