import { ceil } from 'lodash';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { PaginationParamsModel } from 'src/app/_components/shared/common/models/base.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CustomerService } from 'src/app/_services/customer.service';
import { GetCusInputDto } from 'src/app/_models/get-cus-input-dto';

@Component({
  selector: 'customer-info-modal',
  templateUrl: './customer-info-modal.component.html',
  styleUrls: ['./customer-info-modal.component.scss']
})
export class CustomerInfoModalComponent implements OnInit {
  @ViewChild('modal') public modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  paginationParams: PaginationParamsModel;

  columnsDef;
  defaultColDef;
  rowData = [];
  pagedRowData = [];
  params: any;
  user;
  selectedData;

  cusTel: string;

  constructor(
    private _customerService: CustomerService) {
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
    cus.CusName = '';
    cus.CusTel =  this.cusTel ?? '';
    this._customerService.getCustomers(cus).subscribe((res) => {
      this.rowData = res;
      this.pagedRowData =
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

  close() {
    this.modal.hide();
    this.modalSave.emit(this.selectedData);
  }

   show( event?) {
    this.selectedData = undefined;
    this.cusTel = event;
    this.onGridReady(this.paginationParams);
    this.modal.show();
  }

  save(){
    this.modalSave.emit(this.selectedData);
    this.close();
  }
  
}
