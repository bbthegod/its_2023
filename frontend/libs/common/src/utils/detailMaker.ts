import { getValue } from './getValue';

export function detailMaker(heading: string[], body: string[], data: any) {
  const res: string[][] = [];
  for (const i in heading) {
    const t = [`${heading[i]}`, `${getValue(data, body[i])}`];
    res.push(t);
  }
  return res;
}
