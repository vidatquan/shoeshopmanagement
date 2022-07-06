import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetShoeInfoInput } from '../_models/shoe-info/GetShoeInfoInput';
import { HistoryShoePrice } from '../_models/shoe-info/HistoryShoePrice';
import { Shoes } from '../_models/shoe-info/shoes';
import { GetShoeReceiveDetailInput } from '../_models/shoe-receive/GetShoeReceiveDetailInput';

@Injectable({
  providedIn: 'root'
})
export class ShoesService {
  readonly APIUrl = 'http://localhost:60276';

  constructor(private http: HttpClient) { }

  getShoesInfo(val: GetShoeInfoInput): Observable<any[]> {
    return this.http.post<any>(this.APIUrl + '/shoes', val);
  }

  createShoesInfo(val: Shoes) {
    return this.http.post(this.APIUrl + '/create-shoes', val);
  }

  updateShoesInfo(val: Shoes) {
    return this.http.post(this.APIUrl + '/update-shoes', val);
  }

  deleteShoesInfo(val: Shoes): Observable<any[]> {
    return this.http.post<any>(this.APIUrl + '/delete-shoes', val);
  }

  getHistoryShoePrice(val: GetShoeReceiveDetailInput): Observable<any[]> {
    return this.http.post<any>(this.APIUrl + '/get-log', val);
  }

  createHistoryShoePrice(val: HistoryShoePrice) {
    return this.http.post(this.APIUrl + '/create-log', val);
  }
}
