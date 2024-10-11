import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { historicHeaders } from '../vars';
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
}
