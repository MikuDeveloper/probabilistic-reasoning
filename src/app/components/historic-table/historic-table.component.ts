import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { HistoricTableDataSource} from './historic-table-datasource';
import { HistoricTableItem} from '../../interfaces/historic-table-item';

@Component({
  selector: 'app-historic-table',
  templateUrl: './historic-table.component.html',
  styleUrl: './historic-table.component.scss',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule]
})
export class HistoricTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<HistoricTableItem>;
  dataSource = new HistoricTableDataSource();

  displayedColumns = ['number', 'under30', 'champion', 'position', 'skillfulLeg', 'goodChoice', 'yesOdds', 'noOdds'];

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
