const days = (a, b) => Math.max(0, Math.round((b - a) / 86400000));
const fyStart = y => new Date(y, 3, 1);
const fyEnd = y => new Date(y + 1, 3, 1);
const addYears = (date, years) => {
  const out = new Date(date);
  const month = out.getMonth();
  out.setFullYear(out.getFullYear() + years);
  if (out.getMonth() !== month) out.setDate(0);
  return out;
};
const minDate = (a, b) => a < b ? a : b;
const maxDate = (a, b) => a > b ? a : b;
const usedDays = (start, end, inService, lifeEnd) =>
  days(maxDate(start, inService), minDate(end, lifeEnd));
const usedMonths = (start, end, inService, lifeEnd) => {
  const s = maxDate(start, inService);
  const e = minDate(end, lifeEnd);
  if (s >= e) return 0;
  return Math.max(0, (e.getFullYear() - s.getFullYear()) * 12 +
    e.getMonth() - s.getMonth() + (e.getDate() > s.getDate() ? 1 : 0));
};

export function calculateBookAssetSchedule(assets, startYear, years, method = "SLM", proration = "days") {
  if (!Array.isArray(assets) || !assets.length) throw new Error("At least one book asset is required.");
  if (!Number.isInteger(startYear) || !Number.isInteger(years) || years < 1 || years > 20) {
    throw new Error("Invalid financial year or projection period.");
  }
  const rows = [];
  for (const asset of assets) {
    const { name, cost, put, life, residual, openingNBV } = asset;
    if (!(put instanceof Date) || !Number.isFinite(put.getTime()) ||
        !(cost > 0) || !(life > 0) || !(residual >= 0 && residual < cost) ||
        !(openingNBV >= residual && openingNBV <= cost)) {
      throw new Error("Invalid book asset inputs for " + (name || "unnamed asset") + ".");
    }
    const lifeEnd = asset.end instanceof Date ? asset.end : addYears(put, life);
    const depreciableAmount = cost - residual;
    const annualWdvRate = 1 - Math.pow(residual / cost, 1 / life);
    let nbv = openingNBV;
    for (let index = 0; index < years; index++) {
      const fy = startYear + index;
      const start = fyStart(fy);
      const end = fyEnd(fy);
      const daysInYear = days(start, end);
      const fraction = proration === "months"
        ? usedMonths(start, end, put, lifeEnd) / 12
        : usedDays(start, end, put, lifeEnd) / daysInYear;
      let depreciation = 0;
      if (end > put && start < lifeEnd && nbv > residual) {
        depreciation = method === "WDV"
          ? nbv * annualWdvRate * fraction
          : (depreciableAmount / life) * fraction;
      }
      if (end >= lifeEnd) depreciation = Math.max(0, nbv - residual);
      depreciation = Math.min(Math.max(0, nbv - residual), Math.max(0, depreciation));
      const opening = nbv;
      nbv = Math.max(residual, nbv - depreciation);
      rows.push({
        name, fy, opening, charge: depreciation, acc: cost - nbv,
        closing: nbv, remaining: Math.max(0, (lifeEnd - end) / 31557600000)
      });
    }
  }
  return rows;
}

export function calculateTaxBlockSchedule(blocks, startYear, years, regime = "normal") {
  if (!Array.isArray(blocks) || !blocks.length) throw new Error("At least one income-tax block is required.");
  if (!Number.isInteger(startYear) || !Number.isInteger(years) || years < 1 || years > 20) {
    throw new Error("Invalid financial year or projection period.");
  }
  const restrictedRegime = ["115baa", "115bab", "115bac"].includes(regime);
  const rows = [];
  for (const block of blocks) {
    const rate = Number(block.rate);
    const openingWdv = Number(block.opening);
    const fullAdditions = Number(block.full);
    const halfAdditions = Number(block.half);
    const saleProceeds = Number(block.sale);
    const additionalFull = Number(block.addFull || 0);
    const additionalHalf = Number(block.addHalf || 0);
    if (![rate, openingWdv, fullAdditions, halfAdditions, saleProceeds, additionalFull, additionalHalf].every(Number.isFinite) ||
        rate < 0 || rate > 1 || openingWdv < 0 || fullAdditions < 0 || halfAdditions < 0 ||
        saleProceeds < 0 || additionalFull < 0 || additionalHalf < 0) {
      throw new Error("Invalid tax block values for " + (block.name || "unnamed block") + ".");
    }
    if (additionalFull > fullAdditions + 0.005 || additionalHalf > halfAdditions + 0.005) {
      throw new Error("Additional-depreciation eligible base cannot exceed the corresponding additions for " + block.name + ".");
    }
    if (restrictedRegime && (rate > 0.4 || additionalFull > 0 || additionalHalf > 0)) {
      throw new Error("The selected concessional regime restricts the depreciation rate to 40% and disallows additional depreciation. Review block " + block.name + ".");
    }
    let wdv = openingWdv;
    for (let index = 0; index < years; index++) {
      const fy = startYear + index;
      const opening = wdv;
      const full = index === 0 ? fullAdditions : 0;
      const half = index === 0 ? halfAdditions : 0;
      const sale = index === 0 ? saleProceeds : 0;
      const blockBase = opening + full + half - sale;
      if (blockBase < -0.005) {
        throw new Error("Sale proceeds exceed opening WDV plus additions for " + block.name + ". Block-cessation / section 50 treatment requires a separate computation.");
      }
      const normalBase = Math.max(0, opening + full - sale + half * 0.5);
      const normalDepreciation = normalBase * rate;
      const additionalDepreciation = index === 0
        ? additionalFull * 0.20 + additionalHalf * 0.10
        : index === 1 ? additionalHalf * 0.10 : 0;
      const depreciation = Math.min(Math.max(0, blockBase), normalDepreciation + additionalDepreciation);
      wdv = Math.max(0, blockBase - depreciation);
      rows.push({
        name: block.name, fy, opening, full, half, sale,
        normalDepreciation, additional: additionalDepreciation,
        dep: depreciation, closing: wdv, rate
      });
    }
  }
  return rows;
}

export function calculateDeferredTax({ carryingAmount, taxBase, taxRate, recogniseDta = false }) {
  const values = [carryingAmount, taxBase, taxRate].map(Number);
  if (!values.every(Number.isFinite) || values[0] < 0 || values[1] < 0 || values[2] < 0 || values[2] > 100) {
    throw new Error("Deferred-tax inputs must be valid non-negative amounts and a tax rate between 0% and 100%.");
  }
  const temporaryDifference = values[0] - values[1];
  const dta = Math.max(0, -temporaryDifference) * values[2] / 100;
  const dtl = Math.max(0, temporaryDifference) * values[2] / 100;
  const recognisedDta = recogniseDta ? dta : 0;
  return {
    temporaryDifference, dta, recognisedDta,
    unrecognisedDta: dta - recognisedDta, dtl,
    net: dtl - recognisedDta
  };
}
