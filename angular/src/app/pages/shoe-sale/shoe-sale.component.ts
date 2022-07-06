import { ShoesShippingService } from 'src/app/_services/shoes-shipping.service';
import { GetShoeShippingInputDto } from './../../_models/shoe-shipping/GetShoeShippingInputDto';
import { ceil } from 'lodash';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { PaginationParamsModel } from 'src/app/_components/shared/common/models/base.model';
import { DataFormatService } from 'src/app/_services/data-format.service';
declare let alertify: any;
@Component({
  selector: 'shoe-sale',
  templateUrl: './shoe-sale.component.html',
  styleUrls: ['./shoe-sale.component.scss']
})
export class ShoeSaleComponent implements OnInit {
  paginationParams: PaginationParamsModel;

  columnsDef;
  defaultColDef;
  shoesDetailcolumnsDef;
  rowData = [];
  pagedRowData = [];
  shippingDetailList = [];
  params: any;
  user;
  selectedData;
  fromDate = moment();
  toDate = moment();

  //
  preTaxPrice:any;
  taxPrice:any;
  discount:any;
  totalPrice:any;
  shoeParams:any;
  shippingNoFilter:string;
  cusNameFilter:string;
  cusTelFilter:string;
  cusRate:number;
  cusName:string;
  cusTel:string;
  cusAdd:string;

  constructor(
    private _shoesShippigService: ShoesShippingService,
    private _dataFormatService: DataFormatService,
   ) {
    this.columnsDef = [
      {
        headerName: 'STT',
        field: 'stt',
        cellRenderer: (params) => (this.paginationParams.pageNum - 1) * this.paginationParams.pageSize + params.rowIndex + 1,
      },
      {
        headerName: 'Số Đơn hàng',
        field: 'ShippingNo',
      },
      {
        headerName: 'Ngày đặt hàng',
        field: 'ShippingDate',
        valueFormatter: (param) => this._dataFormatService.dateTimeFormat(param.data.ShippingDate)
      },
      {
        headerName: 'Người bán hàng',
        field: 'SalesMan',
      },
      // {
      //   headerName: 'Trạng thái',
      //   field: 'OrderStatus',
      //   valueFormatter: (param) => this.statusList.find(e => e.value == param.data.OrderStatus)?.label,
      //   cellStyle: (params) => {
      //     if (params.value == 0) {
      //       return { backgroundColor: '#FF9933' };
      //     }
      //     if (params.value == 1) {
      //       return { color: 'white', backgroundColor: '#0033CC' };
      //     }
      //     if (params.value == 2) {
      //       return { backgroundColor: '#00FF00' };
      //     }
      //     if (params.value == 4) {
      //       return { color: 'white', backgroundColor: '#4F4F4F' };
      //     }
      //     if (params.value == 3) {
      //       return { color: 'white', backgroundColor: '#FF0033' };
      //     }
      //     return null;
      //   }
      // },
    ];

    this.shoesDetailcolumnsDef = [
      {
        headerName: 'STT',
        field: 'stt',
        cellRenderer: (params) => params.rowIndex + 1,
      },
      {
        headerName: 'Mã giày',
        field: 'ShoeCode',
      },
      {
        headerName: 'Tên giày',
        field: 'ShoeName',
      },
      {
        headerName: 'ĐVT',
        valueGetter: () => "Đôi"
      },
      // {
      //   headerName: 'Số lượng tồn',
      //   field: 'ShoeQty',
      // },
      {
        headerName: 'Số lượng mua',
        field: 'ShippingQty',
      },
      {
        headerName: 'Đơn giá',
        field: 'SellPrice',
        valueFormatter: (params) => this._dataFormatService.moneyFormat(params.data?.SellPrice)
      },
      {
        headerName: 'Thành tiền',
        valueGetter: (params) => Number(params.data.SellPrice * params.data.ShippingQty),
        valueFormatter: (params) => this._dataFormatService.moneyFormat(Number(params.data.SellPrice * params.data.ShippingQty))
      },
      {
        headerName: 'Thuế',
        valueGetter: () => "10%"
      },
      // {
      //   headerName: 'Số lượng nhận',
      //   field: 'ReceiveActQty',
      // },
    ];

    this.defaultColDef = {
      flex: 1,
      resizable: true,
      suppressMenu: true,
      menuTabs: [],
      tooltipValueGetter: (t: any) => t.value,
      textFormatter: function (r) {
        if (r == null) return null;
        return r.toLowerCase();
      },
    };
  }

