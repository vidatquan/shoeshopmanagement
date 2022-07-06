import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Employee } from '../../_models/employee';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  templateUrl: 'home.component.html' ,
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: Employee;
    currentUserSubscription: Subscription;
    users: Employee[] = [];

    constructor(
        private authenticationService: AuthenticationService,
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.currentUserSubscription.unsubscribe();
    }
}
