export function kellyFraction(trueWinProbability, decimalOdds, fraction = 1) {
  if (!isFinite(trueWinProbability) || !isFinite(decimalOdds)) throw new Error('Invalid inputs');
  const p = clamp(trueWinProbability, 0, 1);
  const b = Number(decimalOdds) - 1;
  if (b <= 0) return 0;
  const q = 1 - p;
  const k = (p * b - q) / b;
  return clamp(k * fraction, 0, 1);
}

export function kellyStake(currentBankroll, trueWinProbability, decimalOdds, fraction = 1) {
  const f = kellyFraction(trueWinProbability, decimalOdds, fraction);
  const bankroll = Math.max(0, Number(currentBankroll) || 0);
  return bankroll * f;
}

export function edge(trueWinProbability, decimalOdds) {
  const p = clamp(trueWinProbability, 0, 1);
  const b = Number(decimalOdds) - 1;
  if (b <= 0) return 0;
  return p * (b + 1) - 1;
}

export function fractionalKelly(k, fraction) {
  return clamp(k * fraction, 0, 1);
}

function clamp(x, min, max) {
  return Math.min(max, Math.max(min, Number(x)));
}


