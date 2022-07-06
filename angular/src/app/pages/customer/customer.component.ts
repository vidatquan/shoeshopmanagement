import { Component, OnInit } from '@angular/core';
import { PaginationParamsModel } from 'src/app/_components/shared/common/models/base.model';
import { ceil } from 'lodash';
import { CustomerService } from 'src/app/_services/customer.service';
import { GetCusInputDto } from 'src/app/_models/get-cus-input-dto';
declare let alertify: any;
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  paginationParams: PaginationParamsModel;

  columnsDef;
  defaultColDef;
  rowData = [];
  pagedRowData = [];
  params: any;
  selectedData;
  cusName: string;
  cusEmail: string;
  cusTel: string;
  cusType(price){
    if(price >=0 && price < 15000000) return 'KH thành viên';
    if(price >=15000000 && price < 35000000) return 'KH đồng hành';
    if(price >=35000000 && price < 60000000) return 'KH thân thiết';
    if(price >=60000000) return 'KH VIP';
    return '';
  }
  constructor(private _customerService: CustomerService) {
    this.columnsDef = [
      {
        headerName: 'STT',
        cellRenderer: (params) => (this.paginationParams.pageNum - 1) * this.paginationParams.pageSize + params.rowIndex + 1,
      },
      {
        headerName: 'Tên KH',
        field: 'CusName',
      },
      {
        headerName: 'Email',
        field: 'CusEmail',
      },
      {
        headerName: 'SĐT',
        field: 'CusTel',
      },
      {
        headerName: 'Địa chỉ',
        field: 'CusAdd',
      },
      {
        headerName: 'Loại KH',
        valueGetter: (param) =>  this.cusType(param.data.CusShoeBuyPrice)
      },
      {
        headerName: 'Điểm tích luỹ',
        field: 'CusShoeBuyPrice',
        valueGetter: (param) => ceil(param.data.CusShoeBuyPrice/1000)
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
  }

  onSearch(paginationParams: PaginationParamsModel) {
    this.selectedData = undefined;
    this.paginationParams = paginationParams;
    var cus = new GetCusInputDto();
    cus.CusName = this.cusName ?? '';
    cus.CusTel = this.cusTel ?? '';
    this._customerService.getCustomers(cus).subscribe((res) => {
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
    if (selectedData) this.selectedData = Object.assign({},selectedData[0]);
  }

  exportExcel() {
    this.params.api.exportDataAsCsv();
  }

   deleteShoe() {
    alertify.confirm('Bạn có chắc chắn muốn xoá không ?', (confirmed) => {
      if(confirmed)
      this._customerService
      .deleteCustomer(this.selectedData)
      .subscribe(
        (res) => {
          alertify.success('Xóa KH thành công');
          this.callBackEvent(this.params);
        },
        (err) => console.log(err)
      );
    });
    
  }
}
