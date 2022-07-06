import {
  Component,
  Input,
  Output,
  EventEmitter,
  Injector,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { PaginationModel } from '../../baseModel/base.model';
//import { PaginationModel } from '@shared/common/baseModel/base.model';
//import { AppComponentBase } from '@shared/common/app-component-base';
//import { appModuleAnimation } from '@shared/animations/routerTransition';
//import { Module } from '@ag-grid-community/AllModules';

@Component({
  selector: 'grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GridTableComponent {
  @ViewChild('input', { static: false }) input: ElementRef;

  //Col Def
  @Input() columnDefs;
  @Input() defaultColDef;
  @Input() autoGroupColumnDef;
  @Input() rowGroupPanelShow;
  @Input() frameworkComponents;
  @Input() rowClassRules;
  @Input() rowData: any;
  @Input() ignoreEnterEvent: boolean;
  @Input() alwaysEnableBtn: boolean;
  @Input() isDisabled: boolean;
  @Input() detailCellRendererParams;
  @Input() masterDetail: boolean;
  //@Input() modules: Module[] = AllModules;
  @Input() detailRowData;
  @Input() rowModelType;
  @Input() columnTypes;
  @Input() groupDefaultExpanded;
  @Input() groupUseEntireRow;
  @Input() rowDragManaged;
  @Input() animateRows;
  @Input() suppressMoveWhenRowDragging;
  @Input() detailRowHeight;

  //Grid and pagintion
  @Input() paginationParams?: PaginationModel;
  @Output() changePaginationParams = new EventEmitter();
  @Output() callBackEvent = new EventEmitter();
  @Input() disabledHorizontalScroll: boolean = false;

  //StyleonChangeSelection
  @Input() height;
  @Input() getRowStyle;
  @Input() pinnedBottomRowData;

  // Cell
  @Output() onChangeSelection = new EventEmitter();
  @Input() rowSelection;
  @Output() cellDoubleClicked = new EventEmitter();
  @Output() cellKeyPress = new EventEmitter();
  @Output() cellValueChanged = new EventEmitter();
  @Output() rowValueChanged = new EventEmitter();
  @Output() cellEditingStopped = new EventEmitter();
  @Output() cellEditingStarted = new EventEmitter();
  @Output() cellFocused = new EventEmitter();
  @Output() onSearch = new EventEmitter();
  @Output() rowClicked = new EventEmitter();
  @Output() cellMouseOver = new EventEmitter();

  @Output() rowDragEnter = new EventEmitter();
  @Output() rowDragEnd = new EventEmitter();
  @Output() rowDragMove = new EventEmitter();
  @Output() rowDragLeave = new EventEmitter();

  cellEditStopParams;
  @Input() isKeepFocus: boolean;

  @Input() showPagination: boolean = true;

  @Input() isSuppressHorizontalScroll: boolean = false;
  @Input() isSuppressRowClickSelection: boolean = false;
  @Input() singleClickEdit = false;
  @Input() className;
  style;
  autoHeight;
  cellEditStartParams;
  @Input() checkedData;
  params;
  gridColumnApi;
  gridApi;
  getRowHeight = function(params){
    return 35;
  }
  @Input() enableFilter;
  @Input() sideBar;
  constructor(injector: Injector) {
    this.rowSelection = this.rowSelection ?? 'single';
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (this.height) {
      this.setHeight(this.height);
    } else {
      this.autoHeight = 'autoHeight';
    }
    this.columnTypes = {
      dateColumn: {
        filter: 'agDateColumnFilter',
        filterParams: {
          comparator: function (filterLocalDateAtMidnight, cellValue) {
            var dateParts = cellValue.split('/');
            var day = Number(dateParts[0]);
            var month = Number(dateParts[1]) - 1;
            var year = Number(dateParts[2]);
            var cellDate = new Date(year, month, day);
            if (cellDate < filterLocalDateAtMidnight) {
              return -1;
            } else if (cellDate > filterLocalDateAtMidnight) {
              return 1;
            } else {
              return 0;
            }
          },
        },
      },
    };
    if (!this.autoGroupColumnDef) {
      this.defaultColDef = Object.assign(
        {},
        {
          editable: false,
          resizable: true,
          menuTabs: [],
          tooltipValueGetter: (t: any) => t.value,
          filter: 'agTextColumnFilter',
          filterParams: {
            caseSensitive: true,
          },
          //floatingFilterComponentParams: { suppressFilterButton: true },
          enableRowGroup: true,
          enablePivot: true,
          enableValue: true,
          //cellClass: ['cell-border', 'cell-readonly'],
          cellStyle: (params) => {
            if (params.colDef.field === 'stt') {
              return { textAlign: 'center' };
            }
          },
        },
        this.defaultColDef
      );
    }
  }

  setHeight(height) {
    this.style = Object.assign({}, { height });
  }

  onGridReady(params) {
    this.params = params;
    this.callBackEvent.emit(params);
  }

  onCellKeyPress(params) {
    this.cellKeyPress.emit(params);
  }

  changePage(params) {
    this.changePaginationParams.emit(params);
  }

  onRowFocused(params) {}

  onSelectionChanged(params) {
    return this.onChangeSelection.emit(params);
  }

  cellDoubleClickedEvent(params) {
    return this.cellDoubleClicked.emit(params);
  }
  onCellMouseOver(params) {
    return this.cellMouseOver.emit(params);
  }

  onCellValueChanged(params) {
    if (this.checkedData) {
      this.checkedValueChange(params);
    }

    if (params.colDef.field !== 'checked') {
      this.cellValueChanged.emit(params);
    }
  }

  onRowClicked(event) {
    return this.rowClicked.emit(event);
  }

  //event drag-n-drop
  onRowDragEnter(event) {
    return this.rowDragEnter.emit(event);
  }
  onRowDragEnd(event) {
    return this.rowDragEnd.emit(event);
  }
  onRowDragMove(event) {
    return this.rowDragMove.emit(event);
  }
  onRowDragLeave(event) {
    return this.rowDragLeave.emit(event);
  }

  checkedValueChange(params) {
    let index;
    if (params.api.getColumnDef('checked')) {
      index = params.api.getColumnDef('checked').fieldCheck;
    }
    if (params.data.checked) {
      this.checkedData[params.data[index]] = params.data;
    } else if (this.checkedData[params.data[index]]) {
      delete this.checkedData[params.data[index]];
    }
  }

  onRowValueChanged(params) {
    this.rowValueChanged.emit(params);
  }

  onCellEditingStopped(params) {
    this.cellEditStopParams = params;
    this.cellEditingStopped.emit(params);
  }

  onCellEditingStarted(params) {
    this.cellEditStartParams = params;
    params.column.editingStartedValue = params.value;
    this.cellEditingStarted.emit(params);
  }

  onCellFocused(params) {
    this.cellFocused.emit(params);
  }

  focus(event) {}

  onKeyUp(params) {
    if (!this.ignoreEnterEvent && params.key === 'Enter') {
      this.blurInput();
    }
  }

  onKeyDown(params) {
    this.navigateToNextCell(params);
    // Những nút không thuộc hàng phím số và phím chữ
    if (params.keyCode < 45) {
      return;
    }
    const validators = this.cellEditStartParams
      ? this.cellEditStartParams.colDef.validators
      : null;

    if (validators && validators.length > 0) {
      for (let i = 0, length = validators.length; i < length; i++) {
        if (this[`${validators[i]}Validate`].call(this, params)) {
          return;
        }
      }
    }
  }

  blurInput() {
    if (!this.alwaysEnableBtn && this.isDisabled) {
      return;
    }

    if (
      this.cellEditStopParams &&
      this.cellEditStopParams.value &&
      this.cellEditStopParams.value !== ''
    ) {
      this.onSearch.emit(this.cellEditStopParams);
    } else {
      this.onSearch.emit(this.cellEditStopParams);
    }
  }

  focusAfterEdit(params) {}

  resetAfterEdit(params) {
    params.node.setDataValue(
      params.colDef.field,
      params.column.editingStartedValue
    );
    // params.api.setFocusedCell(params.rowIndex, params.colDef.field);
  }

  numberValidate(params) {
    const NUMBER_REGEX = /^\d+$/g;
    if (
      params.key !== '' &&
      params.key !== ',' &&
      params.key !== '.' &&
      params.key &&
      !NUMBER_REGEX.test(params.key)
    ) {
      this.resetAfterEdit(this.cellEditStartParams);
      //this.notify.warn('Sai định dạng số');
      this.focusAfterEdit(this.cellEditStartParams);
      return true;
    }
    return false;
  }

  requiredValidate(params) {
    if (
      params.column.editingStartedValue &&
      (!params.value || !params.value.toString())
    ) {
      //this.notify.warn('Dữ liệu không được trống');
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }

  integerNumberValidate(params) {
    const NUMBER_REGEX = /^\d+$/g;
    if (
      params.value !== '' &&
      params.value &&
      !NUMBER_REGEX.test(params.value)
    ) {
      // this.resetAfterEdit(params);
      //this.notify.warn('Chỉ được nhập số nguyên');
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }

  navigateToNextCell(params) {
    let focusCell = this.params.api.getFocusedCell();
    var KEY_UP = 38;
    var KEY_DOWN = 40;
    var KEY_LEFT = 37;
    var KEY_RIGHT = 39;
    switch (params.keyCode) {
      case KEY_DOWN:
        // set selected cell on current cell + 1
        this.params.api.forEachNode(function (node) {
          if (focusCell.rowIndex === node.rowIndex) {
            node.setSelected(true);
          }
        });
        return;
      case KEY_UP:
        // set selected cell on current cell - 1
        this.params.api.forEachNode(function (node) {
          if (focusCell.rowIndex === node.rowIndex) {
            node.setSelected(true);
          }
        });
        return;
      case KEY_LEFT:
      case KEY_RIGHT:
        return;
      default:
        return;
    }
  }
}
