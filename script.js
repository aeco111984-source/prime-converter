// XE-style converter: EUR->USD default, mock interbank refresh every 60s.
// Swap in your live feed by replacing getMid(base, quote).

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const amountEl = document.getElementById("amount");
  const fromEl = document.getElementById("from");
  const toEl = document.getElementById("to");
  const headlineEl = document.getElementById("headline");
  const lineA = document.getElementById("lineA");
  const lineB = document.getElementById("lineB");
  const interbankEl = document.getElementById("interbank");
  const brokerEl = document.getElementById("broker");
  const spreadEl = document.getElementById("spread");
  const timeEl = document.getElementById("time");
  const convertBtn = document.getElementById("convert");
  const swapBtn = document.getElementById("swap");

  // Provider rows
  const rows = [
    "wise","western","moneygram","revolut","remitly","xoom",
    "ofx","worldremit","currencyfair","skrill","paysend","instarem","remit2india"
  ].map(id => ({ id, el: document.getElementById(id) }));

  // Mock mid rates (symmetric by construction)
  const mid = {
    EUR: { USD: 1.0720, GBP: 0.8550, JPY: 162.50, CAD: 1.4600 },
    USD: { EUR: 0.9330, GBP: 0.7970, JPY: 151.70, CAD: 1.3600 },
    GBP: { EUR: 1.1696, USD: 1.2550, JPY: 191.30, CAD: 1.7200 },
    JPY: { EUR: 0.00615, USD: 0.00659, GBP: 0.00523, CAD: 0.01100 },
    CAD: { EUR: 0.6849, USD: 0.7350, GBP: 0.5814, JPY: 90.91 }
  };

  // Mock provider model (margin vs mid + fee in base currency)
  const providers = [
    { key:"wise",       name:"Wise",         marginPct:0.10, fee:0.99 },
    { key:"western",    name:"Western Union",marginPct:1.80, fee:2.90 },
    { key:"moneygram",  name:"MoneyGram",    marginPct:1.50, fee:1.99 },
    { key:"revolut",    name:"Revolut",      marginPct:0.20, fee:0.00 },
    { key:"remitly",    name:"Remitly",      marginPct:1.20, fee:1.99 },
    { key:"xoom",       name:"Xoom (PayPal)",marginPct:1.60, fee:2.99 },
    { key:"ofx",        name:"OFX",          marginPct:0.35, fee:0.00 },
    { key:"worldremit", name:"WorldRemit",   marginPct:1.10, fee:2.49 },
    { key:"currencyfair",name:"CurrencyFair",marginPct:0.45, fee:3.00 },
    { key:"skrill",     name:"Skrill",       marginPct:1.40, fee:1.99 },
    { key:"paysend",    name:"PaySend",      marginPct:0.90, fee:1.00 },
    { key:"instarem",   name:"InstaReM",     marginPct:0.60, fee:1.50 },
    { key:"remit2india",name:"Remit2India",  marginPct:1.30, fee:2.00 }
  ];

  // --- Helpers ---
  const nowGMT = () => new Date().toUTCString().split(" ")[4];
  function getMid(base, quote) {
    // jitter mid slightly to feel "live"
    const m = (mid[base] && mid[base][quote]) ? mid[base][quote] : null;
    if (!m) return null;
    const jitter = 1 + (Math.random() - 0.5) * 0.001; // ±0.05%
    return +(m * jitter).toFixed(6);
  }

  function fmt(n, dp=4){ return Number(n).toFixed(dp); }

  // --- Core compute ---
  function compute() {
    const base = fromEl.value;
    const quote = toEl.value;
    const amt = Math.max(0, parseFloat(amountEl.value || "0"));

    const m = getMid(base, quote);
    if (!m) { alert("Pair not available in demo."); return; }

    // Broker rate = mid * (1 - margin%)
    const brokerRate = m * (1 - 0.004); // 0.40% generic broker for headline
    const spreadPct = ((m - brokerRate) / m) * 100;

    const total = amt * m;

    // Headline + lines
    headlineEl.textContent = `${fmt(amt,2)} ${base} = ${fmt(total,2)} ${quote}`;
    lineA.textContent = `1 ${base} = ${fmt(m)} ${quote}`;
    lineB.textContent = `1 ${quote} = ${fmt(1/m)} ${base}`;
    interbankEl.textContent = fmt(m);
    brokerEl.textContent   = fmt(brokerRate);
    spreadEl.textContent   = fmt(spreadPct,2) + "%";
    timeEl.textContent = nowGMT();

    // Providers (best highlight)
    const rowsData = providers.map(p => {
      const rate = m * (1 - p.marginPct/100);
      const received = amt * rate - p.fee;
      return { ...p, rate, received };
    });
    const best = rowsData.reduce((a,b)=> a.received>b.received ? a : b, rowsData[0]);

    rowsData.forEach(r=>{
      const row = rows.find(x=>x.id===r.key)?.el;
      if (!row) return;
      row.children[0].textContent = providers.find(p=>p.key===r.key).name;
      row.children[1].textContent = fmt(r.rate);
      row.children[2].textContent = `${fmt(r.fee,2)} ${base}`;
      row.children[3].textContent = `${fmt(r.received,2)} ${quote}`;
      row.classList.toggle("highlight", r.key===best.key);
    });
  }

  // Events
  document.getElementById("convert").addEventListener("click", compute);
  document.getElementById("swap").addEventListener("click", ()=>{
    const t = fromEl.value; fromEl.value = toEl.value; toEl.value = t; compute();
  });

  // Defaults: EUR -> USD
  fromEl.value = "EUR";
  toEl.value   = "USD";

  // First paint + auto-refresh every 60s
  compute();
  setInterval(compute, 60000);
});