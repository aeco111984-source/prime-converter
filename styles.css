document.addEventListener("DOMContentLoaded", () => {
  const amountEl = document.getElementById("amount");
  const fromEl = document.getElementById("from");
  const toEl = document.getElementById("to");
  const headlineEl = document.getElementById("headline");
  const ratesEl = document.getElementById("rates");
  const interbankEl = document.getElementById("interbank");
  const brokerEl = document.getElementById("broker");
  const spreadEl = document.getElementById("spread");
  const providerTable = document.getElementById("providers");
  const timeEl = document.getElementById("time");

  const rates = {
    USD: { EUR: 0.93, GBP: 0.78, JPY: 151.2, CAD: 1.36 },
    EUR: { USD: 1.07, GBP: 0.84, JPY: 162.5, CAD: 1.46 },
    GBP: { USD: 1.28, EUR: 1.19, JPY: 191.3, CAD: 1.74 },
    JPY: { USD: 0.0066, EUR: 0.0062, GBP: 0.0052, CAD: 0.0091 },
    CAD: { USD: 0.74, EUR: 0.68, GBP: 0.57, JPY: 109.3 },
  };

  function updateTime() {
    const now = new Date();
    timeEl.textContent = now.toUTCString().split(" ")[4];
  }

  function convert() {
    const amount = parseFloat(amountEl.value);
    const base = fromEl.value;
    const quote = toEl.value;

    if (!rates[base] || !rates[base][quote]) {
      alert("Conversion not available for this pair.");
      return;
    }

    const interbankRate = rates[base][quote];
    const brokerRate = interbankRate * (1 - 0.004);
    const spread = ((interbankRate - brokerRate) / interbankRate) * 100;

    const interbankTotal = (amount * interbankRate).toFixed(2);
    const brokerTotal = (amount * brokerRate).toFixed(2);

    headlineEl.textContent = `${amount} ${base} = ${interbankTotal} ${quote}`;
    ratesEl.textContent = `1 ${base} = ${interbankRate.toFixed(4)} ${quote} | 1 ${quote} = ${(1 / interbankRate).toFixed(4)} ${base}`;
    interbankEl.textContent = interbankRate.toFixed(4);
    brokerEl.textContent = brokerRate.toFixed(4);
    spreadEl.textContent = spread.toFixed(2) + "%";

    const providers = [
      { id: "wise", name: "Wise", rate: brokerRate * 1.001, fee: 0.99 },
      { id: "western", name: "Western Union", rate: brokerRate * 0.985, fee: 2.90 },
      { id: "moneygram", name: "MoneyGram", rate: brokerRate * 0.982, fee: 1.99 },
      { id: "revolut", name: "Revolut", rate: brokerRate * 1.002, fee: 0 },
    ];

    let best = providers.reduce((a, b) => (a.rate > b.rate ? a : b));

    providers.forEach(p => {
      const row = document.getElementById(p.id);
      const total = (amount * p.rate - p.fee).toFixed(2);
      row.children[1].textContent = p.rate.toFixed(4);
      row.children[2].textContent = p.fee.toFixed(2) + " " + base;
      row.children[3].textContent = total + " " + quote;
      row.style.background = p.id === best.id ? "rgba(0,61,153,0.1)" : "transparent";
    });

    updateTime();
  }

  document.getElementById("convert").addEventListener("click", convert);
  document.getElementById("swap").addEventListener("click", () => {
    const temp = fromEl.value;
    fromEl.value = toEl.value;
    toEl.value = temp;
    convert();
  });

  convert();
  updateTime();
});