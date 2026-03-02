export const formatCurrency = (n: number): string => `₹${n.toLocaleString('en-IN')}`;

export const calculateSIPCorpus = (
  budget: number,
  months: number,
  annualReturn = 0.12,
): number => {
  if (months <= 0) return 0;
  const r = annualReturn / 12;
  return budget * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
};

export const calculateRequiredSIP = (
  target: number,
  months: number,
  annualReturn = 0.12,
): number => {
  if (months <= 0) return 0;
  const r = annualReturn / 12;
  return target / ((((Math.pow(1 + r, months) - 1) / r) * (1 + r)));
};

export const calculateProjectedCost = (
  baseCost: number,
  years: number,
  inflationRate = 0.08,
): number => {
  if (years <= 0) return baseCost;
  return baseCost * Math.pow(1 + inflationRate, years);
};
