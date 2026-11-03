import { convertCurrencyAmount, validateFxRate } from './currency-engine.js';
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const currencies = [
    ['INR','Indian Rupee'],['USD','US Dollar'],['EUR','Euro'],['GBP','Pound Sterling'],
    ['JPY','Japanese Yen'],['CNY','Chinese Yuan'],['AED','UAE Dirham'],['SAR','Saudi Riyal'],
    ['SGD','Singapore Dollar'],['AUD','Australian Dollar'],['CAD','Canadian Dollar'],
    ['CHF','Swiss Franc'],['NZD','New Zealand Dollar'],['HKD','Hong Kong Dollar'],
    ['MYR','Malaysian Ringgit'],['THB','Thai Baht'],['ZAR','South African Rand'],
    ['KRW','South Korean Won'],['IDR','Indonesian Rupiah'],['QAR','Qatari Riyal'],
    ['KWD','Kuwaiti Dinar'],['BHD','Bahraini Dinar'],['OMR','Omani Rial'],
    ['LKR','Sri Lankan Rupee'],['NPR','Nepalese Rupee'],['PKR','Pakistani Rupee'],
    ['BRL','Brazilian Real'],['MXN','Mexican Peso'],['SEK','Swedish Krona'],
    ['NOK','Norwegian Krone'],['DKK','Danish Krone'],['PLN','Polish Zloty'],
    ['TRY','Turkish Lira']
  ];
  const baseCache = new Map();
  const pairFallbackCache = new Map();
  const CACHE_MS = 10 * 60 * 1000;
  let activeQuote = null;
  let requestId = 0;
  const amount = () => $('fxAmount').value.trim() === '' ? NaN : Number($('fxAmount').value);
  const safeDate = value => {
    if (!value) return null;
    const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };
  const formatMoney = (value, code) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: code }).format(value);
  async function requestJson(url) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error('FX data source returned HTTP ' + response.status + '.');
      return await response.json();
    } finally { window.clearTimeout(timeout); }
  }
  const formatRate = value => new Intl.NumberFormat('en-IN', {
    maximumSignificantDigits: 10
  }).format(value);
  const setStatus = (message, error = false) => {
    $('fxStatus').textContent = message;
    $('fxStatus').classList.toggle('error', error);
  };
  const currencyName = code => currencies.find(item => item[0] === code)?.[1] || code;
  const populate = () => {
    const html = currencies.map(([code, name]) => '<option value="' + code + '">' + code + ' — ' + name + '</option>').join('');
    $('fxFrom').innerHTML = html;
    $('fxTo').innerHTML = html;
    $('fxFrom').value = 'INR';
    $('fxTo').value = 'USD';
  };
  async function fetchPrimary(base, quote, force) {
    let cached = baseCache.get(base);
    let data = cached && !force && Date.now() - cached.receivedAt < CACHE_MS ? cached.data : null;
    if (!data) {
      const symbols = currencies.map(item => item[0]).filter(code => code !== base).join(',');
      const url = 'https://api.exchangerate.dev/v1/latest/' + encodeURIComponent(base) + '?symbols=' + encodeURIComponent(symbols);
      data = await requestJson(url);
      if (data?.result === 'error' || data?.base !== base || !data?.rates || typeof data.rates !== 'object') {
        throw new Error('The primary FX source returned an invalid base-currency response.');
      }
      cached = { data, receivedAt: Date.now() };
      baseCache.set(base, cached);
    }
    const rate = validateFxRate(data?.rates?.[quote], base, quote);
    const source = data?.sources?.[quote] || data?.source || 'indicative';
    const effectiveAt = data?.effective_at?.[quote] || data?.data_updated_at || data?.timestamp || null;
    return {
      base, quote, rate, provider: 'exchangerate.dev', source,
      session: data?.market_session || 'not supplied',
      stale: Boolean(data?.stale?.[quote]),
      effectiveAt, receivedAt: cached?.receivedAt || Date.now(), fallback: false,
      derived: Array.isArray(data?.derived_symbols) && data.derived_symbols.includes(quote)
    };
  }
  async function fetchFallback(base, quote) {
    const cacheKey = base + ':' + quote;
    const cached = pairFallbackCache.get(cacheKey);
    if (cached && Date.now() - cached.receivedAt < CACHE_MS) return cached;
    const url = 'https://api.frankfurter.dev/v2/rate/' + encodeURIComponent(base.toLowerCase()) + '/' + encodeURIComponent(quote.toLowerCase());
    const data = await requestJson(url);
    const rate = validateFxRate(data?.rate, base, quote);
    const quoteData = {
      base, quote, rate, provider: 'Frankfurter', source: 'daily_reference',
      session: 'daily reference', stale: false,
      effectiveAt: data?.date || null, receivedAt: Date.now(), fallback: true
    };
    pairFallbackCache.set(cacheKey, quoteData);
    return quoteData;
  }
  async function loadQuote(force = false) {
    const id = ++requestId;
    const base = $('fxFrom').value;
    const quote = $('fxTo').value;
    $('fxRefresh').disabled = true;
    $('fxCopy').disabled = true;
    setStatus('Retrieving the latest available ' + base + '/' + quote + ' observation…');
    if (base === quote) {
      activeQuote = { base, quote, rate: 1, provider: 'Identity conversion', source: 'identity', session: 'not applicable', stale: false, effectiveAt: new Date().toISOString(), fallback: false };
      render();
      $('fxRefresh').disabled = false;
      return;
    }
    let result;
    try {
      try {
        result = await fetchPrimary(base, quote, force);
      } catch (primaryError) {
        result = await fetchFallback(base, quote);
        result.primaryError = primaryError.message;
      }
      if (id !== requestId) return;
      activeQuote = result;
      render();
      $('fxCopy').disabled = false;
      if (result.fallback) {
        setStatus('Live indicative source is unavailable. Showing a clearly labelled daily reference rate instead.');
      } else if (result.stale) {
        setStatus('The provider marked this observation as stale. Treat it as a reference only.', true);
      } else {
        setStatus('Rate loaded successfully. Amounts are recalculated locally; refresh to request a newer observation.');
      }
    } catch (error) {
      if (id !== requestId) return;
      activeQuote = null;
      $('fxConverted').textContent = '—';
      $('fxResultAmount').textContent = 'Rate unavailable';
      $('fxPairRate').textContent = 'No verified rate was returned for this pair.';
      $('fxSource').textContent = 'Source: unavailable';
      $('fxUpdated').textContent = 'Effective time: —';
      $('fxSession').textContent = 'Market session: —';
      $('fxFreshness').textContent = 'Freshness: unknown';
      setStatus('Could not retrieve a verified rate. Check your connection and try again. ' + error.message, true);
    } finally {
      if (id === requestId) $('fxRefresh').disabled = false;
    }
  }
  function render() {
    if (!activeQuote) return;
    const value = amount();
    const validAmount = Number.isFinite(value) && value >= 0;
    const converted = validAmount ? convertCurrencyAmount(value, activeQuote.rate) : NaN;
    $('fxConverted').textContent = validAmount ? formatMoney(converted, activeQuote.quote) : 'Enter a valid non-negative amount';
    $('fxResultAmount').textContent = '1 ' + activeQuote.base + ' = ' + formatRate(activeQuote.rate) + ' ' + activeQuote.quote;
    $('fxPairRate').textContent = currencyName(activeQuote.base) + ' to ' + currencyName(activeQuote.quote) + ' · ' + activeQuote.base + '/' + activeQuote.quote;
    let sourceLabel = activeQuote.provider;
    if (activeQuote.source === 'live') sourceLabel += ' · indicative market feed (15-minute delay)';
    else if (activeQuote.source === 'ecb_daily') sourceLabel += ' · ECB daily reference';
    else if (activeQuote.source === 'market_daily') sourceLabel += ' · daily market close';
    else if (activeQuote.source === 'daily_reference') sourceLabel += ' · daily reference';
    if (activeQuote.derived) sourceLabel += ' · cross-rate derived';
    $('fxSource').textContent = 'Source: ' + sourceLabel;
    const rawEffective = activeQuote.effectiveAt;
    const dateOnly = typeof rawEffective === 'string' && rawEffective.length === 10 && rawEffective[4] === '-' && rawEffective[7] === '-' && Number.isFinite(Date.parse(rawEffective));
    const effective = safeDate(rawEffective);
    const isDaily = activeQuote.fallback || dateOnly || ['ecb_daily', 'market_daily', 'daily_reference'].includes(activeQuote.source);
    $('fxUpdated').textContent = 'Effective ' + (dateOnly && effective
      ? 'date: ' + effective.toLocaleDateString('en-IN', { dateStyle: 'medium', timeZone: 'UTC' }) + ' (date only)'
      : effective ? 'time: ' + effective.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }) + ' IST'
      : 'time: not supplied');
    $('fxSession').textContent = 'Market session: ' + activeQuote.session;
    const age = effective && !isDaily ? Math.max(0, Date.now() - effective.getTime()) : null;
    $('fxFreshness').textContent = activeQuote.stale ? 'Freshness: stale' : isDaily ? 'Freshness: daily reference' : age === null ? 'Freshness: not supplied' : 'Freshness: ' + (age < 3600000 ? 'under 1 hour' : Math.floor(age / 3600000) + ' hour(s)');
    $('fxCopy').disabled = !validAmount;
  }
  $('fxAmount').addEventListener('input', render);
  $('fxFrom').addEventListener('change', () => loadQuote());
  $('fxTo').addEventListener('change', () => loadQuote());
  $('fxSwap').addEventListener('click', () => {
    const from = $('fxFrom').value;
    $('fxFrom').value = $('fxTo').value;
    $('fxTo').value = from;
    loadQuote();
  });
  $('fxRefresh').addEventListener('click', () => loadQuote(true));
  $('fxCopy').addEventListener('click', async () => {
    if (!activeQuote || !Number.isFinite(amount()) || amount() < 0) return;
    const text = amount() + ' ' + activeQuote.base + ' = ' + convertCurrencyAmount(amount(), activeQuote.rate) + ' ' + activeQuote.quote +
      ' | 1 ' + activeQuote.base + ' = ' + activeQuote.rate + ' ' + activeQuote.quote +
      ' | Source: ' + activeQuote.provider + ' | Effective: ' + (activeQuote.effectiveAt || 'not supplied');
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Conversion and rate evidence copied.');
    } catch {
      setStatus('Clipboard access is unavailable in this browser. Select and copy the displayed result.', true);
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && activeQuote && Date.now() - activeQuote.receivedAt >= 15 * 60 * 1000) loadQuote();
  });
  window.setInterval(() => {
    if (!document.hidden && activeQuote && Date.now() - activeQuote.receivedAt >= 15 * 60 * 1000) loadQuote();
  }, 60 * 1000);
  populate();
  loadQuote();
})();