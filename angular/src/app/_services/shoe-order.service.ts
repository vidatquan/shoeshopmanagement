import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CancelShoeOrderInput } from '../_models/shoe-order/CancelShoeOrderInput';
import { DataOrder } from '../_models/shoe-order/dataOrder';
import { GetShoeOrdersInput } from '../_models/shoe-order/GetShoeOrdersInput';

@Injectable({
  providedIn: 'root'
})
export class ShoesOrderService {
  readonly APIUrl = 'http://localhost:60276';

  constructor(private http: HttpClient) { }

  getShoesOrder(val: GetShoeOrdersInput): Observable<any[]> {
    return this.http.post<any>(this.APIUrl + '/get-order', val);
  }

  getShoesOrderDetail(val: any): Observable<any[]> {
    return this.http.post<any>(this.APIUrl + '/order-detail', val);
  }

  orderShoes(val: DataOrder){
    return this.http.post(this.APIUrl + '/save-order', val);
  }

  cancelShoeOrder(val: CancelShoeOrderInput){
    return this.http.post(this.APIUrl + '/cancel-order', val);
  }

}
