import { finalize } from 'rxjs/operators';
  import { Component, OnInit } from '@angular/core';
  import { DataFormatService } from 'src/app/_services/data-format.service';
  import * as moment from 'moment';
import { Moment } from 'moment';
import { ReportInput } from 'src/app/_models/shoe-report/ReportInput';
import { ShoesShippingService } from 'src/app/_services/shoes-shipping.service';
  declare let alertify: any;
  
  @Component({
    selector: 'app-history-shoe-sale',
    templateUrl: './history-shoe-sale.component.html',
    styleUrls: ['./history-shoe-sale.component.scss']
  })
  export class HistoryShoeSaleComponent implements OnInit {
    columnsDef;
    defaultColDef;
    rowData = [];
    params: any;
    user;
    selectedData;
    pagedRowData;
    fromDate:Moment|null;
    toDate:Moment|null;
    
    tongThu:number;
    tongChi:number;
    soDu:number;
  
    constructor(
      private _shoeShippingService: ShoesShippingService,
      private _dataFormatService: DataFormatService,
      ) {
      this.columnsDef = [
        {
          headerName: 'STT',
          field: 'stt',
          cellRenderer: (params) => params.rowIndex + 1,
        },
        {
          headerName: 'Đơn hàng',
          field: 'Code',
        },
        {
          headerName: 'Ngày tạo đơn',
          field:'Date',
          valueFormatter: (params) => this._dataFormatService.dateFormat(params.data?.Date)
        },
        {
          headerName: 'Số loại sản phẩm',
          field: 'ShoeQty',
        },
        {
          headerName: 'Số lượng sản phẩm',
          field: 'TotalQty',
        },
        {
          headerName: 'Chi',
          //field: 'TotalPrice',
          valueGetter: (params) => params.data.Status == 0 ? params.data.TotalPrice : undefined,
          valueFormatter: (params) => params.data.Status == 0 ?  this._dataFormatService.moneyFormat(params.data?.TotalPrice) : undefined,
          //đỏ
          cellStyle: (params) => {  if(params.data.Status == 0) return { color: 'white', backgroundColor: '#FF0033' }; }
        },
        {
          headerName: 'Thu',
          //field: 'TotalPrice',
          valueGetter: (params) => params.data.Status == 1 ? params.data.TotalPrice : undefined,
          valueFormatter: (params) => params.data.Status == 1 ?  this._dataFormatService.moneyFormat(params.data?.TotalPrice) : undefined,
          cellStyle: (params) => { if(params.data.Status == 1) return { color: '#003366', backgroundColor: '#00FF00' }; }
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
      this.user = JSON.parse(localStorage.getItem('currentUser'));
    }
  
    onSearch() {
      if(!this.checkValidate()) return;
      this.selectedData = undefined;
      this.tongThu = undefined;
      this.tongChi = undefined;
      this.soDu = undefined;
  
      var body = new ReportInput();
      body.FromDate = this.fromDate ?? moment();
      body.ToDate = this.toDate ?? moment();
      this._shoeShippingService.getReportProfits(body).pipe(finalize(() => setTimeout(() => this.calculateFooter(),20)))
        .subscribe((res) => {
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
      // if(this.fromDate < this.toDate){
      //   alertify.error("Từ ngày phải nhỏ hơn đến ngày");
      //   return false
      // };
      return true;
    }

    calculateFooter(){
      this.tongThu = 0;
      this.tongChi = 0;
      this.soDu = 0;
      this.params.api.forEachNode(e => {
        if(e.data.Status == 0) this.tongChi += Number(e.data.TotalPrice);
        if(e.data.Status == 1) this.tongThu += Number(e.data.TotalPrice);
        this.soDu = this.tongThu - this.tongChi;
      })
  
    }
  }
  
  
  
  