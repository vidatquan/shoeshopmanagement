import { HistoryShoeSaleComponent } from './pages/history-shoe-sale/history-shoe-sale.component';
import { ShoeSaleComponent } from './pages/shoe-sale/shoe-sale.component';
import { CreateShoeOrderComponent } from './pages/create-shoe-order/create-shoe-order.component';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './_components/login/login.component';
import { AuthGuard } from './_guards/auth.guard';
import { EmployeeComponent } from './pages/employee/employee/employee.component';

import { HomeComponent } from './_components/home/home.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { LogInfoComponent } from './pages/log-info/log-info.component';
import { ShoeOrderComponent } from './pages/shoe-order/shoe-order.component';
import { ShoeInfoComponent } from './pages/shoe-info/shoe-info.component';
import { ShoeReceiveComponent } from './pages/shoe-receive/shoe-receive.component';
import { HistoryReceiveShoeComponent } from './pages/history-receive-shoe/history-receive-shoe.component';
import { TopShoeSaleComponent } from './pages/top-shoe-sale/top-shoe-sale.component';

const appRoutes: Routes = [
  { path: 'log-info', component: LogInfoComponent, canActivate: [AuthGuard] ,data: { state: 'log-info' } },
  { path: 'employee', component: EmployeeComponent, canActivate: [AuthGuard] ,data: { state: 'employee' } },
  { path: 'customer', component: CustomerComponent, canActivate: [AuthGuard] ,data: { state: 'customer' } },
  { path: 'shoe-info', component: ShoeInfoComponent, canActivate: [AuthGuard] ,data: { state: 'shoe-info' } },
  { path: 'shoe-order', component: ShoeOrderComponent, canActivate: [AuthGuard] ,data: { state: 'shoe-order' } },
  { path: 'create-shoe-order', component: CreateShoeOrderComponent, canActivate: [AuthGuard] ,data: { state: 'create-shoe-order' } },
  { path: 'shoe-receive', component: ShoeReceiveComponent, canActivate: [AuthGuard] ,data: { state: 'shoe-receive' } },
  { path: 'history-receive-shoe', component: HistoryReceiveShoeComponent, canActivate: [AuthGuard] ,data: { state: 'history-receive-shoe' } },
  { path: 'shoe-sale', component: ShoeSaleComponent, canActivate: [AuthGuard] ,data: { state: 'shoe-sale' } },
  { path: 'history-shoe-sale', component: HistoryShoeSaleComponent, canActivate: [AuthGuard] ,data: { state: 'history-shoe-sale' } },
  { path: 'top-shoe-sale', component: TopShoeSaleComponent, canActivate: [AuthGuard] ,data: { state: 'top-shoe-sale' } },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

export const routing = RouterModule.forRoot(appRoutes);
