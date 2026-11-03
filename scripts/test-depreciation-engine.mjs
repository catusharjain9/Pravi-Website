import assert from "node:assert/strict";
import {
  calculateBookAssetSchedule,
  calculateTaxBlockSchedule,
  calculateDeferredTax
} from "../assets/js/depreciation-engine.js";

const tax = calculateTaxBlockSchedule([{
  name: "General plant & machinery", rate: 0.15, opening: 0,
  full: 100000, half: 200000, sale: 0, addFull: 100000, addHalf: 200000, additionalEligible: true, continues: true
}], 2026, 2, "normal");
assert.equal(tax.length, 2);
assert.equal(tax[0].normalDepreciation, 30000);
assert.equal(tax[0].additionalEligible, true);
assert.equal(tax[0].additionalFullBase, 100000);
assert.equal(tax[0].additionalHalfBase, 200000);
assert.equal(tax[0].additionalHalfCarryBase, 0);
assert.equal(tax[0].additional, 40000);
assert.equal(tax[0].dep, 70000);
assert.equal(tax[0].closing, 230000);
assert.equal(tax[1].normalDepreciation, 34500);
assert.equal(tax[1].additionalFullBase, 0);
assert.equal(tax[1].additionalHalfBase, 0);
assert.equal(tax[1].additionalHalfCarryBase, 200000);
assert.equal(tax[1].additional, 20000);
assert.equal(tax[1].dep, 54500);
assert.equal(tax[1].closing, 175500);

const halfYearOnly = calculateTaxBlockSchedule([{
  name: "Plant", rate: 0.15, opening: 0, full: 0, half: 100000,
  sale: 0, addFull: 0, addHalf: 100000, additionalEligible: true, continues: true
}], 2026, 2, "normal");
assert.equal(halfYearOnly[0].additional, 10000);
assert.equal(halfYearOnly[1].additional, 10000);

assert.throws(() => calculateTaxBlockSchedule([{
  name: "Plant", rate: 0.15, opening: 0, full: 100000, half: 0,
  sale: 0, addFull: 100001, addHalf: 0, additionalEligible: true, continues: true
}], 2026, 2, "normal"), /eligible base cannot exceed/);
assert.throws(() => calculateTaxBlockSchedule([{
  name: "Plant", rate: 0.15, opening: 0, full: 100000, half: 0,
  sale: 0, addFull: 100000, addHalf: 0, additionalEligible: false, continues: true
}], 2026, 2, "normal"), /Confirm statutory additional-depreciation eligibility/);
assert.throws(() => calculateTaxBlockSchedule([{
  name: "Plant", rate: 0.45, opening: 0, full: 100000, half: 0,
  sale: 0, addFull: 0, addHalf: 0, continues: true
}], 2026, 2, "115baa"), /restricts the depreciation rate/);
assert.throws(() => calculateTaxBlockSchedule([{
  name: "Plant", rate: 0.15, opening: 0, full: 100000, half: 0,
  sale: 0, addFull: 100000, addHalf: 0, additionalEligible: true, continues: true
}], 2026, 2, "115bac"), /disallows additional depreciation/);
for (const regime of ["115ba", "115bad", "115bae"]) {
  assert.throws(() => calculateTaxBlockSchedule([{
    name: "Plant", rate: 0.15, opening: 0, full: 100000, half: 0,
    sale: 0, addFull: 100000, addHalf: 0, additionalEligible: true
  }], 2026, 2, regime), /disallows additional depreciation/);
}
assert.throws(() => calculateTaxBlockSchedule([{
  name: "Plant", rate: 0.15, opening: 100, full: 0, half: 0,
  sale: 200, addFull: 0, addHalf: 0, continues: true
}], 2026, 2, "normal"), /Sale proceeds exceed/);
assert.throws(() => calculateTaxBlockSchedule([{
  name: "Plant", rate: 0.15, opening: 100000, full: 0, half: 0,
  sale: 50000, addFull: 0, addHalf: 0, continues: false
}], 2026, 2, "normal"), /Block cessation/);
assert.throws(() => calculateTaxBlockSchedule([{
  name: "Plant", rate: 0.15, opening: 100000, full: 0, half: 0,
  sale: 0, addFull: 0, addHalf: 0
}], 2026, 2, "normal"), /Confirm that the block continues/);

const book = calculateBookAssetSchedule([{
  name: "Test asset", cost: 100000, put: new Date(2026, 3, 1),
  life: 5, residual: 5000, openingNBV: 100000, end: new Date(2031, 3, 1)
}], 2026, 2, "SLM", "days");
assert.equal(book[0].charge, 19000);
assert.equal(book[0].closing, 81000);
assert.equal(book[1].charge, 19000);
assert.equal(book[1].closing, 62000);

const futureBook = calculateBookAssetSchedule([{
  name: "Future in-service asset", cost: 100000, put: new Date(2027, 9, 1),
  life: 5, residual: 5000, openingNBV: 100000, end: new Date(2032, 9, 1)
}], 2026, 3, "SLM", "days");
assert.equal(futureBook[0].opening, 0);
assert.equal(futureBook[0].charge, 0);
assert.equal(futureBook[0].closing, 0);
assert.ok(futureBook[1].charge > 0);
assert.ok(futureBook[1].closing < 100000);

const bookWdv = calculateBookAssetSchedule([{
  name: "WDV asset", cost: 100000, put: new Date(2026, 3, 1),
  life: 5, residual: 5000, openingNBV: 100000, end: new Date(2031, 3, 1)
}], 2026, 1, "WDV", "days");
const expectedRate = 1 - Math.pow(0.05, 1 / 5);
assert.ok(Math.abs(bookWdv[0].charge - 100000 * expectedRate) < 0.01);

const explicitBookWdv = calculateBookAssetSchedule([{
  name: "Explicit WDV rate asset", cost: 100000, put: new Date(2026, 3, 1),
  life: 10, residual: 0, openingNBV: 100000, wdvRate: 15, end: new Date(2036, 3, 1)
}], 2026, 1, "WDV", "days");
assert.equal(explicitBookWdv[0].charge, 15000);
assert.equal(explicitBookWdv[0].closing, 85000);

const dtl = calculateDeferredTax({ carryingAmount: 80000, taxBase: 70000, taxRate: 25, recogniseDta: true });
assert.equal(dtl.temporaryDifference, 10000);
assert.equal(dtl.dtl, 2500);
assert.equal(dtl.dta, 0);
const unrecognisedDta = calculateDeferredTax({ carryingAmount: 60000, taxBase: 70000, taxRate: 25, recogniseDta: false });
assert.equal(unrecognisedDta.dta, 2500);
assert.equal(unrecognisedDta.recognisedDta, 0);
assert.equal(unrecognisedDta.unrecognisedDta, 2500);
const recognisedDta = calculateDeferredTax({ carryingAmount: 60000, taxBase: 70000, taxRate: 25, recogniseDta: true });
assert.equal(recognisedDta.recognisedDta, 2500);

console.log("Depreciation engine tests passed.");
