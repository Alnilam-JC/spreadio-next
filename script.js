const CURRENCIES = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪" },
  { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴" },
  { code: "DKK", name: "Danish Krone", flag: "🇩🇰" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
  { code: "PLN", name: "Polish Zloty", flag: "🇵🇱" },
  { code: "CZK", name: "Czech Koruna", flag: "🇨🇿" },
  { code: "HUF", name: "Hungarian Forint", flag: "🇭🇺" },
  { code: "RON", name: "Romanian Leu", flag: "🇷🇴" },
  { code: "ILS", name: "Israeli Shekel", flag: "🇮🇱" },
  { code: "THB", name: "Thai Baht", flag: "🇹🇭" },
  { code: "IDR", name: "Indonesian Rupiah", flag: "🇮🇩" },
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
  { code: "PHP", name: "Philippine Peso", flag: "🇵🇭" },
  { code: "ISK", name: "Icelandic Krona", flag: "🇮🇸" },
  { code: "BGN", name: "Bulgarian Lev", flag: "🇧🇬" },
];

const API_BASE = "https://api.frankfurter.dev/v1";

const fromSelect = document.getElementById("from-currency");
const toSelect = document.getElementById("to-currency");
const swapBtn = document.getElementById("swap-btn");
const amountSentInput = document.getElementById("amount-sent");
const amountReceivedInput = document.getElementById("amount-received");
const exchangeRateInput = document.getElementById("exchange-rate");
const dateInput = document.getElementById("trade-date");
const compareBtn = document.getElementById("compare-btn");
const btnLabel = compareBtn.querySelector(".btn-label");
const btnSpinner = compareBtn.querySelector(".btn-spinner");
const errorMsg = document.getElementById("error-msg");
const resultSection = document.getElementById("result-section");

function populateCurrencySelect(select, defaultCode) {
  select.innerHTML = "";
  CURRENCIES.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.code;
    opt.textContent = `${c.flag} ${c.code} — ${c.name}`;
    if (c.code === defaultCode) opt.selected = true;
    select.appendChild(opt);
  });
}
populateCurrencySelect(fromSelect, "GBP");
populateCurrencySelect(toSelect, "EUR");

const today = new Date();
dateInput.max = today.toISOString().split("T")[0];
dateInput.value = today.toISOString().split("T")[0];

swapBtn.addEventListener("click", () => {
  const a = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = a;
  swapBtn.classList.add("spin");
  setTimeout(() => swapBtn.classList.remove("spin"), 350);
  validateForm();
});

function readUserRate() {
  const sent = parseFloat(amountSentInput.value);
  const received = parseFloat(amountReceivedInput.value);
  const rate = parseFloat(exchangeRateInput.value);

  if (!(sent > 0)) return null;

  if (rate > 0) {
    return { sent, rate, received: received > 0 ? received : sent * rate };
  }
  if (received > 0) {
    return { sent, rate: received / sent, received };
  }
  return null;
}

function validateForm() {
  const userRate = readUserRate();
  const currenciesOk = fromSelect.value && toSelect.value && fromSelect.value !== toSelect.value;
  const dateOk = !!dateInput.value;
  const valid = !!userRate && currenciesOk && dateOk;
  compareBtn.disabled = !valid;
  return valid;
}

[amountSentInput, amountReceivedInput, exchangeRateInput, dateInput, fromSelect, toSelect].forEach((el) => {
  el.addEventListener("input", () => {
    hideError();
    validateForm();
  });
  el.addEventListener("change", () => {
    hideError();
    validateForm();
  });
});

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.hidden = false;
}
function hideError() {
  errorMsg.hidden = true;
}

function setLoading(loading) {
  compareBtn.disabled = loading || !validateForm();
  btnSpinner.hidden = !loading;
  btnLabel.textContent = loading ? "Comparing…" : "Compare";
}

