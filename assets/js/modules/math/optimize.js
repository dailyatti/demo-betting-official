export function newtonRaphson({ f, fprime, x0, tol = 1e-8, maxIter = 100 }) {
  let x = x0;
  for (let i = 0; i < maxIter; i++) {
    const fx = f(x);
    const d = fprime(x);
    if (!isFinite(fx) || !isFinite(d) || d === 0) break;
    const step = fx / d;
    x -= step;
    if (Math.abs(step) < tol) return x;
  }
  return x;
}

export function optimizeKellyPortfolio({ probabilities, decimalOdds, maxIter = 500, step = 0.1 }) {
  const p = probabilities.map(Number);
  const b = decimalOdds.map(d => Number(d) - 1);
  const n = p.length;
  let f = Array(n).fill(0);
  for (let iter = 0; iter < maxIter; iter++) {
    const g = gradient(p, b, f);
    for (let i = 0; i < n; i++) f[i] = Math.max(0, f[i] + step * g[i]);
    const s = f.reduce((a, x) => a + x, 0);
    if (s > 0.99) f = f.map(x => (x / s) * 0.99);
    if (l2norm(g) < 1e-6) break;
  }
  return f;
}

function gradient(p, b, f) {
  const n = p.length;
  const sumF = f.reduce((a, x) => a + x, 0);
  const g = new Array(n).fill(0);
  const denomVoid = 1 - sumF;
  for (let i = 0; i < n; i++) {
    const termWin = p[i] * (b[i] / (1 + b[i] * f[i]));
    const termVoid = (1 - p.reduce((a, x) => a + x, 0)) * (-1 / Math.max(1e-8, denomVoid));
    g[i] = termWin + termVoid;
  }
  return g;
}

function l2norm(arr) {
  return Math.sqrt(arr.reduce((s, x) => s + x * x, 0));
}


