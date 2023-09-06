import { DataSet, Table } from '../types';
import { getValue } from './getValue';

export function tableMaker(dataset: DataSet[], data: any) {
  const t: Table[] = []
  for (const row of data) {
    const b: any = {
      id: row._id,
      data: [],
    };
    for (const col of dataset) {
      const c = {
        type: col.type,
        value: `${getValue(row, col.value)}`
      }
      b.data.push(c);
    }
    t.push(b);
  }
  return t;
}
