import assert from "node:assert/strict";
import { convertCurrencyAmount, validateFxRate } from "../assets/js/currency-engine.js";

assert.equal(convertCurrencyAmount(1000, 0.01234), 12.34);
assert.equal(convertCurrencyAmount(0, 1.25), 0);
assert.equal(convertCurrencyAmount(100, 1), 100);
assert.throws(() => convertCurrencyAmount(-1, 1), /non-negative/);
assert.throws(() => convertCurrencyAmount(10, 0), /positive/);
assert.throws(() => convertCurrencyAmount(10, Infinity), /positive/);
assert.throws(() => convertCurrencyAmount(Number.MAX_VALUE, Number.MAX_VALUE), /numeric range/);
assert.equal(validateFxRate("1.25", "USD", "INR"), 1.25);
assert.throws(() => validateFxRate(1, "US", "INR"), /three-letter/);
assert.throws(() => validateFxRate(0, "USD", "INR"), /positive/);

console.log("Currency engine tests passed.");
