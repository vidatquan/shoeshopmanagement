using AppApi.DL;
using AppApi.Entities.DTO.Shoe_Report;
using AppApi.Entities.DTO.Shoe_shipping;
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
    public class ShoesShippingController : ApiController
    {
        ShoesShippingDL shipping = new ShoesShippingDL();

        [HttpPost]
        [Route("ship-info")]
        public List<ShoeShippingForViewDto> GetShoeShipping(GetShoeShipingInputDto input)
        {
            try
            {
                return shipping.GetShoeShipping(input);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("save-shipping")]
        public bool SaveReceive(SaveShippingShoeDto input)
        {
            try
            {
                return shipping.SaveShippingDL(input);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("get-profits")]
        public List<ReportProfitsViewDto> GetReportProfits(GetReportInput input)
        {
            try
            {
                return shipping.GetReportProfits(input);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("top-sale")]
        public List<TopShoeSaleForViewDto> GetReportTopShoeSale(GetReportInput input)
        {
            try
            {
                return shipping.GetReportTopShoeSale(input);
            }
            catch (Exception)
            {
                throw;
            }
        }


    }
}