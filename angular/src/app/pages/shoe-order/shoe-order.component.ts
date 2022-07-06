import { GetShoeOrdersInput } from './../../_models/shoe-order/GetShoeOrdersInput';
import { ceil } from 'lodash';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { PaginationParamsModel } from 'src/app/_components/shared/common/models/base.model';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { ShoesService } from 'src/app/_services/shoes.service';
import { Shoes } from 'src/app/_models/shoe-info/shoes';
import { ShoesOrderService } from 'src/app/_services/shoe-order.service';
import { DataFormatService } from 'src/app/_services/data-format.service';
import { GetShoeOrderDetailInput } from 'src/app/_models/shoe-order/GetShoeOrderDetailInput';
import { CancelShoeOrderInput } from 'src/app/_models/shoe-order/CancelShoeOrderInput';
declare let alertify: any;
@Component({
  selector: 'app-shoe-order',
  templateUrl: './shoe-order.component.html',
  styleUrls: ['./shoe-order.component.scss']
})
export class ShoeOrderComponent implements OnInit {
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
  fromDate = moment();
  toDate = moment();
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
    { value: 0, label: 'Kho chưa xác nhận' },
    { value: 1, label: 'Kho đã xác nhận' },
    { value: 2, label: 'Hoàn thành' },
    { value: 3, label: 'Huỷ' },
    { value: 4, label: 'Từ chối' },
  ];

  fullName: string;
  code: string;

  constructor(
    private _shoesOrderService: ShoesOrderService,
    private _dataFormatService: DataFormatService,
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
      },
      {
        headerName: 'Trạng thái',
        field: 'OrderStatus',
        valueFormatter: (param) => this.statusList.find(e => e.value == param.data.OrderStatus)?.label,
        cellStyle: (params) => {
          if (params.value == 0) {
            return { backgroundColor: '#FF9933' };
          }
          if (params.value == 1) {
            return { color: 'white', backgroundColor: '#0033CC' };
          }
          if (params.value == 2) {
            return { backgroundColor: '#00FF00' };
          }
          if (params.value == 4) {
            return { color: 'white', backgroundColor: '#4F4F4F' };
          }
          if (params.value == 3) {
            return { color: 'white', backgroundColor: '#FF0033' };
          }
          return null;
        }
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
      // {
      //   headerName: 'Số lượng tồn',
      //   field: 'ShoeQty',
      // },
      //chưa xem
      {
        headerName: 'Số lượng đặt',
        field: 'OrderQty',
      },
      {
        headerName: 'Đơn giá',
        field: 'Price',
        valueFormatter: (params) => this._dataFormatService.moneyFormat(params.data?.Price)
      },
      {
        headerName: 'Thành tiền',
        valueGetter: (params) => Number(params.data.RealPrice * params.data.OrderQty),
        valueFormatter: (params) => this._dataFormatService.moneyFormat(Number(params.data.Price * params.data.OrderQty))
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

    this.paginationParams = paginationParams;
    var order = new GetShoeOrdersInput();
    order.OrderNo = this.orderNoFilter ?? '';
    order.Orderstatus = this.status ?? 0;
    order.FromDate = this.fromDate ?? null;
    order.ToDate = this.toDate ?? null;
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

  createOrderShoe() {
    this.router.navigate(['/create-shoe-order']);
  }

  getShoeOrderdetail() {
    var body = new GetShoeOrderDetailInput();
    body.Id = this.selectedData.Id;
    this._shoesOrderService.getShoesOrderDetail(body).subscribe(res => {
      console.log(res);
      this.orderDetailList = res;
    })
  }

  cancelOrder(){
    var body = new CancelShoeOrderInput();
    body.OrderNo = this.selectedData.OrderNo;
    this._shoesOrderService.cancelShoeOrder(body).subscribe(res => {
      this.onGridReady(this.paginationParams);
      alertify.success('Huỷ đơn hàng thành công');
    })
  }

}
