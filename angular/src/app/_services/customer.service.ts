import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetCusInputDto } from '../_models/get-cus-input-dto';
import { Customer } from '../_models/customer';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  readonly APIUrl = 'http://localhost:60276';

  constructor(private http: HttpClient) {}

  getCustomers(val: GetCusInputDto): Observable<any[]> {
    return this.http.post<any>(this.APIUrl + '/customer', val);
  }

  updateCustomer(val: Customer) {
    return this.http.post(this.APIUrl + '/update-customer', val);
  }

  deleteCustomer(val: Customer): Observable<any[]> {
    return this.http.post<any>(this.APIUrl + '/delete-customer', val);
  }

  registerCustomer(val: Customer) {
    return this.http.post(this.APIUrl + '/add-customer', val);
  }
}
