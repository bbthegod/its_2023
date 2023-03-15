export function stringNormalize(str: string) {
  str = str.trim();
  str = str.toLowerCase();
  while (str.indexOf('  ') !== -1) str = str.slice(str.indexOf('  '), 1);
  const s = str.split(' ');
  const res: string[] = [];
  for (const i of s) {
    const newString = i.charAt(0).toUpperCase() + i.substring(1);
    res.push(newString);
  }
  return res.join(' ');
}
