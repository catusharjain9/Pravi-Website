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
    const disposalDate = asset.disposalDate instanceof Date ? asset.disposalDate : null;
    if (disposalDate && disposalDate < fyStart(startYear)) {
      throw new Error("Asset " + (name || "unnamed asset") + " was disposed before the selected financial year; exclude it from the current asset register.");
    }
    if (disposalDate && disposalDate <= put) {
      throw new Error("Disposal date must be after the put-to-use date for " + (name || "unnamed asset") + ".");
    }
    const disposalProceeds = Number(asset.disposalProceeds || 0);
    if (!Number.isFinite(disposalProceeds) || disposalProceeds < 0) {
      throw new Error("Disposal proceeds must be a non-negative amount for " + (name || "unnamed asset") + ".");
    }
    const depreciableAmount = cost - residual;
    const annualWdvRate = asset.wdvRate ? Number(asset.wdvRate) / 100 : 1 - Math.pow(residual / cost, 1 / life);
    let nbv = put < fyStart(startYear) ? openingNBV : 0;
    for (let index = 0; index < years; index++) {
      const fy = startYear + index;
      const start = fyStart(fy);
      const end = fyEnd(fy);
      const daysInYear = days(start, end);
      const notYetPut = put >= end;
      const putInYear = put >= start && put < end;
      const disposedBeforeYear = disposalDate && disposalDate < start;
      const disposedInYear = disposalDate && disposalDate >= start && disposalDate < end;
      const opening = notYetPut || putInYear || disposedBeforeYear ? 0 : nbv;
      const depreciableOpening = putInYear ? cost : nbv;
      const chargeEnd = disposedInYear ? disposalDate : end;
      const fraction = proration === "months"
        ? usedMonths(start, chargeEnd, put, lifeEnd) / 12
        : usedDays(start, chargeEnd, put, lifeEnd) / daysInYear;
      let depreciation = 0;
      if (!notYetPut && !disposedBeforeYear && chargeEnd > put && start < lifeEnd && depreciableOpening > residual) {
        depreciation = method === "WDV"
          ? depreciableOpening * annualWdvRate * fraction
          : (depreciableAmount / life) * fraction;
      }
      if (!notYetPut && !disposedBeforeYear && !disposedInYear && end >= lifeEnd) {
        depreciation = Math.max(0, depreciableOpening - residual);
      }
      depreciation = Math.min(Math.max(0, depreciableOpening - residual), Math.max(0, depreciation));
      const carryingAtDisposal = disposedInYear ? Math.max(0, depreciableOpening - depreciation) : null;
      const disposalGainLoss = disposedInYear ? disposalProceeds - carryingAtDisposal : null;
      nbv = notYetPut || disposedBeforeYear || disposedInYear
        ? 0
        : Math.max(residual, depreciableOpening - depreciation);
      rows.push({
        name, fy, opening, charge: depreciation,
        acc: notYetPut || disposedBeforeYear ? 0 : cost - (disposedInYear ? carryingAtDisposal : nbv),
        closing: nbv, remaining: disposedInYear || disposedBeforeYear ? 0 : Math.max(0, (lifeEnd - maxDate(end, put)) / 31557600000),
        disposed: Boolean(disposedInYear), disposalDate: disposedInYear ? disposalDate : null,
        disposalProceeds: disposedInYear ? disposalProceeds : 0,
        carryingAtDisposal, disposalGainLoss
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
  const restrictedRegime = ["115ba", "115baa", "115bab", "115bac", "115bad", "115bae"].includes(regime);
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
    if (block.continues !== true) throw new Error("Confirm that the block continues to exist at year-end. Block cessation / section 50 balancing treatment is outside this workpaper and requires a separate tax computation for " + block.name + ".");
    if ((additionalFull > 0 || additionalHalf > 0) && block.additionalEligible !== true) throw new Error("Confirm statutory additional-depreciation eligibility and exclusions for " + block.name + " before entering an eligible base.");
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
        normalDepreciation, additionalEligible: block.additionalEligible === true,
        additionalFullBase: index === 0 ? additionalFull : 0,
        additionalHalfBase: index === 0 ? additionalHalf : 0,
        additionalHalfCarryBase: index === 1 ? additionalHalf : 0,
        additional: additionalDepreciation,
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
