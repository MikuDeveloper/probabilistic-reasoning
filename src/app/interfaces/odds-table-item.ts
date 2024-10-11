import { HistoricTableItem } from './historic-table-item';

export interface OddsTableItem extends HistoricTableItem {
  yesOdds: string;
  noOdds: string;
}
