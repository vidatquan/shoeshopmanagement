import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../_services/authentication.service';
import { UserService } from '../../_services/user.service';
import { AlertService } from '../../_services/alert.service';
import { Employee } from 'src/app/_models/employee';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
  loading = false;
  submitted = false;
  employee: Employee = new Employee();

  items = [
    { label: 'Nam', value: 1 },
    { label: 'Nu', value: 0 },
  ];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    // if (this.authenticationService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }
  }

  ngOnInit() {}

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.userService
      .registerEmployee(this.employee)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/login']);
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
