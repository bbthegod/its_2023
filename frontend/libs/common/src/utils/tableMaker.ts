import { BodyTable, Table } from '../types';
import { getValue } from './getValue';

export function tableMaker(heading: string[], body: string[], data: any) {
  const t: Table = {
    heading,
    body: [],
  };
  for (const i of data) {
    const b: BodyTable = {
      id: i._id,
      array: [],
    };
    for (const j of body) {
      b.array.push(`${getValue(i, j)}`);
    }
    t.body.push(b);
  }
  return t;
}
