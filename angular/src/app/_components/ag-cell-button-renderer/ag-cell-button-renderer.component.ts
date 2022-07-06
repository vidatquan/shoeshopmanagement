import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'ag-cell-button-renderer',
  templateUrl: './ag-cell-button-renderer.component.html',
  styleUrls: ['./ag-cell-button-renderer.component.less']
})
export class AgCellButtonRendererComponent implements ICellRendererAngularComp {

    public params: any;
    field: string;
    buttonDef: {
      text: string | Function, // Button display text
      iconName: string, // 'fa fa-pencil'
      // tslint:disable-next-line:ban-types
      className: string,
      disabled: boolean | Function, // true => disable button, false => enable button
      message: string,
      // tslint:disable-next-line:ban-types
      function: Function,
    };

    buttonDefTwo: {
      text: string | Function, // Button display text
      iconName: string, // 'fa fa-pencil'
      // tslint:disable-next-line:ban-types
      className: string,
      disabled: boolean | Function, // true => disable button, false => enable button
      message: string,
      // tslint:disable-next-line:ban-types
      function: Function,
    };

    constructor(
    ) {
    }

    agInit(params) {
      this.params = params;
      this.field = this.params.colDef.field;
      this.buttonDef = this.params.colDef.buttonDef;
      this.buttonDefTwo = this.params.colDef.buttonDefTwo;
    }

    get displayText() {
      if (typeof this.buttonDef.text === 'function') {
        return this.buttonDef.text(this.params);
      }
      return this.buttonDef.text
    }

    get displayTextSecondButton() {
      if (typeof this.buttonDefTwo.text === 'function') {
        return this.buttonDefTwo.text(this.params);
      }
      return this.buttonDefTwo.text
    }

    get disableButton() {
      // Execute if type is function
      if (typeof this.buttonDef.disabled === 'function') {
        return this.buttonDef.disabled(this.params);
      } else {
        return this.buttonDef.disabled;
      }
    }

    

    get disableButtonTwo() {
      // Execute if type is function
      if (typeof this.buttonDefTwo.disabled === 'function') {
        return this.buttonDefTwo.disabled(this.params);
      } else {
        return this.buttonDefTwo.disabled;
      }
    }

    customFunction() {
      // Execute function when button is clicked
    //   if (this.disableButton) {
    //     this.toastService.openWarningToast(this.buttonDef.message || 'Dữ liệu không đủ điều kiện để thực hiện thao tác');
    //     return;
    //   }
      this.buttonDef.function(this.params);
    }

    customFunctionTwo() {
      // Execute function when button is clicked
    //   if (this.disableButtonTwo) {
    //     this.toastService.openWarningToast(this.buttonDefTwo.message || 'Dữ liệu không đủ điều kiện để thực hiện thao tác');
    //     return;
    //   }
      this.buttonDefTwo.function(this.params);
    }

    refresh(): boolean {
      return false;
    }
}
