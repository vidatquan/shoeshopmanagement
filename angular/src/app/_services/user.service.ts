import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Employee } from '../_models/employee';
import { GetEmployeeInput } from '../_models/employee/GetEmployeeInput';

@Injectable({ providedIn: 'root' })
export class UserService {
  readonly APIUrl = 'http://localhost:60276';

  constructor(private http: HttpClient) {}

  getEmployees(val: GetEmployeeInput): Observable<any[]> {
    return this.http.post<any>(this.APIUrl + '/employees', val);
  }

  registerEmployee(val: Employee) {
    return this.http.post(this.APIUrl + '/auth/register', val);
  }

  updateEmployee(val: Employee) {
    return this.http.post(this.APIUrl + '/update-employee', val);
  }

  deleteEmployee(val: Employee): Observable<any[]> {
    return this.http.post<any>(this.APIUrl + '/delete-employee', val);
  }
}