function formatRate(n) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}
function formatMoney(n, code) {
  try {
    return n.toLocaleString(undefined, { style: "currency", currency: code, maximumFractionDigits: 2 });
  } catch {
    return `${n.toFixed(2)} ${code}`;
  }
}

function animateCount(el, from, to, formatter, duration = 800) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = from + (to - from) * eased;
    el.textContent = formatter(value);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

async function fetchInterbankRate(from, to, dateStr) {
  const isToday = dateStr === today.toISOString().split("T")[0];
  const path = isToday ? "latest" : dateStr;
  const url = `${API_BASE}/${path}?from=${from}&to=${to}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not reach the rates service. Please try again.");
  const data = await res.json();
  const rate = data.rates && data.rates[to];
  if (!rate) throw new Error(`No mid-market rate available for ${from} → ${to} on that date.`);
  return { rate, actualDate: data.date };
}

async function handleCompare() {
  hideError();
  const userRateData = readUserRate();
  const from = fromSelect.value;
  const to = toSelect.value;
  const dateStr = dateInput.value;

  if (!userRateData) {
    showError("Enter the amount you sent, plus either the amount received or the exchange rate.");
    return;
  }
  if (from === to) {
    showError("Choose two different currencies to compare.");
    return;
  }

  setLoading(true);
  try {
    const { rate: interbankRate, actualDate } = await fetchInterbankRate(from, to, dateStr);
    const spreadPct = ((interbankRate - userRateData.rate) / interbankRate) * 100;
    const idealReceived = userRateData.sent * interbankRate;
    const diffInToCurrency = idealReceived - userRateData.received;

    renderResult({
      from,
      to,
      userRate: userRateData.rate,
      interbankRate,
      spreadPct,
      diffInToCurrency,
      sentAmount: userRateData.sent,
      actualDate,
      requestedDate: dateStr,
    });
  } catch (err) {
    showError(err.message || "Something went wrong fetching the comparison.");
  } finally {
    setLoading(false);
  }
}

function renderResult(r) {
  const statYourRate = document.getElementById("stat-your-rate");
  const statMidRate = document.getElementById("stat-mid-rate");
  const spreadNumber = document.getElementById("spread-number");
  const spreadCaption = document.getElementById("spread-caption");
  const meterMarker = document.getElementById("meter-marker");
  const costSentence = document.getElementById("cost-sentence");
  const rateDateNote = document.getElementById("rate-date-note");

  statYourRate.textContent = `${formatRate(r.userRate)} ${r.to}`;
  statMidRate.textContent = `${formatRate(r.interbankRate)} ${r.to}`;

  const clampedSpread = Math.max(r.spreadPct, -0.5);
  animateCount(spreadNumber, 0, clampedSpread, (v) => `${v.toFixed(2)}%`);

  if (r.spreadPct <= 0) {
    spreadCaption.textContent = "your rate matched or beat the mid-market rate";
    costSentence.innerHTML = `Nice — you received about <strong>${formatMoney(Math.abs(r.diffInToCurrency), r.to)}</strong> more than the mid-market rate would have given you.`;
  } else {
    spreadCaption.textContent = "spread on this trade";
    costSentence.innerHTML = `That spread cost you approximately <strong>${formatMoney(r.diffInToCurrency, r.to)}</strong> on this transfer of ${formatMoney(r.sentAmount, r.from)}.`;
  }

  const meterPct = Math.min(Math.max(r.spreadPct, 0), 3) / 3 * 100;
  requestAnimationFrame(() => {
    meterMarker.style.left = `${meterPct}%`;
  });

  const dateNote = r.actualDate !== r.requestedDate
    ? `Mid-market rate as of ${r.actualDate} (nearest business day to ${r.requestedDate}), via ECB reference rates.`
    : `Mid-market rate as of ${r.actualDate}, via ECB reference rates.`;
  rateDateNote.textContent = dateNote;

  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

compareBtn.addEventListener("click", handleCompare);

validateForm();
