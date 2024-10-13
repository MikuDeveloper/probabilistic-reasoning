import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, merge } from 'rxjs';
import { HistoricTableItem } from '../../interfaces/historic-table-item';
import { collection, collectionData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { inject } from '@angular/core';

export class HistoricTableDataSource extends DataSource<HistoricTableItem> {
  private _firestore: Firestore = inject(Firestore);
  data: HistoricTableItem[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  connect(): Observable<HistoricTableItem[]> {
    if (this.paginator && this.sort) {
      const stream = collectionData(query(collection(this._firestore, 'historical'), orderBy('number', 'asc')));
      stream.subscribe((data: HistoricTableItem[]) => this.data = data);
      return merge(stream, this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  disconnect(): void {}

  private getPagedData(data: HistoricTableItem[]): HistoricTableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: HistoricTableItem[]): HistoricTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'number': return compare(a.number, b.number, isAsc);
        case 'under30': return compare(a.under30, b.under30, isAsc);
        case 'champion': return compare(a.champion, b.champion, isAsc);
        case 'position': return compare(a.position, b.position, isAsc);
        case 'skillfulLeg': return compare(a.skillfulLeg, b.skillfulLeg, isAsc);
        case 'goodChoice': return compare(a.goodChoice, b.goodChoice, isAsc);
        case 'yesOdds': return compare(a.yesOdds, b.yesOdds, isAsc);
        case 'noOdds': return compare(a.noOdds, b.noOdds, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
