import { ceil } from 'lodash';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { PaginationParamsModel } from 'src/app/_components/shared/common/models/base.model';
import { ShoesService } from 'src/app/_services/shoes.service';
import { UserService } from 'src/app/_services/user.service';
import { Shoes } from 'src/app/_models/shoe-info/shoes';
import { Router } from '@angular/router';
import { GetShoeOrderDetailInput } from 'src/app/_models/shoe-order/GetShoeOrderDetailInput';
import { GetShoeOrdersInput } from 'src/app/_models/shoe-order/GetShoeOrdersInput';
import { DataFormatService } from 'src/app/_services/data-format.service';
import { ShoesOrderService } from 'src/app/_services/shoe-order.service';

@Component({
  selector: 'app-shoe-receive',
  templateUrl: './shoe-receive.component.html',
  styleUrls: ['./shoe-receive.component.scss']
})
export class ShoeReceiveComponent implements OnInit {
  paginationParams: PaginationParamsModel;

  columnsDef;
  defaultColDef;
  orderDetailcolumnsDef;
  rowData = [];
  pagedRowData = [];
  orderDetailList = [];
  params: any;
  orderDetailParams: any;
  user;
  selectedData;
  orderDate = moment();
  orderNoFilter: any;

  month = moment().month();
  year = moment().year();
  cusEmail: string;
  cusTel: string;
  cusCmnd: string;
  areaList: any[] = [];
  status: number = -1;
  statusList = [
    { value: -1, label: 'Tất cả' },
    { value: 0, label: 'Kho chưa nhận' },
    { value: 1, label: 'Kho đã nhận' },
    { value: 2, label: 'Hoàn thành' },
    { value: 3, label: 'Huỷ' },
    { value: 4, label: 'Từ chối' },
  ];

  fullName: string;
  // email: string;
  // tel: string;
  code: string;
  // registerNo  : string;
  // cmnd: string;
  // areaList: any[]=[];
  // areaId : number = 0;
  type: any;
  gender: any;
  size: any;
  color: any;

  colorList: any[] = [
    { label: "Tất cả", value: "Tất cả" },
    { label: "Đen", value: "Đen" },
    // {label:"Đen trắng",value:"Đen trắng"},
    //{label:"Đen xám",value:"Đen xám"},
    { label: "Đỏ", value: "Đỏ" },
    { label: "Xám", value: "Xám" },
    { label: "Hồng", value: "Hồng" },
    { label: "Trắng", value: "Trắng" },
    { label: "Xanh da trời", value: "Xanh da trời" },
    { label: "Xanh rêu", value: "Xanh rêu" },
    { label: "Phối màu", value: "Phối màu" },
  ]

  constructor(
    private _shoesOrderService: ShoesOrderService,
    private _dataFormatService: DataFormatService,
    private _shoesService: ShoesService,
    private router: Router,) {
    this.columnsDef = [
      {
        headerName: 'STT',
        field: 'stt',
        cellRenderer: (params) => (this.paginationParams.pageNum - 1) * this.paginationParams.pageSize + params.rowIndex + 1,
      },
      {
        headerName: 'Số Đơn hàng',
        field: 'OrderNo',
      },
      {
        headerName: 'Ngày đặt hàng',
        field: 'OrderDate',
        valueFormatter: (param) => this._dataFormatService.dateTimeFormat(param.data.OrderDate)
      },
      {
        headerName: 'Người đặt hàng',
        field: 'OrderUser',
      }
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
        headerName: 'Số lượng đã nhận',
        field: 'ReceiveActQty',
      },
      {
        headerName: 'Số lượng cần giao',
        valueGetter: (params) => Number(params.data.OrderQty - params.data.ReceiveActQty),
      },
      {
        headerName: 'Đơn giá',
        field: 'Price',
        valueFormatter: (params) => this._dataFormatService.moneyFormat(params.data?.Price)
      },
      {
        headerName: 'Thành tiền dự kiến',
        valueGetter: (params) => Number(params.data.Price * (params.data.OrderQty - params.data.ReceiveActQty)),
        valueFormatter: (params) => this._dataFormatService.moneyFormat(Number(params.data.Price * (params.data.OrderQty - params.data.ReceiveActQty)))
      },
      {
        headerName: 'Thuế',
        valueGetter: () => "10%"
      },
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
    this.orderDetailList = [];
    
    this.paginationParams = paginationParams;
    var order = new GetShoeOrdersInput();
    order.OrderNo = this.orderNoFilter ?? '';
    order.Orderstatus = 1;
    order.FromDate = this.orderDate ?? null;
    order.ToDate = this.orderDate ?? null;
    this._shoesOrderService.getShoesOrder(order).subscribe((res) => {
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
  callBackOrderDetailEvent(event) {
    this.orderDetailParams = event;
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
    this.getShoeOrderdetail();
  }

  getShoeOrderdetail() {
    var body = new GetShoeOrderDetailInput();
    body.Id = this.selectedData.Id;
    this._shoesOrderService.getShoesOrderDetail(body).subscribe(res => {
      this.orderDetailList = res;
    })
  }

}
