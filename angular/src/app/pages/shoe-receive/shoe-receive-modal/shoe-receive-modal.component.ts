import { ceil } from 'lodash';
import { finalize } from 'rxjs/operators';
import { Order } from './../../../_models/order';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SaveReceiveShoeDto } from 'src/app/_models/shoe-receive/SaveReceiveShoeDto';
import { DataFormatService } from 'src/app/_services/data-format.service';
import { ShoesReceiveService } from 'src/app/_services/shoes-receive.service';
import { GetShoeReceiveInput } from 'src/app/_models/shoe-receive/GetShoeReceiveInput';
declare let alertify: any;
@Component({
  selector: 'app-shoe-receive-modal',
  templateUrl: './shoe-receive-modal.component.html',
  styleUrls: ['./shoe-receive-modal.component.scss']
})
export class ShoeReceiveModalComponent implements OnInit {
  @ViewChild('modal') public modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() orderDetailList: any;
  @Input() orderNo: any;
  @Input() orderDate: any;
  @Input() orderId : any;

  columnsDef;
  defaultColDef;
  rowData = [];
  pagedRowData = [];
  params: any;
  user;
  selectedData;
  fullName;
  code: string;
  receiveDate: any;//moment();
  deliveryNo:string;
  receiveList = [];
  preTaxPrice:number;
  taxPrice:number;
  totalPrice:number;
  check = false;

