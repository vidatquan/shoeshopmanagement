import { ShoesShippingService } from './../../../_services/shoes-shipping.service';
import { Moment } from 'moment';
import { ceil } from 'lodash';
import { Customer } from 'src/app/_models/customer';
import { CustomerInfoModalComponent } from './../../customer-info-modal/customer-info-modal.component';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ShoesService } from 'src/app/_services/shoes.service';
import { ICellEditorParams } from 'ag-grid-community';
import { ShoeInfoModalComponent } from '../../shoe-info-modal/shoe-info-modal.component';
import { DataFormatService } from 'src/app/_services/data-format.service';
import { SaveShippingShoeDto } from 'src/app/_models/shoe-shipping/SaveShippingShoeDto';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
declare let alertify: any;
@Component({
  selector: 'create-or-edit-shoe-sale',
  templateUrl: './create-or-edit-shoe-sale.component.html',
  styleUrls: ['./create-or-edit-shoe-sale.component.scss']
})
export class CreateOrEditShoeSaleComponent implements OnInit {
  @ViewChild('modal') public modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('cusInfoModal', { static: false }) cusInfoModal: CustomerInfoModalComponent;
  @ViewChild('shoeInfoModal', { static: false }) shoeInfoModal: ShoeInfoModalComponent;
  columnsDef;
  defaultColDef;
  rowData = [];
  pagedRowData = [];
  params: any;
  user;
  selectedData;

  customer:any;
  cusRate:number;
  cusTel:number;

  preTaxPrice: any;
  taxPrice: any;
  discount:any;
  totalPrice: any;
  confirmOrder = false;
  shoeList = [];
  selectedNode: any;
  getCusRate(price){
    if(price >=0 && price < 15000000) return 0;
    if(price >=15000000 && price < 35000000) return 3;
    if(price >=35000000 && price < 60000000) return 5;
    if(price >=60000000) return 7;
    return 0;
  }

