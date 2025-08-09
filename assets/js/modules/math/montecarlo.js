export function simulateBankroll({
  initialBankroll,
  bets,
  runs = 10000
}) {
  const results = [];
  for (let r = 0; r < runs; r++) {
    let bank = initialBankroll;
    for (const b of bets) {
      const stake = typeof b.stake === 'function' ? b.stake(bank) : Number(b.stake);
      const win = Math.random() < b.trueProb;
      bank += win ? stake * (b.decimalOdds - 1) : -stake;
      if (bank <= 0) { bank = 0; break; }
    }
    results.push(bank);
  }
  const summary = summarize(results);
  return { results, summary };
}

function summarize(values) {
  const arr = values.slice().sort((a, b) => a - b);
  const mean = arr.reduce((s, x) => s + x, 0) / arr.length;
  const p05 = percentile(arr, 5);
  const p50 = percentile(arr, 50);
  const p95 = percentile(arr, 95);
  return { mean, p05, p50, p95 };
}

function percentile(sorted, p) {
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  const w = idx - lo;
  return sorted[lo] * (1 - w) + sorted[hi] * w;
}


