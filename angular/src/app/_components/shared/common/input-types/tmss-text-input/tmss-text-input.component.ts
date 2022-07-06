import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';

@Component({
  selector: 'tmss-text-input',
  templateUrl: './tmss-text-input.component.html',
  styleUrls: ['./tmss-text-input.component.less'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TmssTextInputComponent),
    multi: true
  }]
})
export class TmssTextInputComponent implements ControlValueAccessor {
  @Input() value;
  @Input() className: string;
  @Input() addOnMinWidth: string;
  @Input() text: string;
  @Input() isRequired: boolean;
  @Input() placeholder: string;
  @Input() disable;
  @Input() hideInput;
  @Input() showSearch;
  @Input() rows;
  @Input() showModal: boolean;
  @Input() maxLength;
  @Input() isReadonly: boolean;
  @Input() isDisabled: boolean;
  @Input() showCaret: boolean = false;
  @Input() showTrash: boolean = false;
  @Input() showUpload: boolean = false;
  @Input() type: string = 'text';
  @Output() onSearch = new EventEmitter();
  @Output() onChoose = new EventEmitter();
  @Output() onRefresh = new EventEmitter();
  @Output() onClickInput = new EventEmitter();
  @Output() onChangeValue = new EventEmitter();

  model;
  private onChange: Function;

  constructor() {
  }

  changeValue(e) {
    if (!isNaN(e.target.value) && this.type === 'number') {
      this.model = Number(e.target.value);
    }

    if (e.target.value === '') {
      this.model = '';
    } else {
      this.model = e.target.value;
    }

    if (typeof this.onChange === 'function') {
      this.onChange(e.target.value);
    }
  }

  onValueChange(value) {
    this.onChangeValue.emit(value);
  }

  writeValue(val: any) {
    this.model = val ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  search() {
    this.onSearch.emit(this.model);
  }

  enter(e: any) {
    if (e.key === 'Enter') {
      this.search();
    }

    this.value = e.target.value;
    if (typeof this.onChange === 'function') {
      this.onChange(this.value);
    }

    this.onChangeValue.emit(this.value);
  }


  onClickInputValue(val) {
    this.onClickInput.emit(val);
  }

  refresh() {
    this.onRefresh.emit();
  }

  chooseFile() {
    this.onChoose.emit();
  }
}
