export function hslToHex(hsl: string) {
  // 将 HSL 拆分为三个值
  const [h, s, l] = hsl.split(' ').map((value, index) => {
    return index === 0 ? Number.parseFloat(value) : Number.parseFloat(value) / 100;
  });
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(color * 255);
  };
  const r = f(0);
  const g = f(8);
  const b = f(4);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
