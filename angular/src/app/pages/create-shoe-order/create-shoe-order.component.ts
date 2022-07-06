import { finalize } from 'rxjs/operators';
import { Order } from './../../_models/order';
import { ceil } from 'lodash';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginationParamsModel } from 'src/app/_components/shared/common/models/base.model';
import { Shoes } from 'src/app/_models/shoe-info/shoes';
import { ShoesService } from 'src/app/_services/shoes.service';
import { UserService } from 'src/app/_services/user.service';
import { DataFormatService } from 'src/app/_services/data-format.service';
import * as moment from 'moment';
import { GetShoeInfoInput } from 'src/app/_models/shoe-info/GetShoeInfoInput';
import { ShoeInfoModalComponent } from '../shoe-info-modal/shoe-info-modal.component';
import { ICellEditor, ICellEditorParams } from 'ag-grid-community';
import { GridTableService } from 'src/app/_services/grid-table.service';
import { DataOrder } from 'src/app/_models/shoe-order/dataOrder';
import { ShoesOrderService } from 'src/app/_services/shoe-order.service';
declare let alertify: any;

@Component({
  selector: 'app-create-shoe-order',
  templateUrl: './create-shoe-order.component.html',
  styleUrls: ['./create-shoe-order.component.scss']
})
export class CreateShoeOrderComponent implements OnInit {
  @ViewChild('shoeInfoModal', { static: false }) shoeInfoModal: ShoeInfoModalComponent;
  paginationParams: PaginationParamsModel;

  columnsDef;
  defaultColDef;
  rowData = [];
  params: any;
  user;
  selectedData;

  fullName: string;
  orderDate: any;
  orderDateFormat: any;
  preTaxPrice: any;
  taxPrice: any;
  totalPrice: any;
  confirmOrder = false;
  shoeList = [];
  selectedNode: any;

  constructor(
    private _shoeOrderService: ShoesOrderService,
    private _dataFormatService: DataFormatService,
    private _shoesService: ShoesService,
    private _gridTableServcie: GridTableService) {
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
        headerName: 'Số lượng đặt',
        field: 'OrderQty',
        editable: () => this.confirmOrder ? false : true,
        cellStyle: () => this.confirmOrder ? {} : { 'background-color': '#FFFFCC' }
      },
      {
        headerName: 'Đơn giá',
        field: 'RealPrice',
        valueFormatter: (params) => this._dataFormatService.moneyFormat(params.data?.RealPrice)
      },
      {
        headerName: 'Thành tiền',
        valueGetter: (params) => Number(params.data.RealPrice * params.data.OrderQty),
        valueFormatter: (params) => this._dataFormatService.moneyFormat(Number(params.data.RealPrice * params.data.OrderQty))
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
    this.fullName = this.user.FullName;
    this.orderDate = moment();
    this.orderDateFormat = this._dataFormatService.dateTimeFormat(this.orderDate);
  }

  callBackEvent(event) {
    this.params = event;
  }

  searchShoe(params: ICellEditorParams) {
    if (params?.colDef?.field != 'ShoeCode') return;
    this.shoeInfoModal.show(params.value);
  }

  patchShoeCode(params) {
    var check = false;
    this.params.api.forEachNode(e => {
      if(e.data.ShoeOrderId == params.Id) check = true;
    });
    if(check) return alertify.error('Mã giày đã tồn tại');

    this.selectedNode.data = Object.assign( params, {OrderQty: 0, ShoeOrderId: params.Id});
    this.selectedData = this.selectedNode.data;
    this.params.api.applyTransaction({ update: [this.selectedNode.data]});
    this.params.api.startEditingCell({ colKey: 'OrderQty', rowIndex: this.selectedNode.rowIndex });
  }

  cellEditingStoppedShoe(params) {
    if(params?.colDef?.field == 'OrderQty'){
      if(!Number.isInteger(Number(params.newValue)) || Number(params.newValue) <= 0 ) {
        alertify.error('Số lượng đặt không hợp lệ');
        this.params.api.startEditingCell({ colKey: 'OrderQty', rowIndex: this.selectedNode.rowIndex });
      }
    }
    // if(params?.colDef?.field == 'ShoeCode'){
    //   this.shoeInfoModal.show(params.newValue);
    // }
    
  }

  onChangeSelection(params) {
    const selectedData = params.api.getSelectedRows();
    if (selectedData) this.selectedData = selectedData[0];
    this.selectedNode = params?.api.getSelectedNodes()[0] ?? new Node();
  }

  add() {
    var check = false;
    this.params.api.forEachNode(e => {
      if(!e.data.ShoeOrderId || !Number.isInteger(Number(e.data.OrderQty)) || Number(e.data.OrderQty) <= 0 ) check = true;
    });
    if(check) return alertify.error('Danh sách đặt hàng không hợp lệ');

    this.confirmOrder = false;
    this.params.api.redrawRows();

    this.params.api.applyTransaction({ add: [{ ShoeQty: 0, OrderQty: 0, RealPrice: 0, TotalPrice: 0 }] });

    const index = this.params.api.getDisplayedRowCount() - 1;
    this.params.api.startEditingCell({ colKey: 'ShoeCode', rowIndex: index });
    this.params.api.getRowNode(index).setSelected(true);
    this.selectedNode = this.params.api.getRowNode(index);

  }

  deleteShoe() {
    this.confirmOrder = false;
    this.params.api.applyTransaction({ remove: [this.selectedData] }); // xoá rows
    this.params.api.redrawRows();
  }

  refresh() {
    this.confirmOrder = false;
    this.rowData = [];
    this.fullName = this.user.FullName;
    this.orderDate = moment();
    this.orderDateFormat = this._dataFormatService.dateTimeFormat(this.orderDate);
    this.preTaxPrice = 0;
    this.taxPrice = 0;
    this.totalPrice = 0;
  }

  confirm() {
    var check = false;
    if(this.params.api.getDisplayedRowCount()  <= 0) return alertify.error('Danh sách đặt hàng không hợp lệ');
    this.params.api.forEachNode(e => {
      if(!e.data.ShoeOrderId || !Number.isInteger(Number(e.data.OrderQty)) || Number(e.data.OrderQty) <= 0) check = true;
    });
    if(check) return alertify.error('Danh sách đặt hàng không hợp lệ');
    this.selectedData = undefined;
    this.confirmOrder = true;
    this.params.api.redrawRows();
    this.calculateFooter();
  }

  save() {
    var body = new DataOrder();
    body.OrderUser = this.fullName;
    body.OrderDate = this.orderDate;
    body.OrderNo = ''; 
    body.ShoesList = [];
    this.params.api.forEachNode(e => {
      body.ShoesList.push({
        ShoeOrderId : 0,
        ShoeId : e.data.ShoeOrderId,
        OrderQty : e.data.OrderQty,
        Price: e.data.RealPrice
      });
    })
    this._shoeOrderService.orderShoes(body).pipe(finalize(() => this.refresh())).subscribe(res => {
      alertify.success('Thêm mới thành công');
      this.exportToExcel();
      //this.refresh();
    });
   }

  calculateFooter(){
    this.preTaxPrice = 0;
    this.taxPrice = 0;
    this.totalPrice = 0;
    this.params.api.forEachNode(e => {
      this.preTaxPrice += (e.data.RealPrice ?? 0) * (e.data.OrderQty ?? 0);
      this.taxPrice = ceil(this.preTaxPrice / 100 * 10);
      this.totalPrice = this.preTaxPrice + this.taxPrice;
    })

  }

  exportToExcel(){
    this.params.api.exportDataAsCsv();
  }
}



