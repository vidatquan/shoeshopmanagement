import { ModalModule } from 'ngx-bootstrap/modal';
import { AppBsModalModule } from './_components/shared/common/appBsModal/app-bs-modal.module';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { routing } from './routes';
import { HomeComponent } from './_components/home/home.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { LoginComponent } from './_components/login/login.component';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { RegisterComponent } from './_components/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TmssDatepickerComponent } from './_components/shared/common/input-types/tmss-datepicker/tmss-datepicker.component';
import { NavbarComponent } from './_components/shared/common/navbar/navbar.component';
import { TmssComboboxComponent } from './_components/shared/common/input-types/tmss-combobox/tmss-combobox.component';
import { TmssTextInputComponent } from './_components/shared/common/input-types/tmss-text-input/tmss-text-input.component';
import { GridTableComponent } from './_components/shared/common/grid/grid-table/grid-table.component';
import { GridPaginationComponent } from './_components/shared/common/grid/grid-pagination/grid-pagination.component';
import { AgCellButtonRendererComponent } from './_components/ag-cell-button-renderer/ag-cell-button-renderer.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { EmployeeComponent } from './pages/employee/employee/employee.component';
import { CreateOrEditEmployeeComponent } from './pages/employee/employee/create-or-edit-employee/create-or-edit-employee.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { CreateOrEditCustomerComponent } from './pages/customer/create-or-edit-customer/create-or-edit-customer.component';
import { LogInfoComponent } from './pages/log-info/log-info.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DataFormatService } from './_services/data-format.service';
import { ShoeOrderComponent } from './pages/shoe-order/shoe-order.component';
import { CreateShoeOrderComponent } from './pages/create-shoe-order/create-shoe-order.component';
import { ShoeInfoComponent } from './pages/shoe-info/shoe-info.component';
import { CreateOrEditShoeInfoComponent } from './pages/shoe-info/create-or-edit-shoe-info/create-or-edit-shoe-info.component';
import { ShoeReceiveComponent } from './pages/shoe-receive/shoe-receive.component';
import { HistoryReceiveShoeComponent } from './pages/history-receive-shoe/history-receive-shoe.component';
import { ShoeReceiveModalComponent } from './pages/shoe-receive/shoe-receive-modal/shoe-receive-modal.component';
import { ShoeInfoModalComponent } from './pages/shoe-info-modal/shoe-info-modal.component';
import { ShoeSaleComponent } from './pages/shoe-sale/shoe-sale.component';
import { CreateOrEditShoeSaleComponent } from './pages/shoe-sale/create-or-edit-shoe-sale/create-or-edit-shoe-sale.component';
import { HistoryShoeSaleComponent } from './pages/history-shoe-sale/history-shoe-sale.component';
import { CustomerInfoModalComponent } from './pages/customer-info-modal/customer-info-modal.component';
import { TopShoeSaleComponent } from './pages/top-shoe-sale/top-shoe-sale.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    TmssDatepickerComponent,
    NavbarComponent,
    TmssComboboxComponent,
    TmssTextInputComponent,
    GridTableComponent,
    GridPaginationComponent,
    AgCellButtonRendererComponent,
    EmployeeComponent,
    CustomerComponent,
    CreateOrEditCustomerComponent,
    CreateOrEditEmployeeComponent,
    LogInfoComponent,
    ShoeOrderComponent,
    CreateShoeOrderComponent,
    ShoeInfoComponent,
    CreateOrEditShoeInfoComponent,
    ShoeReceiveComponent,
    HistoryReceiveShoeComponent,
    ShoeReceiveModalComponent,
    ShoeInfoModalComponent,
    ShoeSaleComponent,
    CreateOrEditShoeSaleComponent,
    HistoryShoeSaleComponent,
    CustomerInfoModalComponent,
    TopShoeSaleComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([]),
    routing,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    AppBsModalModule,
    ModalModule.forRoot(),
    NgxSpinnerModule,
    TabsModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
