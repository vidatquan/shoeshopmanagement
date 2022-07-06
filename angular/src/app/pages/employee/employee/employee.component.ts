import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginationParamsModel } from 'src/app/_components/shared/common/models/base.model';
import { UserService } from 'src/app/_services/user.service';
import { ceil } from 'lodash';
import { CreateOrEditEmployeeComponent } from './create-or-edit-employee/create-or-edit-employee.component';
import { GetEmployeeInput } from 'src/app/_models/employee/GetEmployeeInput';
declare let alertify: any;
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  @ViewChild('createOrEditEmployee', { static: true }) createOrEditEmployee: CreateOrEditEmployeeComponent;
  paginationParams: PaginationParamsModel;

  columnsDef;
  defaultColDef;
  rowData = [];
  pagedRowData = [];
  params: any;
  user;
  selectedData;
  fullName: string;
  email: string;
  tel: string;
  code: string;
  cmnd: string;
  type = "";
  statusList = [
    {value: -1 , label : "Tất cả"},
    {value: 0 , label : "Hoạt động"},
    {value: 1 , label : "Nghỉ việc"},
  ]
  isDeleted = -1;

  constructor(private _employeeService: UserService) {
    this.columnsDef = [
      {
        headerName: 'STT',
        field: 'stt',
        cellRenderer: (params) =>
          (this.paginationParams.pageNum - 1) * this.paginationParams.pageSize +
          params.rowIndex +
          1,
      },
      {
        headerName: 'Mã nhân viên',
        field: 'EmpCode',
      },
      {
        headerName: 'Tên nhân viên',
        field: 'FullName',
      },
      {
        headerName: 'Số chứng minh thư',
        field: 'Cmnd',
      },
      {
        headerName: 'Địa chỉ',
        field: 'Address',
      },
      {
        headerName: 'SĐT',
        field: 'Tel',
      },
      {
        headerName: 'Email',
        field: 'Email',
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
  }

  onSearch(paginationParams: PaginationParamsModel) {
    this.selectedData = undefined;
    this.paginationParams = paginationParams;
    var employee = new GetEmployeeInput();
    employee.FullName = this.fullName ?? '';
    employee.Tel = this.tel ?? '';
    employee.Code = this.code ?? '';
    employee.IsDeleted = this.isDeleted ?? -1;

    this._employeeService.getEmployees(employee).subscribe((res) => {
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

  // delete() {
  //   this._employeeService
  //     .deleteEmployee(this.selectedData)
  //     .subscribe(
  //       (res) => {
  //         alertify.success('Xóa shipper thành công');
  //         this.callBackEvent(this.params);
  //       },
  //       (err) => console.log(err)
  //     );
  // }
  
  exportExcel(){
    this.params.api.exportDataAsCsv();
  }
}
