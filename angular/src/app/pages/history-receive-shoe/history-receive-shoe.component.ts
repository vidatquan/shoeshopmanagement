import { finalize } from 'rxjs/operators';
import { ceil } from 'lodash';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { PaginationParamsModel } from 'src/app/_components/shared/common/models/base.model';
import { DataFormatService } from 'src/app/_services/data-format.service';
import { ShoesReceiveService } from 'src/app/_services/shoes-receive.service';
import { GetShoeReceiveInput } from 'src/app/_models/shoe-receive/GetShoeReceiveInput';
import { GetShoeReceiveDetailInput } from 'src/app/_models/shoe-receive/GetShoeReceiveDetailInput';
declare let alertify: any;
@Component({
  selector: 'app-history-receive-shoe',
  templateUrl: './history-receive-shoe.component.html',
  styleUrls: ['./history-receive-shoe.component.scss']
})
export class HistoryReceiveShoeComponent implements OnInit {
  paginationParams: PaginationParamsModel;

  columnsDef;
  defaultColDef;
  orderDetailcolumnsDef;
  rowData = [];
  pagedRowData = [];
  receiveDetailList = [];
  params: any;
  receiveDetailParams: any;
  user;
  selectedData;
  fromDate = moment();
  toDate = moment();
  preTaxPrice:number;
  taxPrice:number;
  totalPrice:number;
  fullName: string;
  receiveNo:any;

  constructor(
    private _shoesReceiveService: ShoesReceiveService,
    private _dataFormatService: DataFormatService,
    ) {
    this.columnsDef = [
      {
        headerName: 'STT',
        field: 'stt',
        cellRenderer: (params) => (this.paginationParams.pageNum - 1) * this.paginationParams.pageSize + params.rowIndex + 1,
      },
      {
        headerName: 'Số PGH',
        field: 'ReceiveNo',
      },
      {
        headerName: 'Số Đơn hàng',
        field: 'OrderNo',
      },
      {
        headerName: 'Người nhận hàng',
        field: 'ReceiveUser',
      },
      {
        headerName: 'Ngày nhận hàng',
        field: 'ReceiveDate',
        valueFormatter: (param) => this._dataFormatService.dateTimeFormat(param.data.ReceiveDate)
      },
    ];

    this.orderDetailcolumnsDef = [
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
      {
        headerName: 'Số lượng đặt',
        field: 'OrderQty',
      },
      {
        headerName: 'Số lượng giao',
        field: 'DeliveryQty',
      },
      {
        headerName: 'Số lượng thực nhận',
        field: 'ReceiveActQty',
      },
      {
        headerName: 'Đơn giá',
        field: 'RealPrice',
        valueFormatter: (params) => this._dataFormatService.moneyFormat(params.data?.RealPrice)
      },
      {
        headerName: 'Thành tiền',
        valueGetter: (params) => Number(params.data.RealPrice * params.data.ReceiveActQty),
        valueFormatter: (params) => this._dataFormatService.moneyFormat(Number(params.data.RealPrice * params.data.ReceiveActQty))
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
    //this.getCacheData();
  }

  onSearch(paginationParams: PaginationParamsModel) {
    this.selectedData = undefined;
    this.receiveDetailList = [];
    this.preTaxPrice = 0;
    this.taxPrice = 0;
    this.totalPrice = 0;

    this.paginationParams = paginationParams;
    var receive = new GetShoeReceiveInput();
    receive.ReceiveNo = this.receiveNo ?? '';
    receive.FromDate = this.fromDate ?? null;
    receive.ToDate = this.toDate ?? null;
    this._shoesReceiveService.getShoesReceive(receive).subscribe((res) => {
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
  callBackReceiveDetailEvent(event) {
    this.receiveDetailParams = event;
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
    if (selectedData) this.selectedData = Object.assign({},selectedData[0]);
    this.getShoeReceiveDetail();
  }

  getShoeReceiveDetail() {
    var body = new GetShoeReceiveDetailInput();
    body.Id = this.selectedData.Id;
    this._shoesReceiveService.getShoesReceiveDetail(body)
    .subscribe(res => {
      this.receiveDetailList = res;
      this.calculateFooter();
    })
  }

  calculateFooter(){
    this.preTaxPrice = 0;
    this.taxPrice = 0;
    this.totalPrice = 0;
    this.receiveDetailList?.forEach(e => {
      this.preTaxPrice += e.RealPrice * e.ReceiveActQty;
      this.taxPrice = ceil(this.preTaxPrice / 100 * 10);
      this.totalPrice = this.preTaxPrice + this.taxPrice;
    });
  //  this.receiveDetailParams.api.forEachNode(e => {
  //    console.log(e);
  //     this.preTaxPrice += e.data.RealPrice ?? 0 * e.data.ReceiveActQty ?? 0;
  //     this.taxPrice = ceil(this.preTaxPrice / 100 * 10);
  //     this.totalPrice = this.preTaxPrice + this.taxPrice;
  //  })

  }

}

