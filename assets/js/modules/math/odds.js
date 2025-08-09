export function decimalToImpliedProbability(decimalOdds) {
  const d = Number(decimalOdds);
  if (!(d > 1)) return 0;
  return 1 / d;
}

export function impliedProbabilityToDecimal(prob) {
  const p = Number(prob);
  if (!(p > 0 && p < 1)) return Infinity;
  return 1 / p;
}

export function americanToDecimal(americanOdds) {
  const a = Number(americanOdds);
  if (!isFinite(a) || a === 0) return NaN;
  if (a > 0) return 1 + a / 100;
  return 1 + 100 / Math.abs(a);
}

export function decimalToAmerican(decimalOdds) {
  const d = Number(decimalOdds);
  if (!(d > 1)) return 0;
  if (d >= 2) return Math.round((d - 1) * 100);
  return -Math.round(100 / (d - 1));
}

export function removeVigorishProportional(decimals) {
  const impliedSum = decimals.reduce((sum, d) => sum + decimalToImpliedProbability(d), 0);
  return decimals.map(d => {
    const p = decimalToImpliedProbability(d) / impliedSum;
    return impliedProbabilityToDecimal(p);
  });
}


