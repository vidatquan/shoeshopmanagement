import { finalize } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginationParamsModel } from 'src/app/_components/shared/common/models/base.model';
import { UserService } from 'src/app/_services/user.service';
import { ceil } from 'lodash';
import * as moment from 'moment';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { eventNames } from 'process';
import { GetEmployeeInput } from 'src/app/_models/employee/GetEmployeeInput';
import { Employee } from 'src/app/_models/employee';
import { CreateOrEditEmployeeComponent } from '../employee/employee/create-or-edit-employee/create-or-edit-employee.component';
declare let alertify: any;
@Component({
  selector: 'app-log-info',
  templateUrl: './log-info.component.html',
  styleUrls: ['./log-info.component.scss'],
})
export class LogInfoComponent implements OnInit {
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
  registerNo  : string;
  cmnd: string;
  areaList: any[]=[];
  areaId : number = 0;
  employee:any;
  url:any;

  EmpName;
  Username;
  EmpType;
  BirthDay;
  Password;
  constructor(private _employeeService: UserService,private authenticationService: AuthenticationService) {


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
    // this.authenticationService.currentUser
    // .subscribe(
    //   (x) => {
    //     this.employee = x;
    //     console.log(x)
    //     if (!this.employee.ImageString || this.employee.ImageString== "" )
    //       this.url = "assets/img/userIcon.jpg"
    //     else
    //       this.url = 'data:image/jpeg;base64,' + this.employee.ImageString;
    //   }
    // );
  }

  ngOnInit() {
    this.paginationParams = { pageNum: 1, pageSize: 10, totalCount: 0 };
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.getAllEmployeeList();
  }

  getAllEmployeeList() {
    this.employee = new Employee();
    var employee = new GetEmployeeInput();
    employee.FullName =  '';
    employee.Tel = '';
    employee.Code = this.user.EmpCode;
    employee.IsDeleted = -1;

    this._employeeService.getEmployees(employee).pipe(finalize(() => {
      this.createOrEditEmployee.show(3,this.employee);
    })).subscribe((res) => {
      this.employee = res[0];
    });
  }

}
