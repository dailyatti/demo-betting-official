export function roi(totalProfit, totalStaked) {
  const denom = Number(totalStaked) || 0;
  if (denom === 0) return 0;
  return (Number(totalProfit) / denom) * 100;
}

export function sharpeRatio(returns, riskFreeRatePerPeriod = 0) {
  if (!Array.isArray(returns) || returns.length === 0) return 0;
  const excess = returns.map(r => r - riskFreeRatePerPeriod);
  const mean = excess.reduce((s, x) => s + x, 0) / excess.length;
  const variance = excess.reduce((s, x) => s + (x - mean) ** 2, 0) / Math.max(1, excess.length - 1);
  const sd = Math.sqrt(variance);
  return sd === 0 ? 0 : mean / sd;
}

export function meanConfidenceInterval(values, z = 1.96) {
  if (!Array.isArray(values) || values.length === 0) return { mean: 0, lo: 0, hi: 0 };
  const mean = values.reduce((s, x) => s + x, 0) / values.length;
  const variance = values.reduce((s, x) => s + (x - mean) ** 2, 0) / Math.max(1, values.length - 1);
  const sd = Math.sqrt(variance);
  const se = sd / Math.sqrt(values.length);
  return { mean, lo: mean - z * se, hi: mean + z * se };
}


