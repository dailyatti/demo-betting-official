export function betaPosterior(alphaPrior, betaPrior, wins, losses) {
  const a0 = Math.max(1e-6, Number(alphaPrior));
  const b0 = Math.max(1e-6, Number(betaPrior));
  const w = Math.max(0, Number(wins));
  const l = Math.max(0, Number(losses));
  return { alpha: a0 + w, beta: b0 + l };
}

export function betaMean(alpha, beta) {
  const a = Number(alpha), b = Number(beta);
  return a / (a + b);
}

export function betaVariance(alpha, beta) {
  const a = Number(alpha), b = Number(beta);
  const s = a + b;
  return (a * b) / (s * s * (s + 1));
}

export function credibleIntervalNormalApprox(alpha, beta, z = 1.96) {
  const m = betaMean(alpha, beta);
  const v = betaVariance(alpha, beta);
  const sd = Math.sqrt(v);
  return { lo: clamp(m - z * sd, 0, 1), hi: clamp(m + z * sd, 0, 1) };
}

function clamp(x, min, max) {
  return Math.min(max, Math.max(min, Number(x)));
}


