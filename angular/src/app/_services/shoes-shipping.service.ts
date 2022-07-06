import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SaveShippingShoeDto } from '../_models/shoe-shipping/SaveShippingShoeDto';
import { GetShoeShippingInputDto } from '../_models/shoe-shipping/GetShoeShippingInputDto';
import { ReportInput } from '../_models/shoe-report/ReportInput';

@Injectable({
  providedIn: 'root'
})
export class ShoesShippingService {
  readonly APIUrl = 'http://localhost:60276';

  constructor(private http: HttpClient) { }

  getShoesShipping(val: GetShoeShippingInputDto): Observable<any[]> {
    return this.http.post<any>(this.APIUrl + '/ship-info', val);
  }

  shippingShoes(val: SaveShippingShoeDto){
    return this.http.post(this.APIUrl + '/save-shipping', val);
  }

  getReportProfits(val: ReportInput): Observable<any[]> {
    return this.http.post<any>(this.APIUrl + '/get-profits', val);
  }

  getReportTopShoeSale(val: ReportInput): Observable<any[]> {
    return this.http.post<any>(this.APIUrl + '/top-sale', val);
  }

}