  constructor(
    private _dataFormatService: DataFormatService,
    private _shoeReceiveService: ShoesReceiveService
  ) {
    this.columnsDef = [
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
        headerName: 'Số lượng giao',
        field: 'DeliveryQty',
        editable: true,
        cellStyle: { 'background-color': '#FFFFCC' }
      },
      {
        headerName: 'Số lượng thực nhận',
        field: 'ReceiveActualQty',
        editable: true,
        cellStyle: { 'background-color': '#FFFFCC' }
      },
      {
        headerName: 'Đơn giá',
        field: 'Price',
        valueFormatter: (params) => this._dataFormatService.moneyFormat(params.data?.Price)
      },
      {
        headerName: 'Thành tiền',
        valueGetter: (params) => Number(params.data.Price * (params.data.ReceiveActualQty)),
        valueFormatter: (params) => this._dataFormatService.moneyFormat(Number(params.data.Price * params.data.ReceiveActualQty))
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
  }

  callBackEvent(event) {
    this.params = event;
  }

  onChangeSelection(params) {
    const selectedData = params.api.getSelectedRows();
    if (selectedData) this.selectedData = Object.assign({},selectedData[0]);
  }

  close() {
    this.modal.hide();
  }

  show() {
    this.deliveryNo = '';
    this.receiveDate = moment();
    this.pagedRowData = [];
    this.preTaxPrice = 0;
    this.taxPrice = 0;
    this.totalPrice = 0;
    this.check = false;

    this.getListReceive();
    this.selectedData = undefined;
    this.fullName = JSON.parse(localStorage.getItem('currentUser'))?.FullName;
    this.pagedRowData = this.orderDetailList;
    this.modal.show();
  }


  save() {
    if (!this.checkBeforeSave()) return;
      var body = new SaveReceiveShoeDto();
      body.ShoeOrderId = this.orderId;
      body.ReceiveUser = this.fullName;
      body.ReceiveNo = this.deliveryNo;
      body.OrderNo = this.orderNo;
      body.ReceiveDate = this.receiveDate;
      body.ShoesList = [];
      this.params.api.forEachNode(e => {
        body.ShoesList.push({
          ShoeReceiveId : 0,
          ShoeId : e.data.ShoeId,
          OrderQty: e.data.OrderQty, // sl đặt
          DeliveryQty : e.data.DeliveryQty, // số lượng giao 
          ReceiveQty : e.data.ReceiveActualQty, // số lượng thực nhận
          ShoeReceivedQtyInStock : Number(e.data.ReceiveActQty) + Number(e.data.ReceiveActualQty), // số lượng đã nhận ở trong kho
          // SL đặt - SL đã nhận - số lượng thực nhận > 0 => chưa nhận đủ  
          CheckReceiveComplete : Number(e.data.OrderQty) - Number(e.data.ReceiveActQty) - Number(e.data.ReceiveActualQty) > 0 ? 0 : 1,
          Price: e.data.Price
        });
        //if()
      });

      //cập nhật trạng thái đơn đặt hàng
      if(body.ShoesList?.every(e => e.CheckReceiveComplete == 1)) body.CheckShoeOrderComplete = 1;

      this._shoeReceiveService.receiveShoes(body).subscribe(res => {
        alertify.success('Nhận hàng thành công');
        this.exportToExcel();
        this.modal.hide();
        this.modalSave.emit(null);
      });
  }

  confirm(){
    if (!this.checkBeforeSave()) return;
    this.calculateFooter();
    this.check = true;
  }

  checkBeforeSave() {
    var check = true;
    // if (!this.deliveryNo) {
    //   alertify.error('Số PGH không được trống!');
    //   return false;
    // };

    if (!this.receiveDate) {
      alertify.error('Ngày nhận không được trống!');
      return false;
    }

    // if (this.receiveList.some(e => e.ReceiveNo.toLowerCase() == this.deliveryNo.toLowerCase()) ) {
    //   alertify.error('PGH đã tồn tại!');
    //   return false;
    // }

    // else if ((Math.floor((Date.UTC(this.orderDate.getFullYear(), this.orderDate.getMonth(), this.orderDate.getDate()) - Date.UTC(this.receiveDate.getFullYear(), this.receiveDate.getMonth(), this.receiveDate.getDate())) / (1000 * 60 * 60 * 24))) > 0) {
    //   alertify.error('Ngày nhận không nhỏ hơn ngày đặt!');
    //   return false;
    // };
    this.params.api.forEachNode((e, index) => {
      console.log(e.data);
      if (!Number.isInteger(Number(e.data.DeliveryQty)) || Number(e.data.DeliveryQty) < 0) {
        alertify.error('Số lượng giao không hợp lệ!');
        check = false;
      }
      else if (!Number.isInteger(Number(e.data.ReceiveActualQty)) || Number(e.data.ReceiveActualQty) < 0) {
        alertify.error('Số lượng thực nhận không hợp lệ!');
        check = false;
      }
      else if ( Number(e.data.OrderQty) -  Number(e.data.DeliveryQty) < 0) {
        alertify.error('SL giao không được lớn hơn SL đặt!');
        check = false;
      }
      else if ( Number(e.data.DeliveryQty) -  Number(e.data.ReceiveActualQty) < 0) {
        alertify.error('SL thực nhận không được lớn hơn SL giao!');
        check = false;
      }

    });
    if(!check) return;

    // if (!Number.isInteger(Number(e.data.OrderQty)) || isNaN(this.shoe?.RealPrice) || Number(this.shoe?.RealPrice) < 0) {
    //   alertify.error('Giá thực không hợp lệ!');
    //   return false;
    // };
    // if (!this.shoe?.SellPrice) {
    //   alertify.error('Giá bán không được trống!');
    //   return false;
    // };
    // if (isNaN(this.shoe?.SellPrice) || Number(this.shoe?.SellPrice) < 0) {
    //   alertify.error('Giá bán không hợp lệ!');
    //   return false;
    // };

    

    return true;
  }

  exportToExcel(){
    this.params.api.exportDataAsCsv();
  }

  getListReceive(){
    var receive = new GetShoeReceiveInput();
    receive.ReceiveNo = '';
    receive.FromDate =  moment("1999-01-01");
    receive.ToDate =  moment("2222-01-01");
    this._shoeReceiveService.getShoesReceive(receive).subscribe((res) => {
      this.receiveList = res;
    });
  }

  calculateFooter(){
    this.preTaxPrice = 0;
    this.taxPrice = 0;
    this.totalPrice = 0;
    this.params.api.forEachNode(e => {
      this.preTaxPrice += (e.data.Price ?? 0) * (e.data.ReceiveActualQty ?? 0);
      this.taxPrice = ceil(this.preTaxPrice / 100 * 10);
      this.totalPrice = this.preTaxPrice + this.taxPrice;
    })

  }
}
