export function poissonPmf(lambda, k) {
  const L = Number(lambda);
  const n = Math.max(0, Math.floor(k));
  if (!(L > 0)) return n === 0 ? 1 : 0;
  return Math.exp(n * Math.log(L) - L - logFactorial(n));
}

export function outcomeProbabilities(lambdaHome, lambdaAway, maxGoals = 10) {
  const lh = Number(lambdaHome);
  const la = Number(lambdaAway);
  let pHome = 0, pDraw = 0, pAway = 0;
  for (let h = 0; h <= maxGoals; h++) {
    const ph = poissonPmf(lh, h);
    for (let a = 0; a <= maxGoals; a++) {
      const pa = poissonPmf(la, a);
      const p = ph * pa;
      if (h > a) pHome += p; else if (h === a) pDraw += p; else pAway += p;
    }
  }
  const s = pHome + pDraw + pAway;
  return { home: pHome / s, draw: pDraw / s, away: pAway / s };
}

export function scorelineMatrix(lambdaHome, lambdaAway, maxGoals = 10) {
  const matrix = [];
  for (let h = 0; h <= maxGoals; h++) {
    const row = [];
    for (let a = 0; a <= maxGoals; a++) {
      row.push(poissonPmf(lambdaHome, h) * poissonPmf(lambdaAway, a));
    }
    matrix.push(row);
  }
  return matrix;
}

function logFactorial(n) {
  if (n < 2) return 0;
  let x = 0;
  for (let i = 2; i <= n; i++) x += Math.log(i);
  return x;
}


