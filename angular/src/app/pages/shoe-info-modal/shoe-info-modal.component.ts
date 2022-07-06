import { ceil } from 'lodash';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { PaginationParamsModel } from 'src/app/_components/shared/common/models/base.model';
import { GetShoeInfoInput } from 'src/app/_models/shoe-info/GetShoeInfoInput';
import { ShoesService } from 'src/app/_services/shoes.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-shoe-info-modal',
  templateUrl: './shoe-info-modal.component.html',
  styleUrls: ['./shoe-info-modal.component.scss']
})
export class ShoeInfoModalComponent implements OnInit {
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

  code: string;

  constructor(
    private _shoesService: ShoesService) {
    this.columnsDef = [
      {
        headerName: 'STT',
        field: 'stt',
        cellRenderer: (params) => (this.paginationParams.pageNum - 1) * this.paginationParams.pageSize + params.rowIndex + 1,
        flex: 0.3
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
        headerName: 'Đơn giá',
        field: 'RealPrice',
      },
      {
        headerName: 'ĐVT',
        valueGetter: () => "Đôi",
      },
      {
        headerName: 'Thuế',
        valueGetter: () => "10%",
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
    var shoes = new GetShoeInfoInput();
    shoes.ShoeName =  '';
    shoes.ShoeCode = this.code ?? '';
    shoes.ShoeSize =  -1;
    shoes.Gender =  -1;
    shoes.Color = 'Tất cả';
    shoes.ShoeType = -1;
    shoes.IsDeleted = 0;
    this._shoesService.getShoesInfo(shoes).subscribe((res) => {
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

  close() {
    this.modal.hide();
  }

   show( event?) {
    this.selectedData = undefined;
    this.code = event;
    this.onGridReady(this.paginationParams);
    this.modal.show();
  }

  save(){
    this.modalSave.emit(this.selectedData);
    this.close();
  }
  
}
