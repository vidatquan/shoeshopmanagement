import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, Input, forwardRef, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'tmss-combobox',
    templateUrl: './tmss-combobox.component.html',
    styleUrls: ['./tmss-combobox.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TmssComboboxComponent),
            multi: true,
        },
    ],
})
export class TmssComboboxComponent implements ControlValueAccessor {
    @Input() className: string;
    @Input() value;
    @Input() items: Array<any>;
    @Input() text: string;
    @Input() isRequired;
    @Input() isDisabled;
    //@Input() isTypeNumber;
    @Input() label: string = 'label';
    @Input() key: string = 'value';
    @Input() type: string = 'text';

    @Output() onChangeValue = new EventEmitter();

    private onChange: Function;

    constructor() { }

    writeValue(val: any): void {
        this.value = val ?? '';
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void { }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    changeValue(e) {
        if (!isNaN(e.target.value) && this.type === 'number') {
            this.value = Number(e.target.value);
            if (typeof this.onChange === 'function') {
                this.onChange(Number(e.target.value));
            }
        } else {
            this.value = e.target.value;
            if (typeof this.onChange == 'function') {
                this.onChange(e.target.value);
            }
        }

        this.onChangeValue.emit(e.target.value);
    }
}
