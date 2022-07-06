    import { finalize } from 'rxjs/operators';
    import { ceil } from 'lodash';
    import { Component, OnInit, ViewChild } from '@angular/core';
    import { PaginationParamsModel } from 'src/app/_components/shared/common/models/base.model';
    import { ShoesService } from 'src/app/_services/shoes.service';
    import { DataFormatService } from 'src/app/_services/data-format.service';
    import * as moment from 'moment';
    import { ShoeInfoModalComponent } from '../shoe-info-modal/shoe-info-modal.component';
    import { ICellEditorParams } from 'ag-grid-community';
    import { GridTableService } from 'src/app/_services/grid-table.service';
    import { DataOrder } from 'src/app/_models/shoe-order/dataOrder';
    import { ShoesOrderService } from 'src/app/_services/shoe-order.service';
import { Moment } from 'moment';
import { ReportInput } from 'src/app/_models/shoe-report/ReportInput';
import { ShoesShippingService } from 'src/app/_services/shoes-shipping.service';
    declare let alertify: any;
    
    @Component({
      selector: 'app-history-shoe-sale',
      templateUrl: './top-shoe-sale.component.html',
      styleUrls: ['./top-shoe-sale.component.scss']
    })
    export class TopShoeSaleComponent implements OnInit {
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
      //
      fromDate:Moment|null;
      toDate:Moment|null;
    
      constructor(
        private _shoeShippingService: ShoesShippingService,
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
            headerName: 'Số lượng đã bán',
            field: 'ShoeQty',
          },
          {
            headerName: 'Doanh thu',
            field: 'TotalPrice',
            valueFormatter: (params) => this._dataFormatService.moneyFormat(params.data?.TotalPrice)
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
    
      onSearch() {
        if(!this.checkValidate()) return;
        this.selectedData = undefined;
    
        var body = new ReportInput();
        body.FromDate = this.fromDate ?? moment();
        body.ToDate = this.toDate ?? moment();
        this._shoeShippingService.getReportTopShoeSale(body).subscribe((res) => {
          this.rowData = res;
        });
      }
    
      callBackEvent(event) {
        this.params = event;
      }
    
      exportToExcel(){
        this.params.api.exportDataAsCsv();
      }
  
      checkValidate(){
        if(this.fromDate == undefined || this.toDate == undefined){
          alertify.error("Ngày không hợp lệ");
          return false;
        };
        return true;
      }
  
    }
    
    
    
    