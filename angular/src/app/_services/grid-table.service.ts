import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridTableService {

  constructor() { }

   // gridApi = params.api
   selectFirstRow(gridApi) {
    gridApi?.forEachNode(node => {
      if (node.childIndex === 0) {
        node.setSelected(true);
      }
    });
  }

  getAllData(params) {
    const dataArr = [];
    params.api.forEachNode(node => {
      if (node.level) dataArr.push(node.data);
    });
    return dataArr;
  }

  // gridApi = params.api
  async setFocusCell(gridApi, colName, displayedData?, rowIndex?, editing?) {

    let rowToFocus = rowIndex != null ? rowIndex : (displayedData.length > 0 ? displayedData.length : 0);
    await gridApi?.forEachNode(node => {
      if (node.rowIndex === rowToFocus) {

        node.setSelected(true);
        if (editing) {
          gridApi.startEditingCell({
            rowIndex: rowToFocus,
            colKey: colName,
            floating: null
          });
          return
        }
        return;
      }
    });
  }

}
