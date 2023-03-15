export function getValue(o: any, s: any) {
  s = s.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
  const a = s.split('.');
  for (const i of a) {
    if ((o && o[i]) || typeof o[i] === 'number') {
      o = o[i];
    } else {
      return '';
    }
  }
  return o;
}
