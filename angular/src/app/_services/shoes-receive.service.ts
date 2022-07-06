import { SaveReceiveShoeDto } from 'src/app/_models/shoe-receive/SaveReceiveShoeDto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetShoeReceiveDetailInput } from '../_models/shoe-receive/GetShoeReceiveDetailInput';
import { GetShoeReceiveInput } from '../_models/shoe-receive/GetShoeReceiveInput';

@Injectable({
  providedIn: 'root'
})
export class ShoesReceiveService {
  readonly APIUrl = 'http://localhost:60276';

  constructor(private http: HttpClient) { }

  getShoesReceive(val: GetShoeReceiveInput): Observable<any[]> {
    return this.http.post<any>(this.APIUrl + '/get-receive', val);
  }

  getShoesReceiveDetail(val: GetShoeReceiveDetailInput): Observable<any[]> {
    return this.http.post<any>(this.APIUrl + '/receive-detail', val);
  }

  receiveShoes(val: SaveReceiveShoeDto){
    return this.http.post(this.APIUrl + '/save-receive', val);
  }

}
