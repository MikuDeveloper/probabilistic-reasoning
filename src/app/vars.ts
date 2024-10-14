import {HistoricTableItem} from './interfaces/historic-table-item';

export const historicHeaders: (keyof HistoricTableItem)[] = [
  'number', 'under30', 'champion', 'position', 'skillfulLeg', 'goodChoice', 'yesOdds', 'noOdds'
];

export const historicHeadersXLSX: string[] = [
  'NO.', 'MENOR DE 30', 'CAMPEÓN', 'POSICIÓN', 'PIERNA HÁBIL', 'BUEN FICHAJE', 'PROBABILIDAD DE SI', 'PROBABILIDAD DE NO'
];
