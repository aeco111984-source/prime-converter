document.addEventListener("DOMContentLoaded", () => {
  const amount = document.getElementById("amount");
  const from = document.getElementById("from");
  const to = document.getElementById("to");
  const interbank = document.getElementById("interbank");
  const broker = document.getElementById("broker");
  const spread = document.getElementById("spread");

  const convertBtn = document.getElementById("convert");
  const swapBtn = document.getElementById("swap");

  const providerList = document.getElementById("providers");

  // Mock conversion rates (real APIs later)
  const mockRates = {
    USD: { EUR: 0.93, GBP: 0.78, JPY: 151 },
    EUR: { USD: 1.07, GBP: 0.84, JPY: 162 },
    GBP: { USD: 1.28, EUR: 1.19, JPY: 191 },
  };

  convertBtn.addEventListener("click", () => {
    const amt = parseFloat(amount.value);
    const base = from.value;
    const quote = to.value;

    if (!mockRates[base] || !mockRates[base][quote]) {
      alert("Conversion pair not found (demo data only)");
      return;
    }

    const midRate = mockRates[base][quote];
    const brokerRate = midRate * (1 - 0.006); // 0.6% spread
    const diff = ((midRate - brokerRate) / midRate) * 100;

    const convertedInterbank = amt * midRate;
    const convertedBroker = amt * brokerRate;

    interbank.textContent = `${midRate.toFixed(4)} (${convertedInterbank.toFixed(2)} ${quote})`;
    broker.textContent = `${brokerRate.toFixed(4)} (${convertedBroker.toFixed(2)} ${quote})`;
    spread.textContent = `${diff.toFixed(2)}%`;

    // Update mock provider list
    providerList.innerHTML = `
      <li>Western Union: ${(brokerRate * 0.99).toFixed(4)}</li>
      <li>Wise: ${(brokerRate * 1.001).toFixed(4)}</li>
      <li>MoneyGram: ${(brokerRate * 0.98).toFixed(4)}</li>
      <li>Revolut: ${(brokerRate * 1.002).toFixed(4)}</li>
    `;
  });

  swapBtn.addEventListener("click", () => {
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
  });
});