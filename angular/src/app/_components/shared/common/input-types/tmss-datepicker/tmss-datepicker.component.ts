import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import {
  Component,
  forwardRef,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'tmss-datepicker',
  templateUrl: './tmss-datepicker.component.html',
  styleUrls: ['./tmss-datepicker.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TmssDatepickerComponent),
      multi: true,
    },
  ],
})
export class TmssDatepickerComponent implements ControlValueAccessor, OnInit {
  @ViewChild('datepicker', { static: false }) datepicker: BsDatepickerDirective;
  @Input() defaultValue;
  @Input() className: string;
  @Input() addOnMinWidth: string;
  @Input() text: string;
  @Input() isRequired: boolean;
  @Input() placement: string;
  @Input() disable;
  @Input() ignoredCalender;
  @Input() minDate;
  @Input() maxDate;
  @Input() typeMonth;
  @Input() showMonth: boolean;
  @Input() showDeleteBtn: boolean;
  @Input() dateInputFormat: string = 'DD/MM/YYYY';
  private onChange: Function;
  @Input() isDisabled: boolean;
  @Input() value;

  hour = new Date().getHours();
  minute = new Date().getMinutes();

  constructor(private _eref: ElementRef) {}

  ngOnInit() {}

  openDatepicker() {
    this.datepicker.toggle();
  }

  onValueChange(val?) {
    if (val && val != null) {
      this.value = val;
      if (typeof this.onChange === 'function') {
        this.onChange(this.value);
      }
    }
  }

  writeValue(val) {
    this.value = val ?? this.defaultValue;
    if (!val && !this.defaultValue)
      return this.datepicker?.bsValueChange.emit(null);
    if (this.value instanceof Date)
      this.datepicker?.bsValueChange.emit(this.value);
    this.datepicker?.bsValueChange.emit(val);
    this.value = moment(val).toDate();
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {}

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled || false;
  }

  onOpenCalendar(container) {
    if (!this.typeMonth) {
      return;
    }
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
}
