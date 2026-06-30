import { useState, useEffect } from "react";
import ToolLayout from "../../components/ToolLayout";

// Offline Fallback Rates (Base USD)
const FALLBACK_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  INR: 83.5,
  JPY: 158.0,
  AUD: 1.5,
  CAD: 1.37,
  CNY: 7.25,
  CHF: 0.89,
  SGD: 1.35
};

const CURRENCY_NAMES = {
  USD: "US Dollar ($)",
  EUR: "Euro (€)",
  GBP: "British Pound (£)",
  INR: "Indian Rupee (₹)",
  JPY: "Japanese Yen (¥)",
  AUD: "Australian Dollar (A$)",
  CAD: "Canadian Dollar (C$)",
  CNY: "Chinese Yuan (¥)",
  CHF: "Swiss Franc (CHF)",
  SGD: "Singapore Dollar (S$)"
};

function CurrencyConverter() {
  const [rates, setRates] = useState(FALLBACK_RATES);
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("Offline Fallback");

  useEffect(() => {
    async function fetchLiveRates() {
      setLoading(true);
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        if (data && data.rates) {
          const loadedRates = {};
          Object.keys(FALLBACK_RATES).forEach(code => {
            if (data.rates[code]) {
              loadedRates[code] = data.rates[code];
            } else {
              loadedRates[code] = FALLBACK_RATES[code];
            }
          });
          setRates(loadedRates);
          setLastUpdated(new Date(data.time_last_update_utc).toLocaleDateString() + " (Live)");
        }
      } catch (err) {
        console.warn("Using offline fallback rates.", err);
        setLastUpdated("Offline Fallback Rates");
      } finally {
        setLoading(false);
      }
    }
    fetchLiveRates();
  }, []);

  const convertedValue = (() => {
    const val = parseFloat(amount);
    if (Number.isNaN(val)) return 0;
    // Convert to USD first, then to target currency
    const inUsd = val / rates[fromCurrency];
    return inUsd * rates[toCurrency];
  })();

  return (
    <ToolLayout
      toolId="currency-converter"
      title="Currency Converter"
      description="Convert foreign exchange rates in real-time, fetch live market updates, and run offline translations client-side."
      path="/tools/currency-converter"
      category="unit-converter"
      categoryPath="/?cat=unit-converter"
    >
      <div className="tool-box" style={{ maxWidth: "500px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "12px", color: "var(--text-secondary)" }}>
          <span>Rates Source: <strong>{lastUpdated}</strong></span>
          {loading && <span style={{ color: "var(--primary-light)" }}>🔄 Fetching rates...</span>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Amount input */}
          <div>
            <label className="label" htmlFor="curr-amt">Amount to Convert</label>
            <input
              id="curr-amt"
              type="number"
              className="input-field"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 100"
            />
          </div>

          {/* Senders and Receivers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr", gap: "12px", alignItems: "center" }}>
            
            <div>
              <label className="label" htmlFor="curr-from">From</label>
              <select id="curr-from" className="input-field" value={fromCurrency} onChange={e => setFromCurrency(e.target.value)}>
                {Object.keys(rates).map(code => (
                  <option key={code} value={code}>{code} - {CURRENCY_NAMES[code]}</option>
                ))}
              </select>
            </div>

            <button
              className="btn-secondary"
              style={{
                marginTop: "20px",
                height: "38px",
                width: "38px",
                padding: 0,
                justifyContent: "center",
                borderRadius: "50%",
                fontSize: "16px"
              }}
              onClick={() => {
                const temp = fromCurrency;
                setFromCurrency(toCurrency);
                setToCurrency(temp);
              }}
            >
              🔄
            </button>

            <div>
              <label className="label" htmlFor="curr-to">To</label>
              <select id="curr-to" className="input-field" value={toCurrency} onChange={e => setToCurrency(e.target.value)}>
                {Object.keys(rates).map(code => (
                  <option key={code} value={code}>{code} - {CURRENCY_NAMES[code]}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Results display */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "20px",
            textAlign: "center",
            marginTop: "10px"
          }}>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "6px" }}>
              {amount || "0"} {fromCurrency} equals
            </div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "var(--primary-light)" }}>
              {convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {toCurrency}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "10px" }}>
              1 {fromCurrency} = {(rates[toCurrency] / rates[fromCurrency]).toFixed(4)} {toCurrency}
            </div>
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}

export default CurrencyConverter;
export { FALLBACK_RATES };
