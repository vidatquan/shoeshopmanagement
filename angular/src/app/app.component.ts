import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PaginationParamsModel } from './_components/shared/common/models/base.model';
import { Employee } from './_models/employee';
import { AuthenticationService } from './_services/authentication.service';
import { ceil } from 'lodash';
import { animate, query, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  
})
export class AppComponent {
  checkMenu: boolean = true;


  columnDefs;
  rowData;
  currentUser: Employee;
  defaultColDef;
  paginationParams: PaginationParamsModel;
  params: any;
  pagedRowData: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.columnDefs = [
      { field: 'make' },
      { field: 'model' },
      { field: 'price' },
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

    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );
  }

  changeMenu(event) {
    this.checkMenu = event;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.paginationParams = { pageNum: 1, pageSize: 10, totalCount: 0 };
  }

  callBackEvent(event) {
    this.params = event;
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
    this.paginationParams.pageNum = 1;
  }

  changePaginationParams(paginationParams: PaginationParamsModel) {
    this.paginationParams = paginationParams;
    this.paginationParams.skipCount =
      (paginationParams.pageNum - 1) * paginationParams.pageSize;
    this.paginationParams.pageSize = paginationParams.pageSize;

    this.pagedRowData = this.rowData
      ? this.rowData.slice(
          this.paginationParams.skipCount,
          this.paginationParams.pageNum * this.paginationParams.pageSize
        )
      : [];
    this.params.api.setRowData(this.pagedRowData);
  }

  
}
