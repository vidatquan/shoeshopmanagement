import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Customer } from 'src/app/_models/customer';
import { GetCusInputDto } from 'src/app/_models/get-cus-input-dto';
import { CustomerService } from 'src/app/_services/customer.service';
declare let alertify: any;

@Component({
  selector: 'app-create-or-edit-customer',
  templateUrl: './create-or-edit-customer.component.html',
  styleUrls: ['./create-or-edit-customer.component.scss']
})
export class CreateOrEditCustomerComponent implements OnInit {
  @ViewChild('modal') public modal: ModalDirective;
  @Output('modalSave') modalSave = new EventEmitter();
  @Input() areaList = [];
  cus: Customer = new Customer();
  CusName;
  CusTel;
  CusAdd;
  CusEmail;
  action:number;
  cusList = [];
  cusShoeBuyPrice:number;
  constructor(private _customerService: CustomerService) { }

  ngOnInit() {
    var cus = new GetCusInputDto();
    cus.CusName = '';
    cus.CusTel = '';
    this._customerService.getCustomers(cus).subscribe((res) => {
      this.cusList = res;
    });
  }

  close() {
    this.modal.hide();
  }

  show(action, event?) {
    this.action = action;
    this.cusShoeBuyPrice = 0;
    this.cus = new Customer();
    if (event?.Id != undefined) {
      this.cus = event;
      this.cusShoeBuyPrice = this.cus.CusShoeBuyPrice / 1000;
    };
    this.modal.show();
  }

  save() {
    if (!this.checkValidate()) return;
    if(this.action == 2){
      this._customerService.registerCustomer(this.cus).subscribe(res => {
        alertify.success('Thêm mới thành công');
        this.modalSave.emit(null);
        this.modal.hide();
      });
    }
    else if (this.action == 3){
      this.cus.CusShoeBuyPrice = this.cusShoeBuyPrice * 1000;
      this._customerService.updateCustomer(this.cus).subscribe(res => {
        alertify.success('Cập nhật thành công');
        this.modalSave.emit(null);
        this.modal.hide();
      });
    }
  }

  checkValidate() {
    if (!this.cus?.CusName || this.cus?.CusName === '') {
      alertify.error('Tên khách hàng không được trống');
      return false;
    }
    if (!this.cus?.CusTel || this.cus?.CusTel === '') {
      alertify.error('Số điện thoại khách hàng không được trống');
      return false;
    }
    if(!this.phoneNumberValidate(this.cus?.CusTel)) {
      alertify.error('Số điện thoại khách hàng không hợp lệ');
      return false;
    }
    if(this.cusList.some(e => e.CusTel == this.cus?.CusTel && e.Id != this.cus.Id)){
      alertify.error('Số điện thoại khách hàng đã tồn tại');
      return false;
    }
    if (this.cus?.CusEmail && !this.emailValidate(this.cus?.CusEmail)) {
      alertify.error('Email không hợp lệ');
      return false;
    }
    if(this.cusList.some(e => e.CusTel == this.cus?.CusTel && e.Id != this.cus.Id)){
      alertify.error('Số điện thoại khách hàng đã tồn tại');
      return false;
    }
    return true;
  }
  // Số điện thoại
  phoneNumberValidate(phoneNumber: string) {
    const PHONE_NUMBER_REGEX = /(0|[+]([0-9]{2})){1}[ ]?[0-9]{2}([-. ]?[0-9]){7}|((([0-9]{3}[- ]){2}[0-9]{4})|((0|[+][0-9]{2}[- ]?)(3|7|8|9|1)([0-9]{8}))|(^[\+]?[(][\+]??[0-9]{2}[)]?([- ]?[0-9]{2}){2}([- ]?[0-9]{3}){2}))$/gm;
    return !phoneNumber || PHONE_NUMBER_REGEX.test(phoneNumber);
  }
  
  emailValidate(email: string) {
    const NUMBER_REG = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return NUMBER_REG.test(email);
  }
}