  constructor(
    private _shoesShippigService: ShoesShippingService,
    private _dataFormatService: DataFormatService,) {
    this.columnsDef = [
      {
        headerName: 'STT',
        field: 'stt',
        cellRenderer: (params) => params.rowIndex + 1,
      },
      {
        headerName: 'Mã giày',
        field: 'ShoeCode',
        editable: () => this.confirmOrder ? false : true,
        cellStyle: () => this.confirmOrder ? {} : { 'background-color': '#FFFFCC' }
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
        headerName: 'Số lượng tồn',
        field: 'ShoeQty',
      },
      {
        headerName: 'Số lượng mua',
        field: 'ShippingQty',
        editable: () => this.confirmOrder ? false : true,
        cellStyle: () => this.confirmOrder ? {} : { 'background-color': '#FFFFCC' }
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
    this.customer = new Customer();
    this.rowData = [];
  }

  show(){
    this.modal.show();
    this.customer = new Customer();
    this.params.api.setRowData([]);
    this.preTaxPrice = undefined;
    this.taxPrice = undefined;
    this.totalPrice = undefined;
  }

  close(){
    this.modal.hide();
  }

  callBackEvent(event) {
    this.params = event;
  }

  searchByEnter(param){
    this.cusInfoModal.show(param);
  }

  patchCusInfo(param){
    console.log(param);
    this.customer = param;
    this.cusRate = this.getCusRate(this.customer.CusShoeBuyPrice);
  }

  add() {
    var check = false;
    this.params.api.forEachNode(e => {
      if(!e.data.Id || !Number.isInteger(Number(e.data.ShippingQty))  ) check = true;
    });
    if(check) return alertify.error('Danh sách đặt hàng không hợp lệ');

    this.confirmOrder = false;
    this.params.api.redrawRows();

    this.params.api.applyTransaction({ add: [{ ShoeQty: 0, ShippingQty: 0, RealPrice: 0, TotalPrice: 0 }] });

    const index = this.params.api.getDisplayedRowCount() - 1;
    this.params.api.startEditingCell({ colKey: 'ShoeCode', rowIndex: index });
    this.params.api.getRowNode(index).setSelected(true);
    this.selectedNode = this.params.api.getRowNode(index);

  }

  cellEditingStoppedShoe(params) {
    if(params?.colDef?.field == 'ShippingQty'){
      if(!Number.isInteger(Number(params.newValue)) || Number(params.newValue) <= 0){//|| Number(params.newValue) <= 0 ) {
        alertify.error('Số lượng đặt không hợp lệ');
        //this.params.api.startEditingCell({ colKey: 'ShippingQty', rowIndex: this.selectedNode.rowIndex });
      }
    }
    // if(params?.colDef?.field == 'ShoeCode'){
    //   this.shoeInfoModal.show(params.newValue);
    // }
    this.params.api.redrawRows();
  }

  searchShoe(params: ICellEditorParams) {
    if (params?.colDef?.field != 'ShoeCode') return;
    this.shoeInfoModal.show(params.value);
  }

  patchShoeCode(params) {
    var check = false;
    this.params.api.forEachNode(e => {
      if(e.data.Id == params.Id) check = true;
    });
    if(check) return alertify.error('Mã giày đã tồn tại');

    this.selectedNode.data = Object.assign( params, {ShippingQty: 0, Id: params.Id});
    this.selectedData = this.selectedNode.data;
    this.params.api.applyTransaction({ update: [this.selectedNode.data]});
    this.params.api.startEditingCell({ colKey: 'ShippingQty', rowIndex: this.selectedNode.rowIndex });
  }

  onChangeSelection(params) {
    const selectedData = params.api.getSelectedRows();
    if (selectedData) this.selectedData = selectedData[0];
    this.selectedNode = params?.api.getSelectedNodes()[0] ?? new Node();
  }

  deleteShoe() {
    this.confirmOrder = false;
    this.params.api.applyTransaction({ remove: [this.selectedData] }); // xoá rows
    this.params.api.redrawRows();
  }

  refresh() {
    this.confirmOrder = false;
    this.rowData = [];
    this.params.setRowData([]);
    this.customer = new Customer();
  }

  confirm() {
    var check = false;
    var check1 = false;
    if(!this.customer.Id) return alertify.error('Thiếu thông tin KH');
    if(this.params.api.getDisplayedRowCount()  <= 0 ) return alertify.error('Danh sách mua hàng không hợp lệ');
    this.params.api.forEachNode(e => {
      if(!e.data.Id || !Number.isInteger(Number(e.data.ShippingQty)) || Number(e.data.OrderQty) <= 0) check = true; //|| Number(e.data.OrderQty) <= 0) check = true;
      else if((Number(e.data.ShoeQty)) < Number(e.data.ShippingQty)) check1 = true;
    });
    if(check1) return alertify.error('SL hàng trong kho không đủ');
    if(check) return alertify.error('Danh sách mua hàng không hợp lệ');
    this.selectedData = undefined;
    this.confirmOrder = true;
    this.params.api.redrawRows();
    this.calculateFooter();
  }
  
  save() {
    var body = new SaveShippingShoeDto();
    body.SalesMan = JSON.parse(localStorage.getItem('currentUser')).FullName;
    body.ShippingUser = this.customer.CusName;
    body.ShippingNo = '';
    body.ShippingDate = moment(); 
    body.CusId = this.customer.Id;
    body.ShoesList = [];
    body.TotalPrice = 0;
    body.CusRate = this.cusRate;
    this.params.api.forEachNode(e => {
      body.ShoesList.push({
        ShoeShippingId : 0,
        ShoeId : e.data.Id,
        ShipQty : e.data.ShippingQty,
        Price: e.data.SellPrice
      });
      body.TotalPrice = this.totalPrice;
    });
    this._shoesShippigService.shippingShoes(body).pipe(finalize(() => this.refresh())).subscribe(res => {
      alertify.success('Thêm mới thành công');
      this.exportToExcel();
      this.modal.hide();
      this.modalSave.emit(null);
    });
    console.log(body);
   }

  calculateFooter(){
    this.preTaxPrice = 0;
    this.taxPrice = 0;
    this.totalPrice = 0;
    this.params.api.forEachNode(e => {
      this.preTaxPrice += ((Number(e.data.SellPrice) ?? 0) * (Number(e.data.ShippingQty) ?? 0));
      this.taxPrice = ceil(this.preTaxPrice / 100 * 10);
      this.discount = ceil(this.preTaxPrice / 100 * this.cusRate);
      this.totalPrice = this.preTaxPrice + this.taxPrice - this.discount;
    })

  }

  exportToExcel(){
    this.params.api.exportDataAsCsv();
  }

}
