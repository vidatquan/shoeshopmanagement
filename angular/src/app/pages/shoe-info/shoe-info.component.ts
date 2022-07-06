import { GetShoeReceiveDetailInput } from 'src/app/_models/shoe-receive/GetShoeReceiveDetailInput';
import { DataFormatService } from './../../_services/data-format.service';
import { ShoesService } from './../../_services/shoes.service';
import { ceil } from 'lodash';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginationParamsModel } from 'src/app/_components/shared/common/models/base.model';
import { UserService } from 'src/app/_services/user.service';
import { GetShoeInfoInput } from 'src/app/_models/shoe-info/GetShoeInfoInput';
declare let alertify: any;
@Component({
  selector: 'app-shoe-info',
  templateUrl: './shoe-info.component.html',
  styleUrls: ['./shoe-info.component.scss']
})
export class ShoeInfoComponent implements OnInit {
  paginationParams: PaginationParamsModel;

  columnsDef;
  historyColumnsDef;
  defaultColDef;
  rowData = [];
  pagedRowData = [];
  params: any;
  hisParams:any;
  hisData = [];
  user;
  selectedData;

  fullName: string;
  code: string;
  
  type = -1;
  gender = -1;
  size = -1;
  color = "Tất cả";
  status = -1;
  colorList: any[] = [
    { label: "Tất cả", value: "Tất cả" },
    { label: "Đen", value: "Đen" },
    { label: "Đỏ", value: "Đỏ" },
    { label: "Xám", value: "Xám" },
    { label: "Hồng", value: "Hồng" },
    { label: "Trắng", value: "Trắng" },
    { label: "Xanh da trời", value: "Xanh da trời" },
    { label: "Xanh rêu", value: "Xanh rêu" },
    { label: "Phối màu", value: "Phối màu" },
  ];
  
  statusList: any[] = [
    { label: "Tất cả", value: -1 },
    { label: "Hoạt động", value: 0 },
    { label: "Không hoạt động", value: 1 },
  ];

  genderList: any[] = [
    { label: "Tất cả", value: -1 },
    { label: "Nam", value: 0 },
    { label: "Nữ", value: 1 },
    { label: "Unisex", value: 2 },
    { label: "Trẻ em", value: 3 },
  ];

  typeList: any[] = [
    { label: "Tất cả", value: -1 },
    { label: "UltraBoost", value: 0 },
    { label: "Yeezy", value: 1 },
    { label: "StanSmith", value: 2 },
    { label: "NMD", value: 3 },
    { label: "Alphabounce", value: 4 },
    { label: "EQT", value: 5 },
    { label: "PulseBoost", value: 6 },
    { label: "SuperStar", value: 7 }
  ];
  sizeList: any[] = [
    { label: "Tất cả", value: -1 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },
    { label: "8", value: 8 },
    { label: "9", value: 9 },
    { label: "10", value: 10 },
    { label: "11", value: 11 },
    { label: "24", value: 24 },
    { label: "28", value: 28 },
    { label: "30", value: 30 },
    { label: "36", value: 36 },
    { label: "36 1/2", value: 3612 },
    { label: "37", value: 37 },
    { label: "37 1/2", value: 3712 },
    { label: "38", value: 38 },
    { label: "38 1/2", value: 3812 },
    { label: "39", value: 39 },
    { label: "39 1/2", value: 3912 },
    { label: "40", value: 40 },
    { label: "40 1/2", value: 4012 },
    { label: "41", value: 41 },
    { label: "41 1/2", value: 4112 },
    { label: "42", value: 41 },
    { label: "42 1/2", value: 4212 },
    { label: "43", value: 41 },
    { label: "43 1/2", value: 4312 },
  ];

  constructor(
    private _dataFormatService: DataFormatService,
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
        headerName: 'Số lượng',
        field: 'ShoeQty',
        cellStyle: (params) => {  if(params.data.ShoeQty == 0) return { color: 'white', backgroundColor: '#FF0033' }; }
      },
    ];
    this.historyColumnsDef = [
      {
        headerName: 'STT',
        field: 'stt',
        cellRenderer: (params) => (this.paginationParams.pageNum - 1) * this.paginationParams.pageSize + params.rowIndex + 1,
        flex: 0.3
      },
      {
        headerName: 'Giá nhập',
        field: 'RealPrice',
      },
      {
        headerName: 'ĐVT',
        valueGetter:() => "Đôi"
      },
      {
        headerName: 'Giá bán',
        field: 'SellPrice',
      },
      {
        headerName: 'ĐVT',
        valueGetter:() => "Đôi"
      },
      {
        headerName: 'Áp dụng',
        valueFormatter: (param) => this._dataFormatService.dateFormat(param.data.ApplyDate)
      },
      {
        headerName: 'Hết hạn',
        valueFormatter: (param) => this._dataFormatService.dateFormat(param.data.ExpiryDate)
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
    //this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  onSearch(paginationParams: PaginationParamsModel) {
    this.selectedData = undefined;
    this.hisData = [];

    if (!Number(this.size)) return alertify.warning("Size không hợp lệ!");
    this.paginationParams = paginationParams;
    var shoes = new GetShoeInfoInput();
    shoes.ShoeName = this.fullName ?? '';
    shoes.ShoeCode = this.code ?? '';
    shoes.ShoeSize = this.size ?? -1;
    shoes.Gender = this.gender ?? -1;
    shoes.Color = this.color ?? 'Tất cả';
    shoes.ShoeType = this.type ?? -1;
    shoes.IsDeleted = this.status ?? -1;
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
    this.getLog();
  }

  callBackHistoryShoePriceEvent(event) {
    this.hisParams = event;
  }

  exportExcel() {
    this.params.api.exportDataAsCsv();
  }

  getLog(){
    var body = new GetShoeReceiveDetailInput();
    body.Id = this.selectedData.Id;
    this._shoesService.getHistoryShoePrice(body).subscribe((res) => {this.hisData = res; });
  }
}


