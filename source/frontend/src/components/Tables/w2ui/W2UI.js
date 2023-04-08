import { w2ui, w2grid } from "w2ui/dist/w2ui.es6.js"
import "./W2UI.css"

export function createTable({elementID, name, tableName, searches, columns, records, columnGroups, searchData, sortData,
    selectable, addToTable, reorderRows, deleteRows, onReorderRowCallback, onDeleteCallback, additionalToolbarButtons={}}) {
    window.w2ui = window.w2ui ? window.w2ui : w2ui
    let table = window.w2ui[tableName]
    const tableExists = typeof table !== "undefined";
    if (tableExists && addToTable) {
        table.add(records)
    } else {
        if (tableExists) {
            table.destroy();
        }
        const downloadRecords = () => {
            _downloadRecords(name, table.columns, table.records);
        }
        table = new w2grid({
            name: tableName,
            box: document.getElementById(elementID),
            header: name,
            show: {
                header: false,
                toolbar: true,
                footer: true,
                toolbarReload: false,
                toolbarDelete: deleteRows,
                selectColumn: selectable,
                orderColumn: reorderRows,
                toolbarAdd: false,
                toolbarSave: false,
                toolbarEdit: false,
                columnMenu: true,
                columnHeaders: true,
                // expandColumn: true,
                emptyRecords: true,
                toolbarColumns: true,
            },
            multiSearch: true,
            searches,
            columns,
            records,
            sortData,
            searchData,
            columnGroups,
            reorderRows,
            onDelete: onDeleteCallback,
            onReorderRow: onReorderRowCallback,
        });
        table.toolbar.add(
            { type: 'button', id: 'exportTable', text: 'Export', img: 'fas fa-file-download', onClick: downloadRecords },
            ...additionalToolbarButtons
        );
    }
    return table;
}

function _downloadRecords(name, columns, rows) {
    const columnFields = columns.map((col) => col.field);
    let csv = `${columns.map((col) => col.text).join(",")}\n`;
    csv += rows.map((row) => {
        return columnFields.map((field) => {
            const value = row[field];
            if (typeof value === "string") {
                return value.replaceAll(",", " ");
            }
            return value
        }).join(",")
    }).join("\n");
    const hiddenElement = document.createElement('a');
    hiddenElement.href = `data:text/csv;charset=utf-8,${encodeURI(csv)}`;
    hiddenElement.target = '_blank';
    hiddenElement.download = `${name}.csv`;
    hiddenElement.click();
    hiddenElement.remove();
}