  ngOnInit() {
    this.paginationParams = { pageNum: 1, pageSize: 10, totalCount: 0 };
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  onSearch(paginationParams: PaginationParamsModel) {
    this.selectedData = undefined;
    this.shippingDetailList = [];
    this.cusAdd = '';
    this.cusName = '';
    this.cusTel = '';
    this.cusRate = 0;

    this.paginationParams = paginationParams;
    var shipping = new GetShoeShippingInputDto();
    shipping.ShippingNo =  this.shippingNoFilter ?? '';
   // order.Orderstatus = this.status ?? 0;
   shipping.FromDate = this.fromDate ?? null;
   shipping.ToDate = this.toDate ?? null;
   shipping.CusName = this.cusNameFilter ?? '';
   shipping.CusTel = this.cusTelFilter ?? '';
    this._shoesShippigService.getShoesShipping(shipping).subscribe((res) => {
      this.rowData = res;
      this.pagedRowData =
        this.rowData.length > 0
          ? this.rowData.slice(
            (this.paginationParams.pageNum - 1) *
            this.paginationParams.pageSize,
            this.paginationParams.pageNum * this.paginationParams.pageSize
          )
          : [];
      this.paginationParams.totalCount = this.rowData.length;
      this.paginationParams.totalPage = ceil(
        this.rowData.length / this.paginationParams.pageSize
      );
    });
  }

  callBackEvent(event) {
    this.params = event;
    this.onGridReady(this.paginationParams);
  }

  onGridReady(paginationParams: PaginationParamsModel) {
    this.paginationParams = paginationParams;
    this.paginationParams.pageNum = 1;
    this.paginationParams.skipCount = ((paginationParams.pageNum ?? 1) - 1) * (paginationParams.pageSize ?? 10);
    this.onSearch(paginationParams);
  }

  changePaginationParams(paginationParams: PaginationParamsModel) {
    this.paginationParams = paginationParams;
    this.paginationParams.skipCount = ((paginationParams.pageNum ?? 1) - 1) * (paginationParams.pageSize ?? 10);
    this.onSearch(this.paginationParams);
  }

  onChangeSelection(params) {
    const selectedData = params.api.getSelectedRows();
    if (selectedData){ 
    this.selectedData = Object.assign({},selectedData[0]);
    this.cusAdd = this.selectedData.CusAdd;
    this.cusName = this.selectedData.ShippingUser;
    this.cusTel = this.selectedData.CusTel;
    this.cusRate = this.selectedData.CusRate;
    this.shippingDetailList = this.selectedData.ShoesList;
    setTimeout(() => {
      this.calculateFooter();
    },500);
    //this.calculateFooter();
    }
  }

  callBackShoeDetailEvent(event) {
    this.shoeParams = event;
  }

  calculateFooter(){
    this.preTaxPrice = 0;
    this.taxPrice = 0;
    this.totalPrice = 0;
    this.shoeParams.api.forEachNode(e => {
      this.preTaxPrice += ((Number(e.data.SellPrice) ?? 0) * (Number(e.data.ShippingQty) ?? 0));
      this.taxPrice = ceil(this.preTaxPrice / 100 * 10);
      this.discount = ceil(this.preTaxPrice / 100 * this.cusRate);
      this.totalPrice = this.preTaxPrice + this.taxPrice - this.discount;
    })

  }

  exportExcel(){
    this.shoeParams.api.exportDataAsCsv();
  }

}

