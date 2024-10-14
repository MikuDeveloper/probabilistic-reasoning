import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { historicHeaders, historicHeadersXLSX } from '../vars';
import { HistoricTableItem } from '../interfaces/historic-table-item';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor() { }

  async loadXLSX(file: File) {
    const workbook = XLSX.read(await file.arrayBuffer());

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const raw_data: HistoricTableItem[] = XLSX.utils.sheet_to_json(worksheet, { header: historicHeaders });

    return raw_data.splice(1);
  }

  async downloadFile(data: HistoricTableItem[]) {
    const worksheet = XLSX.utils.json_to_sheet(data, { header: historicHeaders });

    let counter = 0;
    worksheet['!cols'] = historicHeaders.map(header => {
      const maxLength = data.reduce((max, item) => {
        const value = item[header];
        return Math.max(max, value ? value.toString().length : 0);
      }, historicHeadersXLSX[counter].length);
      counter++;
      return { wch: maxLength + 2 }; // Adding some padding
    });

    XLSX.utils.sheet_add_aoa(worksheet, [historicHeadersXLSX], { origin: 'A1' });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Históricos');
    XLSX.writeFile(workbook, 'Históricos.xlsx', { compression: true });
  }
}
