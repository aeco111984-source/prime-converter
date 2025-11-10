document.addEventListener("DOMContentLoaded", () => {
  const amountEl = document.getElementById("amount");
  const fromEl = document.getElementById("from");
  const toEl = document.getElementById("to");
  const headline = document.getElementById("headline");
  const ratesText = document.getElementById("rates");
  const interbankEl = document.getElementById("interbank");
  const brokerEl = document.getElementById("broker");
  const spreadEl = document.getElementById("spread");
  const timeEl = document.getElementById("time");

  const providerRows = {
    wise: document.getElementById("wise"),
    western: document.getElementById("western"),
    moneygram: document.getElementById("moneygram"),
    revolut: document.getElementById("revolut")
  };

  const rates = {
    USD: { EUR: 0.93, GBP: 0.78, JPY: 151.2, CAD: 1.36 },
    EUR: { USD: 1.07, GBP: 0.84, JPY: 162.5, CAD: 1.46 },
    GBP: { USD: 1.28, EUR: 1.19, JPY: 191.3, CAD: 1.74 },
    JPY: { USD: 0.0066, EUR: 0.0062, GBP: 0.0052, CAD: 0.0091 },
    CAD: { USD: 0.74, EUR: 0.68, GBP: 0.57, JPY: 109.3 }
  };

  const updateTime = () => {
    const now = new Date();
    timeEl.textContent = now.toUTCString().split(" ")[4];
  };

  const convert = () => {
    const base = fromEl.value;
    const quote = toEl.value;
    const amount = parseFloat(amountEl.value);
    if (!rates[base] || !rates[base][quote]) {
      alert("Conversion not available for this pair.");
      return;
    }

    const interbankRate = rates[base][quote];
    const brokerRate = interbankRate * (1 - 0.004);
    const spread = ((interbankRate - brokerRate) / interbankRate) * 100;

    const interbankTotal = (amount * interbankRate).toFixed(2);
    headline.textContent = `${amount} ${base} = ${interbankTotal} ${quote}`;
    ratesText.textContent = `1 ${base} = ${interbankRate.toFixed(4)} ${quote} | 1 ${quote} = ${(1/interbankRate).toFixed(4)} ${base}`;
    interbankEl.textContent = interbankRate.toFixed(4);
    brokerEl.textContent = brokerRate.toFixed(4);
    spreadEl.textContent = spread.toFixed(2) + "%";

    const providers = [
      { row: providerRows.wise, name: "Wise", rate: brokerRate*1.001, fee: 0.99 },
      { row: providerRows.western, name: "Western Union", rate: brokerRate*0.985, fee: 2.9 },
      { row: providerRows.moneygram, name: "MoneyGram", rate: brokerRate*0.982, fee: 1.99 },
      { row: providerRows.revolut, name: "Revolut", rate: brokerRate*1.002, fee: 0 }
    ];

    let best = providers.reduce((a,b)=>a.rate>b.rate?a:b);

    providers.forEach(p=>{
      const total = (amount*p.rate - p.fee).toFixed(2);
      p.row.children[1].textContent = p.rate.toFixed(4);
      p.row.children[2].textContent = p.fee.toFixed(2)+" "+base;
      p.row.children[3].textContent = total+" "+quote;
      p.row.classList.toggle("highlight", p.name===best.name);
    });

    updateTime();
  };

  document.getElementById("convert").addEventListener("click", convert);
  document.getElementById("swap").addEventListener("click", ()=>{
    const temp = fromEl.value; fromEl.value = toEl.value; toEl.value = temp; convert();
  });

  convert();
  updateTime();
});
