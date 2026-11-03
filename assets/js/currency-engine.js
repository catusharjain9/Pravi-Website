export function convertCurrencyAmount(amount, rate) {
  const principal = Number(amount);
  const exchangeRate = Number(rate);
  if (!Number.isFinite(principal) || principal < 0) {
    throw new Error("Amount must be a finite, non-negative number.");
  }
  if (!Number.isFinite(exchangeRate) || exchangeRate <= 0) {
    throw new Error("Exchange rate must be a finite positive number.");
  }
  const result = principal * exchangeRate;
  if (!Number.isFinite(result)) throw new Error("Converted amount exceeds the supported numeric range.");
  return result;
}

export function validateFxRate(rate, base, quote) {
  const value = Number(rate);
  if (!/^[A-Z]{3}$/.test(String(base)) || !/^[A-Z]{3}$/.test(String(quote))) {
    throw new Error("Currency codes must be three-letter ISO-style codes.");
  }
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("The rate provider did not return a finite positive exchange rate.");
  }
  return value;
}
