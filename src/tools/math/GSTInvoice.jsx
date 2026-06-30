// GSTInvoice.jsx — GST Invoice Generator (Zoho-style)
import { useState, useEffect, useRef } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
];

const GST_RATES = [0, 3, 5, 12, 18, 28];

const EMPTY_ITEM = () => ({
  id: Date.now() + Math.random(),
  description: "",
  hsn: "",
  qty: 1,
  rate: 0,
  taxRate: 18,
  cess: 0,
});

function fmt(n) {
  return (parseFloat(n) || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function numberToWords(num) {
  const a = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
    "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen",
    "Seventeen","Eighteen","Nineteen"];
  const b = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  if (num === 0) return "Zero";
  if (num < 0) return "Minus " + numberToWords(-num);
  let str = "";
  if (Math.floor(num / 10000000) > 0) { str += numberToWords(Math.floor(num / 10000000)) + " Crore "; num %= 10000000; }
  if (Math.floor(num / 100000) > 0) { str += numberToWords(Math.floor(num / 100000)) + " Lakh "; num %= 100000; }
  if (Math.floor(num / 1000) > 0) { str += numberToWords(Math.floor(num / 1000)) + " Thousand "; num %= 1000; }
  if (Math.floor(num / 100) > 0) { str += numberToWords(Math.floor(num / 100)) + " Hundred "; num %= 100; }
  if (num > 0) {
    if (num < 20) str += a[num];
    else str += b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
  }
  return str.trim();
}

export default function GSTInvoice() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("gst-invoice"); }, [trackTool]);

  // Seller info
  const [seller, setSeller] = useState({
    company: "", name: "", gstin: "", address: "", city: "", state: "Gujarat", country: "India"
  });
  // Buyer info
  const [buyer, setBuyer] = useState({
    company: "", gstin: "", address: "", city: "", state: "Maharashtra", country: "India"
  });
  // Invoice meta
  const [invoiceNo, setInvoiceNo] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState([EMPTY_ITEM()]);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("Payment due within 30 days.");
  const [theme, setTheme] = useState("#6c63ff");
  const [template, setTemplate] = useState("modern");
  const [logo, setLogo] = useState(null);
  const logoRef = useRef();

  const TEMPLATES = [
    { id:"modern",    label:"Modern",    preview:"▐█▌" },
    { id:"classic",   label:"Classic",   preview:"≡" },
    { id:"minimal",   label:"Minimal",   preview:"—" },
    { id:"bold",      label:"Bold",      preview:"◼" },
    { id:"executive", label:"Executive", preview:"✦" },
    { id:"elegant",   label:"Elegant",   preview:"│" },
    { id:"corporate", label:"Corporate", preview:"▬" },
    { id:"vibrant",   label:"Vibrant",   preview:"◈" },
    { id:"sunset",    label:"Sunset",    preview:"🌅" },
    { id:"ocean",     label:"Ocean",     preview:"🌊" },
    { id:"dark",      label:"Dark",      preview:"🌙" },
    { id:"retro",     label:"Retro",     preview:"📜" },
  ];

  // Determine tax type
  const isIntrastate = seller.state === buyer.state;
  const placeOfSupply = buyer.state;

  // Item calculations
  function updateItem(id, field, value) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));
  }
  function addItem() { setItems(prev => [...prev, EMPTY_ITEM()]); }
  function removeItem(id) { setItems(prev => prev.filter(it => it.id !== id)); }

  // Totals
  const computed = items.map(it => {
    const amount = (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0);
    const taxAmt = (amount * (parseFloat(it.taxRate) || 0)) / 100;
    const cessAmt = (amount * (parseFloat(it.cess) || 0)) / 100;
    return { ...it, amount, taxAmt, cessAmt, total: amount + taxAmt + cessAmt };
  });

  const subTotal = computed.reduce((s, i) => s + i.amount, 0);
  const totalTax = computed.reduce((s, i) => s + i.taxAmt, 0);
  const totalCess = computed.reduce((s, i) => s + i.cessAmt, 0);
  const grandTotal = subTotal + totalTax + totalCess;

  // Tax breakdown by rate
  const taxBreakdown = {};
  computed.forEach(it => {
    const key = it.taxRate;
    if (!taxBreakdown[key]) taxBreakdown[key] = { base: 0, tax: 0 };
    taxBreakdown[key].base += it.amount;
    taxBreakdown[key].tax += it.taxAmt;
  });

  function handleLogo(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setLogo(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handlePrint() { window.print(); }

  return (
    <div className="p-0 fade-in">
      <SEOHead
        title="GST Invoice Generator"
        description="Free GST Invoice Generator for India. Generate Tax Invoices with IGST/CGST/SGST, HSN codes, GSTIN validation and print/download support."
        path="/tools/gst-invoice"
      />
      <div className="max-w-[1400px] mx-auto px-5 pt-6 pb-12">
        <Breadcrumb toolName="GST Invoice Generator" category="Finance" categoryPath="/?cat=finance" />
        <h1 className="tool-title">🧾 GST Invoice Generator</h1>
        <p className="tool-description">
          Create professional GST-compliant Tax Invoices with IGST / CGST+SGST, HSN/SAC codes, and print/download support.
        </p>

        <div className="grid gap-6 items-start mt-6 grid-cols-1 min-[1100px]:grid-cols-[1fr_520px]">
          {/* ── LEFT: Editor ── */}
          <div className="gst-editor">

            {/* Template + Theme picker */}
            <div className="bg-bg-card border border-border rounded-[14px] p-5 mb-4">
              <div className="text-[14px] font-bold text-text-secondary uppercase tracking-[0.06em] mb-4">🗂️ Invoice Template</div>
              <div className="flex gap-[10px] flex-wrap">
                {TEMPLATES.map(t => (
                  <button key={t.id}
                    className={`flex flex-col items-center gap-[5px] px-4 py-[10px] border-2 rounded-[10px] bg-black/15 cursor-pointer transition-all duration-200 min-w-[72px] hover:border-primary hover:-translate-y-0.5 ${template === t.id ? "bg-primary/10 border-primary" : "border-border"}`}
                    style={template === t.id ? { borderColor: theme, boxShadow: `0 0 0 2px ${theme}44` } : {}}
                    onClick={() => setTemplate(t.id)}>
                    <span className="text-[20px] leading-none" style={{ color: theme }}>{t.preview}</span>
                    <span className="text-[11px] font-semibold text-text-secondary">{t.label}</span>
                  </button>
                ))}
              </div>
              <div className="text-[14px] font-bold text-text-secondary uppercase tracking-[0.06em] mb-4" style={{ marginTop:16 }}>🎨 Accent Color</div>
              <div className="flex gap-[10px] items-center flex-wrap">
                {["#6c63ff","#e05c0a","#0ea5e9","#10b981","#ef4444","#f59e0b"].map(c => (
                  <button key={c} className={`w-[30px] h-[30px] rounded-full border-3 cursor-pointer transition-all duration-150 hover:scale-115 ${theme===c?"border-white scale-120 shadow-[0_0_0_2px_rgba(255,255,255,0.3),0_0_12px_rgba(0,0,0,0.4)]":"border-transparent"}`}
                    style={{ background: c }} onClick={() => setTheme(c)} title={c} />
                ))}
                <input type="color" value={theme} onChange={e => setTheme(e.target.value)} className="w-[30px] h-[30px] rounded-full border-none cursor-pointer p-0 bg-none" />
              </div>
            </div>

            {/* Logo + Invoice title */}
            <div className="bg-bg-card border border-border rounded-[14px] p-5 mb-4">
              <div className="text-[14px] font-bold text-text-secondary uppercase tracking-[0.06em] mb-4">🏢 Company & Invoice Info</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Logo</label>
                  <div className="w-[110px] h-[80px] border-2 border-dashed border-border rounded-[10px] flex items-center justify-center cursor-pointer text-text-muted text-[12px] transition-colors duration-200 hover:border-primary" onClick={() => logoRef.current.click()}>
                    {logo ? <img src={logo} alt="logo" className="w-full h-full object-contain rounded-lg" /> : <span>📤 Upload Logo</span>}
                  </div>
                  <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogo} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label className="block text-[13px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Invoice Number</label>
                    <input className="w-full py-[9px] px-3 bg-black/20 border border-border rounded-lg text-text-primary text-[13px] outline-none transition-colors duration-200 box-border focus:border-primary" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Invoice Date</label>
                    <input type="date" className="w-full py-[9px] px-3 bg-black/20 border border-border rounded-lg text-text-primary text-[13px] outline-none transition-colors duration-200 box-border focus:border-primary" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Due Date (optional)</label>
                    <input type="date" className="w-full py-[9px] px-3 bg-black/20 border border-border rounded-lg text-text-primary text-[13px] outline-none transition-colors duration-200 box-border focus:border-primary" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Seller */}
            <div className="bg-bg-card border border-border rounded-[14px] p-5 mb-4">
              <div className="text-[14px] font-bold text-text-secondary uppercase tracking-[0.06em] mb-4">👤 Your Details (Seller)</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  ["Company Name", "company", "text"],
                  ["Your Name", "name", "text"],
                  ["GSTIN", "gstin", "text"],
                  ["Address", "address", "text"],
                  ["City", "city", "text"],
                ].map(([lbl, key, type]) => (
                  <div key={key}>
                    <label className="block text-[13px] font-semibold text-text-secondary uppercase tracking-wider mb-2">{lbl}</label>
                    <input className="w-full py-[9px] px-3 bg-black/20 border border-border rounded-lg text-text-primary text-[13px] outline-none transition-colors duration-200 box-border focus:border-primary" type={type} value={seller[key]}
                      onChange={e => setSeller(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={lbl} />
                  </div>
                ))}
                <div>
                  <label className="block text-[13px] font-semibold text-text-secondary uppercase tracking-wider mb-2">State</label>
                  <select className="w-full py-[9px] px-3 bg-black/20 border border-border rounded-lg text-text-primary text-[13px] outline-none transition-colors duration-200 box-border focus:border-primary" value={seller.state}
                    onChange={e => setSeller(p => ({ ...p, state: e.target.value }))}>
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Buyer */}
            <div className="bg-bg-card border border-border rounded-[14px] p-5 mb-4">
              <div className="text-[14px] font-bold text-text-secondary uppercase tracking-[0.06em] mb-4">🏬 Bill To (Buyer)</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  ["Client's Company", "company", "text"],
                  ["Client's GSTIN", "gstin", "text"],
                  ["Address", "address", "text"],
                  ["City", "city", "text"],
                ].map(([lbl, key, type]) => (
                  <div key={key}>
                    <label className="block text-[13px] font-semibold text-text-secondary uppercase tracking-wider mb-2">{lbl}</label>
                    <input className="w-full py-[9px] px-3 bg-black/20 border border-border rounded-lg text-text-primary text-[13px] outline-none transition-colors duration-200 box-border focus:border-primary" type={type} value={buyer[key]}
                      onChange={e => setBuyer(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={lbl} />
                  </div>
                ))}
                <div>
                  <label className="block text-[13px] font-semibold text-text-secondary uppercase tracking-wider mb-2">State (Place of Supply)</label>
                  <select className="w-full py-[9px] px-3 bg-black/20 border border-border rounded-lg text-text-primary text-[13px] outline-none transition-colors duration-200 box-border focus:border-primary" value={buyer.state}
                    onChange={e => setBuyer(p => ({ ...p, state: e.target.value }))}>
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-[14px] py-[10px] px-[14px] border-[1.5px] rounded-lg text-[12px] font-semibold" style={{ borderColor: theme, color: theme }}>
                {isIntrastate
                  ? `🔵 Intrastate Supply — CGST + SGST applies (Place of Supply: ${placeOfSupply})`
                  : `🟠 Interstate Supply — IGST applies (Place of Supply: ${placeOfSupply})`}
              </div>
            </div>

            {/* Items */}
            <div className="bg-bg-card border border-border rounded-[14px] p-5 mb-4">
              <div className="text-[14px] font-bold text-text-secondary uppercase tracking-[0.06em] mb-4">📦 Line Items</div>
              <div className="overflow-x-auto mb-3">
                <table className="w-full border-collapse min-w-[650px]">
                  <thead>
                    <tr style={{ background: theme }}>
                      <th className="py-[10px] px-[10px] text-white text-[12px] font-bold text-left whitespace-nowrap">Description / HSN-SAC</th>
                      <th className="py-[10px] px-[10px] text-white text-[12px] font-bold text-left whitespace-nowrap">Qty</th>
                      <th className="py-[10px] px-[10px] text-white text-[12px] font-bold text-left whitespace-nowrap">Rate (₹)</th>
                      <th className="py-[10px] px-[10px] text-white text-[12px] font-bold text-left whitespace-nowrap">GST %</th>
                      <th className="py-[10px] px-[10px] text-white text-[12px] font-bold text-left whitespace-nowrap">Cess %</th>
                      <th className="py-[10px] px-[10px] text-white text-[12px] font-bold text-left whitespace-nowrap">Amount (₹)</th>
                      <th className="py-[10px] px-[10px] text-white text-[12px] font-bold text-left whitespace-nowrap"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {computed.map((it, idx) => (
                      <tr key={it.id} className={idx % 2 === 0 ? "bg-white/[0.02]" : "bg-black/10"}>
                        <td className="py-2 px-[6px] align-middle">
                          <input className="w-full py-[6px] px-2 bg-black/20 border border-border rounded-md text-text-primary text-[12px] outline-none box-border focus:border-primary" placeholder="Item description"
                            value={it.description} onChange={e => updateItem(it.id, "description", e.target.value)} />
                          <input className="w-full py-[6px] px-2 bg-black/20 border border-border rounded-md text-text-primary text-[12px] outline-none box-border focus:border-primary mt-1 text-text-muted text-[11px]" placeholder="HSN / SAC code"
                            value={it.hsn} onChange={e => updateItem(it.id, "hsn", e.target.value)} />
                        </td>
                        <td className="py-2 px-[6px] align-middle">
                          <input type="number" className="w-full py-[6px] px-2 bg-black/20 border border-border rounded-md text-text-primary text-[12px] outline-none box-border focus:border-primary max-w-[70px] text-right" min="0"
                            value={it.qty} onChange={e => updateItem(it.id, "qty", e.target.value)} />
                        </td>
                        <td className="py-2 px-[6px] align-middle">
                          <input type="number" className="w-full py-[6px] px-2 bg-black/20 border border-border rounded-md text-text-primary text-[12px] outline-none box-border focus:border-primary max-w-[70px] text-right" min="0"
                            value={it.rate} onChange={e => updateItem(it.id, "rate", e.target.value)} />
                        </td>
                        <td className="py-2 px-[6px] align-middle">
                          <select className="w-full py-[6px] px-2 bg-black/20 border border-border rounded-md text-text-primary text-[12px] outline-none box-border focus:border-primary" value={it.taxRate}
                            onChange={e => updateItem(it.id, "taxRate", parseFloat(e.target.value))}>
                            {GST_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                          </select>
                        </td>
                        <td className="py-2 px-[6px] align-middle">
                          <input type="number" className="w-full py-[6px] px-2 bg-black/20 border border-border rounded-md text-text-primary text-[12px] outline-none box-border focus:border-primary max-w-[70px] text-right" min="0"
                            value={it.cess} onChange={e => updateItem(it.id, "cess", e.target.value)} />
                        </td>
                        <td className="py-2 px-[6px] align-middle font-mono text-[13px] font-semibold whitespace-nowrap text-text-primary">₹{fmt(it.amount)}</td>
                        <td className="py-2 px-[6px] align-middle">
                          {items.length > 1 && (
                            <button className="bg-red-500/15 border border-red-500/30 text-red-500 rounded-[5px] cursor-pointer py-1 px-2 text-[12px] transition-colors duration-150 hover:bg-red-500/30" onClick={() => removeItem(it.id)} title="Remove">✕</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="btn-secondary mt-1 text-[13px]" onClick={addItem}>＋ Add Item</button>
            </div>

            {/* Notes & Terms */}
            <div className="bg-bg-card border border-border rounded-[14px] p-5 mb-4">
              <div className="text-[14px] font-bold text-text-secondary uppercase tracking-[0.06em] mb-4">📝 Notes & Terms</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Notes / Remarks</label>
                  <textarea className="w-full py-[9px] px-3 bg-black/20 border border-border rounded-lg text-text-primary text-[13px] outline-none transition-colors duration-200 box-border focus:border-primary" rows={3} value={notes}
                    onChange={e => setNotes(e.target.value)} placeholder="Thank you for your business!" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Terms & Conditions</label>
                  <textarea className="w-full py-[9px] px-3 bg-black/20 border border-border rounded-lg text-text-primary text-[13px] outline-none transition-colors duration-200 box-border focus:border-primary" rows={3} value={terms}
                    onChange={e => setTerms(e.target.value)} placeholder="Payment terms, warranty, etc." />
                </div>
              </div>
            </div>

            <button className="btn-primary w-full mt-1 p-[14px] text-[15px]" onClick={handlePrint}>🖨️ Print / Download Invoice</button>
          </div>

          {/* ── RIGHT: Preview ── */}
          <div className="relative">
            <div className="sticky top-20">
              <div className="text-[11px] font-bold tracking-[0.1em] text-text-muted uppercase mb-[10px] text-center">Live Preview — {TEMPLATES.find(t=>t.id===template)?.label} Template</div>
              <div className="bg-[#2a2a3a] rounded-[10px] p-4 flex justify-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]">
                <InvoicePreview
                  template={template} theme={theme} logo={logo}
                  seller={seller} buyer={buyer} invoiceNo={invoiceNo}
                  invoiceDate={invoiceDate} dueDate={dueDate}
                  computed={computed} subTotal={subTotal} totalCess={totalCess}
                  grandTotal={grandTotal} taxBreakdown={taxBreakdown}
                  isIntrastate={isIntrastate} placeOfSupply={placeOfSupply}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared Tax Rows Helper ─── */
function TaxRows({ taxBreakdown, isIntrastate, totalCess, subTotal, grandTotal, fmt }) {
  return (
    <>
      <div className="flex justify-between py-1 text-[11px] text-gray-700 border-b border-gray-100"><span>Sub Total</span><span>₹{fmt(subTotal)}</span></div>
      {Object.entries(taxBreakdown).map(([rate, { tax }]) =>
        isIntrastate ? (
          <div key={`c${rate}`} className="flex justify-between py-1 text-[11px] text-gray-700 border-b border-gray-100"><span>CGST @ {rate/2}%</span><span>₹{fmt(tax/2)}</span></div>
        ) : (
          <div key={`i${rate}`} className="flex justify-between py-1 text-[11px] text-gray-700 border-b border-gray-100"><span>IGST @ {rate}%</span><span>₹{fmt(tax)}</span></div>
        )
      )}
      {isIntrastate && Object.entries(taxBreakdown).map(([rate, { tax }]) => (
        <div key={`s${rate}`} className="flex justify-between py-1 text-[11px] text-gray-700 border-b border-gray-100"><span>SGST @ {rate/2}%</span><span>₹{fmt(tax/2)}</span></div>
      ))}
      {totalCess > 0 && <div className="flex justify-between py-1 text-[11px] text-gray-700 border-b border-gray-100"><span>Cess</span><span>₹{fmt(totalCess)}</span></div>}
    </>
  );
}

/* ─── Shared Items Table ─── */
function ItemsTable({ computed, isIntrastate, fmt, thStyle }) {
  const hasCess = computed.some(i => i.cess > 0);
  return (
    <table className="w-full border-collapse text-[10px]">
      <thead>
        <tr style={thStyle}>
          <th className="py-[7px] px-2 font-bold text-left border-b border-gray-200 whitespace-nowrap">sr. no</th>
          <th className="py-[7px] px-2 font-bold text-left border-b border-gray-200 whitespace-nowrap">Description</th>
          <th className="py-[7px] px-2 font-bold text-left border-b border-gray-200 whitespace-nowrap">HSN/SAC</th>
          <th className="py-[7px] px-2 font-bold text-left border-b border-gray-200 whitespace-nowrap">Qty</th>
          <th className="py-[7px] px-2 font-bold text-left border-b border-gray-200 whitespace-nowrap">Rate</th>
          {isIntrastate ? (
            <>
              <th className="py-[7px] px-2 font-bold text-left border-b border-gray-200 whitespace-nowrap">CGST</th>
              <th className="py-[7px] px-2 font-bold text-left border-b border-gray-200 whitespace-nowrap">SGST</th>
            </>
          ) : (
            <th className="py-[7px] px-2 font-bold text-left border-b border-gray-200 whitespace-nowrap">IGST</th>
          )}
          {hasCess && <th className="py-[7px] px-2 font-bold text-left border-b border-gray-200 whitespace-nowrap">Cess</th>}
          <th className="py-[7px] px-2 font-bold text-left border-b border-gray-200 whitespace-nowrap">Amount</th>
        </tr>
      </thead>
      <tbody>
        {computed.map((it, idx) => {
          const isLast = idx === computed.length - 1;
          const tdClass = `py-[6px] px-2 text-gray-700 ${isLast ? "border-b-0" : "border-b border-gray-100"}`;
          return (
            <tr key={it.id}>
              <td className={tdClass}>{idx+1}</td>
              <td className={tdClass}>{it.description||"—"}</td>
              <td className={tdClass}>{it.hsn||"—"}</td>
              <td className={tdClass}>{it.qty}</td>
              <td className={tdClass}>₹{fmt(it.rate)}</td>
              {isIntrastate ? (
                <>
                  <td className={tdClass}>{it.taxRate/2}% (₹{fmt(it.taxAmt/2)})</td>
                  <td className={tdClass}>{it.taxRate/2}% (₹{fmt(it.taxAmt/2)})</td>
                </>
              ) : (
                <td className={tdClass}>{it.taxRate}% (₹{fmt(it.taxAmt)})</td>
              )}
              {hasCess && <td className={tdClass}>{it.cess}% (₹{fmt(it.cessAmt)})</td>}
              <td className={tdClass}><b>₹{fmt(it.total)}</b></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ═══════════════════════════════════════════
   InvoicePreview — switches between templates
   ═══════════════════════════════════════════ */
function InvoicePreview(props) {
  const { template } = props;
  if (template === "classic")   return <TplClassic   {...props} />;
  if (template === "minimal")   return <TplMinimal   {...props} />;
  if (template === "bold")      return <TplBold      {...props} />;
  if (template === "executive") return <TplExecutive {...props} />;
  if (template === "elegant")   return <TplElegant   {...props} />;
  if (template === "corporate") return <TplCorporate {...props} />;
  if (template === "vibrant")   return <TplVibrant   {...props} />;
  if (template === "sunset")    return <TplSunset    {...props} />;
  if (template === "ocean")     return <TplOcean     {...props} />;
  if (template === "dark")      return <TplDark      {...props} />;
  if (template === "retro")     return <TplRetro     {...props} />;
  return <TplModern {...props} />;
}

/* ── Template 1: Modern (colored full header) ── */
function TplModern({ theme,logo,seller,buyer,invoiceNo,invoiceDate,dueDate,computed,subTotal,totalCess,grandTotal,taxBreakdown,isIntrastate,placeOfSupply,notes,terms,fmt,numberToWords }) {
  return (
    <div className="invoice-preview bg-white text-[#1a1a2e] rounded-none overflow-x-hidden overflow-y-auto text-[11px] w-full shadow-[0_4px_32px_rgba(0,0,0,0.6),0_1px_4px_rgba(0,0,0,0.3)] aspect-[1/1.4142]" id="invoice-preview" style={{ fontFamily: '"Inter", sans-serif' }}>
      <div className="flex justify-between items-start py-[18px] px-5 gap-3 text-white" style={{ background: theme }}>
        <div className="flex items-start gap-3 flex-1">
          {logo ? <img src={logo} alt="logo" className="w-[52px] h-[42px] object-contain rounded-md bg-white/15" /> : <div className="w-[52px] h-[42px] bg-white/20 rounded-md flex items-center justify-center text-[9px] text-white/70 font-bold">LOGO</div>}
          <div>
            <div className="text-[14px] font-extrabold text-white">{seller.company||"Your Company"}</div>
            <div className="text-[10px] text-white/80 mt-[2px]">{seller.name}</div>
            {seller.gstin && <div className="text-[9px] text-white/70 mt-[2px] font-mono">GSTIN: {seller.gstin}</div>}
            <div className="text-[10px] text-white/80 mt-[2px]">{[seller.address,seller.city,seller.state].filter(Boolean).join(", ")}</div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[18px] font-black tracking-[0.04em] text-white mb-2">TAX INVOICE</div>
          <div className="flex justify-end gap-3 text-white/85 text-[9px] mt-[3px]"><span className="opacity-70">Invoice #</span><span>{invoiceNo}</span></div>
          <div className="flex justify-end gap-3 text-white/85 text-[9px] mt-[3px]"><span className="opacity-70">Date</span><span>{invoiceDate}</span></div>
          {dueDate && <div className="flex justify-end gap-3 text-white/85 text-[9px] mt-[3px]"><span className="opacity-70">Due</span><span>{dueDate}</span></div>}
        </div>
      </div>
      <div className="flex gap-3 py-[14px] px-5 border-b border-gray-200">
        <div className="flex-1">
          <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-gray-500 mb-1">Bill To</div>
          <div className="text-[12px] font-bold text-gray-900 mb-[3px]">{buyer.company||"Client Company"}</div>
          {buyer.gstin && <div className="text-[10px] text-gray-600 leading-normal">GSTIN: {buyer.gstin}</div>}
          <div className="text-[10px] text-gray-600 leading-normal">{[buyer.address,buyer.city,buyer.state].filter(Boolean).join(", ")}</div>
        </div>
        <div className="shrink-0 min-w-[120px]">
          <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-gray-500 mb-1">Supply Info</div>
          <div className="text-[10px] text-gray-600 leading-normal"><b>Place of Supply:</b> {placeOfSupply}</div>
          <div className="text-[10px] text-gray-600 leading-normal" style={{color:theme,fontWeight:600}}>{isIntrastate?"CGST + SGST":"IGST"}</div>
        </div>
      </div>
      <ItemsTable computed={computed} isIntrastate={isIntrastate} fmt={fmt} thStyle={{background:theme+"22",color:theme}} />
      <div className="py-3 px-5 border-t-2 border-gray-200">
        <TaxRows taxBreakdown={taxBreakdown} isIntrastate={isIntrastate} totalCess={totalCess} subTotal={subTotal} grandTotal={grandTotal} fmt={fmt} />
        <div className="flex justify-between py-[10px] text-[14px] font-extrabold border-t-2 border-b-2 mt-[6px]" style={{borderColor:theme,color:theme}}><span>GRAND TOTAL</span><span>₹{fmt(grandTotal)}</span></div>
        <div className="text-[9px] text-gray-500 mt-2 italic"><i>Amount in words: <b>Rupees {numberToWords(Math.floor(grandTotal))} Only</b></i></div>
      </div>
      {(notes||terms) && <div className="grid grid-cols-2 gap-3 py-3 px-5 border-t border-gray-200 text-[10px] text-gray-700">
        {notes && <div><div className="text-[9px] font-bold uppercase tracking-[0.08em] text-gray-500 mb-1">Notes</div><p className="mt-1 leading-normal">{notes}</p></div>}
        {terms && <div><div className="text-[9px] font-bold uppercase tracking-[0.08em] text-gray-500 mb-1">Terms & Conditions</div><p className="mt-1 leading-normal">{terms}</p></div>}
      </div>}
      <div className="py-2 px-5 text-center text-[9px] text-white/85 font-medium tracking-[0.03em]" style={{background:theme}}><span>Generated with UtilsFlow • Free GST Invoice Generator</span></div>
    </div>
  );
}

/* ── Template 2: Classic (bordered, header split) ── */
function TplClassic({ theme,logo,seller,buyer,invoiceNo,invoiceDate,dueDate,computed,subTotal,totalCess,grandTotal,taxBreakdown,isIntrastate,placeOfSupply,notes,terms,fmt,numberToWords }) {
  return (
    <div className="invoice-preview bg-white text-[#1a1a2e] rounded-none overflow-x-hidden overflow-y-auto text-[11px] w-full shadow-[0_4px_32px_rgba(0,0,0,0.6),0_1px_4px_rgba(0,0,0,0.3)] aspect-[1/1.4142]" id="invoice-preview" style={{ fontFamily: '"Inter", sans-serif' }}>
      <div className="flex justify-between items-start py-4 px-5 gap-4">
        <div className="flex gap-[10px] items-start">
          {logo ? <img src={logo} alt="logo" className="w-[52px] h-[42px] object-contain rounded-md bg-white/15" style={{width:60,height:48}} /> : <div className="w-[52px] h-[42px] border-2 rounded-md flex items-center justify-center text-[9px] font-bold" style={{borderColor:theme,color:theme}}>LOGO</div>}
          <div>
            <div style={{fontSize:15,fontWeight:800,color:"#111"}}>{seller.company||"Your Company"}</div>
            {seller.name && <div style={{fontSize:10,color:"#555"}}>{seller.name}</div>}
            {seller.gstin && <div style={{fontSize:9,color:"#777",fontFamily:"monospace"}}>GSTIN: {seller.gstin}</div>}
            <div style={{fontSize:10,color:"#555"}}>{[seller.address,seller.city,seller.state].filter(Boolean).join(", ")}</div>
          </div>
        </div>
        <div className="text-right border-r-4 pr-3" style={{borderColor:theme}}>
          <div style={{fontSize:18,fontWeight:900,color:theme,letterSpacing:2}}>TAX INVOICE</div>
          <div style={{fontSize:10,marginTop:6,color:"#444"}}>No: <b>{invoiceNo}</b></div>
          <div style={{fontSize:10,color:"#444"}}>Date: <b>{invoiceDate}</b></div>
          {dueDate && <div style={{fontSize:10,color:"#444"}}>Due: <b>{dueDate}</b></div>}
        </div>
      </div>
      <div style={{height:2,background:theme,margin:"0 0 10px"}} />
      <div className="flex gap-3 py-[14px] px-5 border-b border-gray-200">
        <div className="flex-1">
          <div style={{fontSize:9,fontWeight:700,color:theme,textTransform:"uppercase",marginBottom:3}}>Bill To</div>
          <div style={{fontSize:12,fontWeight:700,color:"#111"}}>{buyer.company||"Client Company"}</div>
          {buyer.gstin && <div style={{fontSize:9,color:"#555"}}>GSTIN: {buyer.gstin}</div>}
          <div style={{fontSize:10,color:"#555"}}>{[buyer.address,buyer.city,buyer.state].filter(Boolean).join(", ")}</div>
        </div>
        <div className="shrink-0 min-w-[120px]">
          <div style={{fontSize:9,fontWeight:700,color:theme,textTransform:"uppercase",marginBottom:3}}>Supply</div>
          <div style={{fontSize:10,color:"#444"}}><b>Place:</b> {placeOfSupply}</div>
          <div style={{fontSize:10,fontWeight:700,color:theme}}>{isIntrastate?"CGST + SGST":"IGST"}</div>
        </div>
      </div>
      <ItemsTable computed={computed} isIntrastate={isIntrastate} fmt={fmt} thStyle={{background:theme,color:"white"}} />
      <div className="py-3 px-5 border-t-2 border-gray-200">
        <TaxRows taxBreakdown={taxBreakdown} isIntrastate={isIntrastate} totalCess={totalCess} subTotal={subTotal} grandTotal={grandTotal} fmt={fmt} />
        <div className="flex justify-between py-[10px] text-[14px] font-extrabold border-t-2 border-b-2 mt-[6px]" style={{borderColor:theme,color:theme}}><span>GRAND TOTAL</span><span>₹{fmt(grandTotal)}</span></div>
        <div className="text-[9px] text-gray-500 mt-2 italic"><i>Rupees <b>{numberToWords(Math.floor(grandTotal))} Only</b></i></div>
      </div>
      {(notes||terms) && <div className="grid grid-cols-2 gap-3 py-3 px-5 border-t border-gray-200 text-[10px] text-gray-700">
        {notes && <div><div style={{fontSize:9,fontWeight:700,color:theme,textTransform:"uppercase"}}>Notes</div><p style={{fontSize:10,color:"#444",margin:"4px 0 0"}}>{notes}</p></div>}
        {terms && <div><div style={{fontSize:9,fontWeight:700,color:theme,textTransform:"uppercase"}}>Terms</div><p style={{fontSize:10,color:"#444",margin:"4px 0 0"}}>{terms}</p></div>}
      </div>}
      <div style={{height:3,background:theme,marginTop:14}} />
    </div>
  );
}

/* ── Template 3: Minimal (clean, no colors except accent line) ── */
function TplMinimal({ theme,logo,seller,buyer,invoiceNo,invoiceDate,dueDate,computed,subTotal,totalCess,grandTotal,taxBreakdown,isIntrastate,placeOfSupply,notes,terms,fmt,numberToWords }) {
  return (
    <div className="invoice-preview bg-white text-[#1a1a2e] rounded-none overflow-x-hidden overflow-y-auto text-[11px] w-full shadow-[0_4px_32px_rgba(0,0,0,0.6),0_1px_4px_rgba(0,0,0,0.3)] aspect-[1/1.4142]" id="invoice-preview" style={{ fontFamily: '"Inter", sans-serif' }}>
      <div style={{display:"flex",justifyContent:"space-between",padding:"18px 20px 10px"}}>
        <div>
          {logo ? <img src={logo} alt="logo" style={{height:36,marginBottom:6,display:"block"}} /> : null}
          <div style={{fontSize:16,fontWeight:800,color:"#111"}}>{seller.company||"Your Company"}</div>
          {seller.gstin && <div style={{fontSize:9,color:"#888",fontFamily:"monospace"}}>GSTIN: {seller.gstin}</div>}
          <div style={{fontSize:10,color:"#666"}}>{[seller.address,seller.city,seller.state].filter(Boolean).join(", ")}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:20,fontWeight:900,color:"#111",letterSpacing:1}}>INVOICE</div>
          <div style={{fontSize:9,color:"#888",marginTop:4}}>#{invoiceNo}</div>
          <div style={{fontSize:9,color:"#888"}}>{invoiceDate}</div>
          {dueDate && <div style={{fontSize:9,color:"#888"}}>Due {dueDate}</div>}
        </div>
      </div>
      <div style={{height:2,background:theme,margin:"0 20px 10px"}} />
      <div style={{display:"flex",gap:12,padding:"0 20px 10px",borderBottom:"1px solid #eee"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:8,color:"#aaa",textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Bill To</div>
          <div style={{fontSize:12,fontWeight:700,color:"#111"}}>{buyer.company||"Client"}</div>
          {buyer.gstin && <div style={{fontSize:9,color:"#888"}}>GSTIN: {buyer.gstin}</div>}
          <div style={{fontSize:9,color:"#666"}}>{[buyer.address,buyer.city,buyer.state].filter(Boolean).join(", ")}</div>
        </div>
        <div>
          <div style={{fontSize:8,color:"#aaa",textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Tax Type</div>
          <div style={{fontSize:10,fontWeight:700,color:theme}}>{isIntrastate?"CGST + SGST":"IGST"}</div>
          <div style={{fontSize:9,color:"#888"}}>{placeOfSupply}</div>
        </div>
      </div>
      <ItemsTable computed={computed} isIntrastate={isIntrastate} fmt={fmt} thStyle={{borderBottom:"2px solid "+theme,color:"#111",background:"#fafafa"}} />
      <div style={{padding:"10px 20px"}}>
        <TaxRows taxBreakdown={taxBreakdown} isIntrastate={isIntrastate} totalCess={totalCess} subTotal={subTotal} grandTotal={grandTotal} fmt={fmt} />
        <div style={{display:"flex",justifyContent:"space-between",marginTop:8,padding:"8px 0",borderTop:"2px solid "+theme,color:theme,fontWeight:800,fontSize:13}}>
          <span>TOTAL</span><span>₹{fmt(grandTotal)}</span>
        </div>
        <div style={{fontSize:9,color:"#888",marginTop:4,fontStyle:"italic"}}>Rupees <b>{numberToWords(Math.floor(grandTotal))} Only</b></div>
      </div>
      {(notes||terms) && <div style={{padding:"8px 20px",borderTop:"1px solid #eee",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:10,color:"#555"}}>
        {notes && <div><div style={{fontSize:8,color:"#aaa",textTransform:"uppercase",letterSpacing:1}}>Notes</div><p style={{margin:"3px 0 0"}}>{notes}</p></div>}
        {terms && <div><div style={{fontSize:8,color:"#aaa",textTransform:"uppercase",letterSpacing:1}}>Terms</div><p style={{margin:"3px 0 0"}}>{terms}</p></div>}
      </div>}
    </div>
  );
}

/* ── Template 4: Bold (dark sidebar + accent) ── */
function TplBold({ theme,logo,seller,buyer,invoiceNo,invoiceDate,dueDate,computed,subTotal,totalCess,grandTotal,taxBreakdown,isIntrastate,placeOfSupply,notes,terms,fmt,numberToWords }) {
  return (
    <div className="invoice-preview bg-white text-[#1a1a2e] rounded-none overflow-x-hidden overflow-y-auto text-[11px] w-full shadow-[0_4px_32px_rgba(0,0,0,0.6),0_1px_4px_rgba(0,0,0,0.3)] aspect-[1/1.4142]" id="invoice-preview" style={{ fontFamily: '"Inter", sans-serif' }}>
      <div style={{display:"flex",minHeight:110}}>
        <div style={{background:"#1a1a2e",width:140,flexShrink:0,padding:"14px 12px",display:"flex",flexDirection:"column",gap:6}}>
          {logo ? <img src={logo} alt="logo" style={{width:60,height:40,objectFit:"contain",marginBottom:4,borderRadius:4}} /> : <div style={{width:50,height:36,background:theme+"33",borderRadius:4,marginBottom:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:theme,fontWeight:700}}>LOGO</div>}
          <div style={{fontSize:11,fontWeight:800,color:"white"}}>{seller.company||"Your Company"}</div>
          {seller.gstin && <div style={{fontSize:8,color:"#aaa",fontFamily:"monospace",wordBreak:"break-all"}}>GSTIN: {seller.gstin}</div>}
          <div style={{fontSize:9,color:"#888"}}>{[seller.address,seller.city,seller.state].filter(Boolean).join(", ")}</div>
        </div>
        <div style={{flex:1,background:theme,display:"flex",flexDirection:"column",justifyContent:"center",padding:"14px 16px"}}>
          <div style={{fontSize:22,fontWeight:900,color:"white",letterSpacing:2}}>TAX INVOICE</div>
          <div style={{display:"flex",gap:16,marginTop:8}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.8)"}}># <b style={{color:"white"}}>{invoiceNo}</b></div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.8)"}}>Date <b style={{color:"white"}}>{invoiceDate}</b></div>
            {dueDate && <div style={{fontSize:9,color:"rgba(255,255,255,0.8)"}}>Due <b style={{color:"white"}}>{dueDate}</b></div>}
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:12,padding:"10px 14px",background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:8,fontWeight:700,color:theme,textTransform:"uppercase",letterSpacing:1}}>Bill To</div>
          <div style={{fontSize:12,fontWeight:800,color:"#111",marginTop:2}}>{buyer.company||"Client Company"}</div>
          {buyer.gstin && <div style={{fontSize:9,color:"#666"}}>GSTIN: {buyer.gstin}</div>}
          <div style={{fontSize:9,color:"#666"}}>{[buyer.address,buyer.city,buyer.state].filter(Boolean).join(", ")}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:8,fontWeight:700,color:theme,textTransform:"uppercase",letterSpacing:1}}>Place of Supply</div>
          <div style={{fontSize:10,color:"#444",marginTop:2}}>{placeOfSupply}</div>
          <div style={{fontSize:10,fontWeight:700,color:theme}}>{isIntrastate?"CGST + SGST":"IGST"}</div>
        </div>
      </div>
      <ItemsTable computed={computed} isIntrastate={isIntrastate} fmt={fmt} thStyle={{background:"#1a1a2e",color:"white"}} />
      <div style={{padding:"10px 14px"}}>
        <TaxRows taxBreakdown={taxBreakdown} isIntrastate={isIntrastate} totalCess={totalCess} subTotal={subTotal} grandTotal={grandTotal} fmt={fmt} />
        <div style={{display:"flex",justifyContent:"space-between",background:theme,color:"white",fontWeight:900,fontSize:13,padding:"10px 12px",borderRadius:6,marginTop:8}}>
          <span>GRAND TOTAL</span><span>₹{fmt(grandTotal)}</span>
        </div>
        <div style={{fontSize:9,color:"#888",marginTop:6,fontStyle:"italic"}}>Rupees <b>{numberToWords(Math.floor(grandTotal))} Only</b></div>
      </div>
      {(notes||terms) && <div style={{padding:"8px 14px",borderTop:"1px solid #e5e7eb",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:10,color:"#444"}}>
        {notes && <div><div style={{fontWeight:700,color:theme,fontSize:9,textTransform:"uppercase"}}>Notes</div><p style={{margin:"3px 0 0"}}>{notes}</p></div>}
        {terms && <div><div style={{fontWeight:700,color:theme,fontSize:9,textTransform:"uppercase"}}>Terms</div><p style={{margin:"3px 0 0"}}>{terms}</p></div>}
      </div>}
      <div style={{height:4,background:"#1a1a2e"}} />
    </div>
  );
}

/* ── Template 5: Executive (diagonal hero, two-tone) ── */
function TplExecutive({ theme,logo,seller,buyer,invoiceNo,invoiceDate,dueDate,computed,subTotal,totalCess,grandTotal,taxBreakdown,isIntrastate,placeOfSupply,notes,terms,fmt,numberToWords }) {
  const dark = "#0f172a";
  return (
    <div className="invoice-preview bg-white text-[#1a1a2e] rounded-none overflow-x-hidden overflow-y-auto text-[11px] w-full shadow-[0_4px_32px_rgba(0,0,0,0.6),0_1px_4px_rgba(0,0,0,0.3)] aspect-[1/1.4142]" id="invoice-preview" style={{ fontFamily: '"Inter", sans-serif', background: "#fff" }}>
      {/* Hero: diagonal split */}
      <div style={{position:"relative",height:100,overflow:"hidden",background:dark}}>
        <div style={{position:"absolute",top:0,left:0,width:"58%",height:"100%",background:theme,clipPath:"polygon(0 0,100% 0,85% 100%,0 100%)",display:"flex",alignItems:"center",padding:"0 18px",gap:10}}>
          {logo ? <img src={logo} alt="logo" style={{height:38,objectFit:"contain",borderRadius:4}} /> : <div style={{width:44,height:36,background:"rgba(255,255,255,0.2)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"white",fontWeight:700}}>LOGO</div>}
          <div>
            <div style={{fontSize:14,fontWeight:900,color:"white"}}>{seller.company||"Your Company"}</div>
            {seller.gstin && <div style={{fontSize:8,color:"rgba(255,255,255,0.75)",fontFamily:"monospace"}}>GSTIN: {seller.gstin}</div>}
            <div style={{fontSize:9,color:"rgba(255,255,255,0.7)"}}>{[seller.city,seller.state].filter(Boolean).join(", ")}</div>
          </div>
        </div>
        <div style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",textAlign:"right"}}>
          <div style={{fontSize:16,fontWeight:900,color:"white",letterSpacing:2}}>TAX INVOICE</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.7)",marginTop:4}}>#{invoiceNo} &nbsp;|&nbsp; {invoiceDate}</div>
          {dueDate && <div style={{fontSize:9,color:"rgba(255,255,255,0.6)"}}>Due: {dueDate}</div>}
        </div>
      </div>
      {/* Bill to row */}
      <div style={{display:"flex",gap:12,padding:"10px 16px",borderBottom:"1px solid #e5e7eb",background:"#f8fafc"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:8,fontWeight:700,color:theme,textTransform:"uppercase",letterSpacing:1}}>Bill To</div>
          <div style={{fontSize:12,fontWeight:800,color:"#111",marginTop:2}}>{buyer.company||"Client Company"}</div>
          {buyer.gstin && <div style={{fontSize:9,color:"#555"}}>GSTIN: {buyer.gstin}</div>}
          <div style={{fontSize:9,color:"#666"}}>{[buyer.address,buyer.city,buyer.state].filter(Boolean).join(", ")}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:8,fontWeight:700,color:theme,textTransform:"uppercase",letterSpacing:1}}>Tax Type</div>
          <div style={{fontSize:11,fontWeight:700,color:dark,marginTop:2}}>{isIntrastate?"CGST + SGST":"IGST"}</div>
          <div style={{fontSize:9,color:"#777"}}>{placeOfSupply}</div>
        </div>
      </div>
      <ItemsTable computed={computed} isIntrastate={isIntrastate} fmt={fmt} thStyle={{background:dark,color:"white"}} />
      <div style={{padding:"10px 16px"}}>
        <TaxRows taxBreakdown={taxBreakdown} isIntrastate={isIntrastate} totalCess={totalCess} subTotal={subTotal} grandTotal={grandTotal} fmt={fmt} />
        <div style={{display:"flex",justifyContent:"space-between",background:`linear-gradient(90deg,${dark},${theme})`,color:"white",fontWeight:900,fontSize:13,padding:"10px 14px",borderRadius:8,marginTop:8}}>
          <span>GRAND TOTAL</span><span>₹{fmt(grandTotal)}</span>
        </div>
        <div style={{fontSize:9,color:"#888",marginTop:5,fontStyle:"italic"}}>Rupees <b>{numberToWords(Math.floor(grandTotal))} Only</b></div>
      </div>
      {(notes||terms) && <div style={{padding:"8px 16px",borderTop:"1px solid #e5e7eb",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:10,color:"#444"}}>
        {notes && <div><div style={{fontWeight:700,color:theme,fontSize:9,textTransform:"uppercase"}}>Notes</div><p style={{margin:"3px 0 0"}}>{notes}</p></div>}
        {terms && <div><div style={{fontWeight:700,color:theme,fontSize:9,textTransform:"uppercase"}}>Terms</div><p style={{margin:"3px 0 0"}}>{terms}</p></div>}
      </div>}
      <div style={{height:4,background:`linear-gradient(90deg,${dark},${theme})`}} />
    </div>
  );
}

/* ── Template 6: Elegant (left color bar accent) ── */
function TplElegant({ theme,logo,seller,buyer,invoiceNo,invoiceDate,dueDate,computed,subTotal,totalCess,grandTotal,taxBreakdown,isIntrastate,placeOfSupply,notes,terms,fmt,numberToWords }) {
  return (
    <div className="invoice-preview bg-white text-[#1a1a2e] rounded-none overflow-x-hidden overflow-y-auto text-[11px] w-full shadow-[0_4px_32px_rgba(0,0,0,0.6),0_1px_4px_rgba(0,0,0,0.3)] aspect-[1/1.4142]" id="invoice-preview" style={{ fontFamily: '"Inter", sans-serif', background: "#fff", display: "flex", minHeight: 400 }}>
      {/* Left bar */}
      <div style={{width:8,background:theme,flexShrink:0,borderRadius:"0 0 0 0"}} />
      <div style={{flex:1}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"16px 16px 10px"}}>
          <div>
            {logo ? <img src={logo} alt="logo" style={{height:38,marginBottom:5,display:"block",objectFit:"contain"}} /> : null}
            <div style={{fontSize:15,fontWeight:900,color:"#111",letterSpacing:.5}}>{seller.company||"Your Company"}</div>
            {seller.name && <div style={{fontSize:10,color:"#666"}}>{seller.name}</div>}
            {seller.gstin && <div style={{fontSize:9,color:"#888",fontFamily:"monospace"}}>GSTIN: {seller.gstin}</div>}
            <div style={{fontSize:9,color:"#777"}}>{[seller.address,seller.city,seller.state].filter(Boolean).join(", ")}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:22,fontWeight:900,color:theme,letterSpacing:3}}>INVOICE</div>
            <div style={{width:48,height:3,background:theme,marginLeft:"auto",borderRadius:2,marginTop:4,marginBottom:6}} />
            <div style={{fontSize:9,color:"#777"}}>#{invoiceNo}</div>
            <div style={{fontSize:9,color:"#777"}}>{invoiceDate}</div>
            {dueDate && <div style={{fontSize:9,color:"#999"}}>Due: {dueDate}</div>}
          </div>
        </div>
        {/* Divider */}
        <div style={{height:1,background:"#e5e7eb",margin:"0 16px 10px"}} />
        {/* Bill To */}
        <div style={{display:"flex",gap:12,padding:"0 16px 10px"}}>
          <div style={{flex:1}}>
            <div style={{fontSize:8,color:theme,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Bill To</div>
            <div style={{fontSize:12,fontWeight:800,color:"#111"}}>{buyer.company||"Client Company"}</div>
            {buyer.gstin && <div style={{fontSize:9,color:"#555"}}>GSTIN: {buyer.gstin}</div>}
            <div style={{fontSize:9,color:"#666"}}>{[buyer.address,buyer.city,buyer.state].filter(Boolean).join(", ")}</div>
          </div>
          <div>
            <div style={{fontSize:8,color:theme,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Tax</div>
            <div style={{fontSize:10,fontWeight:700,color:"#222"}}>{isIntrastate?"CGST + SGST":"IGST"}</div>
            <div style={{fontSize:9,color:"#888"}}>{placeOfSupply}</div>
          </div>
        </div>
        <ItemsTable computed={computed} isIntrastate={isIntrastate} fmt={fmt} thStyle={{background:theme+"15",color:theme,borderBottom:"2px solid "+theme}} />
        <div style={{padding:"10px 16px"}}>
          <TaxRows taxBreakdown={taxBreakdown} isIntrastate={isIntrastate} totalCess={totalCess} subTotal={subTotal} grandTotal={grandTotal} fmt={fmt} />
          <div style={{display:"flex",justifyContent:"space-between",borderLeft:`4px solid ${theme}`,paddingLeft:10,marginTop:8,color:"#111",fontWeight:900,fontSize:14}}>
            <span>GRAND TOTAL</span><span style={{color:theme}}>₹{fmt(grandTotal)}</span>
          </div>
          <div style={{fontSize:9,color:"#999",marginTop:5,fontStyle:"italic"}}>Rupees <b>{numberToWords(Math.floor(grandTotal))} Only</b></div>
        </div>
        {(notes||terms) && <div style={{padding:"8px 16px",borderTop:"1px solid #eee",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,fontSize:10,color:"#555"}}>
          {notes && <div><div style={{color:theme,fontWeight:700,fontSize:8,textTransform:"uppercase",letterSpacing:1}}>Notes</div><p style={{margin:"3px 0 0"}}>{notes}</p></div>}
          {terms && <div><div style={{color:theme,fontWeight:700,fontSize:8,textTransform:"uppercase",letterSpacing:1}}>Terms</div><p style={{margin:"3px 0 0"}}>{terms}</p></div>}
        </div>}
      </div>
    </div>
  );
}

/* ── Template 7: Corporate (gray bar header, formal) ── */
function TplCorporate({ theme,logo,seller,buyer,invoiceNo,invoiceDate,dueDate,computed,subTotal,totalCess,grandTotal,taxBreakdown,isIntrastate,placeOfSupply,notes,terms,fmt,numberToWords }) {
  return (
    <div className="invoice-preview bg-white text-[#1a1a2e] rounded-none overflow-x-hidden overflow-y-auto text-[11px] w-full shadow-[0_4px_32px_rgba(0,0,0,0.6),0_1px_4px_rgba(0,0,0,0.3)] aspect-[1/1.4142]" id="invoice-preview" style={{ fontFamily: '"Inter", sans-serif', background: "#fff" }}>
      {/* Top thin accent */}
      <div style={{height:5,background:theme}} />
      {/* Gray header */}
      <div style={{background:"#f1f5f9",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #e2e8f0"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {logo ? <img src={logo} alt="logo" style={{height:40,objectFit:"contain"}} /> : <div style={{width:48,height:38,background:"#cbd5e1",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#64748b",fontWeight:700}}>LOGO</div>}
          <div>
            <div style={{fontSize:14,fontWeight:800,color:"#1e293b"}}>{seller.company||"Your Company"}</div>
            {seller.gstin && <div style={{fontSize:8,color:"#64748b",fontFamily:"monospace"}}>GSTIN: {seller.gstin}</div>}
            <div style={{fontSize:9,color:"#64748b"}}>{[seller.address,seller.city,seller.state].filter(Boolean).join(", ")}</div>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:11,fontWeight:900,color:"#1e293b",letterSpacing:2,textTransform:"uppercase"}}>Tax Invoice</div>
          <div style={{fontSize:9,color:"#64748b",marginTop:4}}>No: <b style={{color:"#1e293b"}}>{invoiceNo}</b></div>
          <div style={{fontSize:9,color:"#64748b"}}>Date: <b style={{color:"#1e293b"}}>{invoiceDate}</b></div>
          {dueDate && <div style={{fontSize:9,color:"#64748b"}}>Due: <b>{dueDate}</b></div>}
        </div>
      </div>
      {/* Bill To */}
      <div style={{display:"flex",gap:16,padding:"10px 18px",borderBottom:"1px solid #e2e8f0"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:8,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Bill To</div>
          <div style={{fontSize:12,fontWeight:700,color:"#1e293b"}}>{buyer.company||"Client Company"}</div>
          {buyer.gstin && <div style={{fontSize:9,color:"#475569"}}>GSTIN: {buyer.gstin}</div>}
          <div style={{fontSize:9,color:"#64748b"}}>{[buyer.address,buyer.city,buyer.state].filter(Boolean).join(", ")}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:8,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Place of Supply</div>
          <div style={{fontSize:10,color:"#1e293b",fontWeight:600}}>{placeOfSupply}</div>
          <div style={{fontSize:10,fontWeight:700,color:theme}}>{isIntrastate?"CGST + SGST":"IGST"}</div>
        </div>
      </div>
      <ItemsTable computed={computed} isIntrastate={isIntrastate} fmt={fmt} thStyle={{background:"#1e293b",color:"white"}} />
      <div style={{padding:"10px 18px"}}>
        <TaxRows taxBreakdown={taxBreakdown} isIntrastate={isIntrastate} totalCess={totalCess} subTotal={subTotal} grandTotal={grandTotal} fmt={fmt} />
        <div style={{display:"flex",justifyContent:"space-between",background:"#f1f5f9",border:`2px solid ${theme}`,borderRadius:6,padding:"9px 12px",marginTop:8,fontWeight:900,fontSize:13}}>
          <span style={{color:"#1e293b"}}>GRAND TOTAL</span><span style={{color:theme}}>₹{fmt(grandTotal)}</span>
        </div>
        <div style={{fontSize:9,color:"#94a3b8",marginTop:5,fontStyle:"italic"}}>Rupees <b>{numberToWords(Math.floor(grandTotal))} Only</b></div>
      </div>
      {(notes||terms) && <div style={{padding:"8px 18px",borderTop:"1px solid #e2e8f0",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:10,color:"#475569"}}>
        {notes && <div><div style={{fontWeight:700,color:"#64748b",fontSize:8,textTransform:"uppercase",letterSpacing:1}}>Notes</div><p style={{margin:"3px 0 0"}}>{notes}</p></div>}
        {terms && <div><div style={{fontWeight:700,color:"#64748b",fontSize:8,textTransform:"uppercase",letterSpacing:1}}>Terms</div><p style={{margin:"3px 0 0"}}>{terms}</p></div>}
      </div>}
      <div style={{height:4,background:theme,marginTop:8}} />
    </div>
  );
}

/* ── Template 8: Vibrant (gradient band + bright) ── */
function TplVibrant({ theme,logo,seller,buyer,invoiceNo,invoiceDate,dueDate,computed,subTotal,totalCess,grandTotal,taxBreakdown,isIntrastate,placeOfSupply,notes,terms,fmt,numberToWords }) {
  const grad = `linear-gradient(135deg, ${theme}, ${theme}bb)`;
  return (
    <div className="invoice-preview bg-white text-[#1a1a2e] rounded-none overflow-x-hidden overflow-y-auto text-[11px] w-full shadow-[0_4px_32px_rgba(0,0,0,0.6),0_1px_4px_rgba(0,0,0,0.3)] aspect-[1/1.4142]" id="invoice-preview" style={{ fontFamily: '"Inter", sans-serif', background: "#fff" }}>
      {/* Full gradient header */}
      <div style={{background:grad,padding:"16px 18px 20px",borderRadius:"0 0 24px 24px",marginBottom:4}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {logo ? <img src={logo} alt="logo" style={{height:40,objectFit:"contain",borderRadius:6,background:"rgba(255,255,255,0.2)",padding:2}} /> : <div style={{width:44,height:36,background:"rgba(255,255,255,0.25)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"white",fontWeight:700}}>LOGO</div>}
            <div>
              <div style={{fontSize:14,fontWeight:900,color:"white"}}>{seller.company||"Your Company"}</div>
              {seller.gstin && <div style={{fontSize:8,color:"rgba(255,255,255,0.8)",fontFamily:"monospace"}}>GSTIN: {seller.gstin}</div>}
              <div style={{fontSize:9,color:"rgba(255,255,255,0.75)"}}>{[seller.city,seller.state].filter(Boolean).join(", ")}</div>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.18)",borderRadius:10,padding:"8px 14px",textAlign:"right",backdropFilter:"blur(8px)"}}>
            <div style={{fontSize:14,fontWeight:900,color:"white",letterSpacing:1}}>TAX INVOICE</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.85)",marginTop:3}}>#{invoiceNo} | {invoiceDate}</div>
            {dueDate && <div style={{fontSize:9,color:"rgba(255,255,255,0.75)"}}>Due: {dueDate}</div>}
          </div>
        </div>
        {/* Bill to inside header */}
        <div style={{display:"flex",gap:10,marginTop:12,background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"8px 12px"}}>
          <div style={{flex:1}}>
            <div style={{fontSize:8,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>Bill To</div>
            <div style={{fontSize:12,fontWeight:800,color:"white",marginTop:2}}>{buyer.company||"Client Company"}</div>
            {buyer.gstin && <div style={{fontSize:9,color:"rgba(255,255,255,0.8)"}}>GSTIN: {buyer.gstin}</div>}
            <div style={{fontSize:9,color:"rgba(255,255,255,0.75)"}}>{[buyer.address,buyer.city,buyer.state].filter(Boolean).join(", ")}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:8,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>Tax</div>
            <div style={{fontSize:11,fontWeight:800,color:"white",marginTop:2}}>{isIntrastate?"CGST+SGST":"IGST"}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.75)"}}>{placeOfSupply}</div>
          </div>
        </div>
      </div>
      <ItemsTable computed={computed} isIntrastate={isIntrastate} fmt={fmt} thStyle={{background:theme+"18",color:theme,borderBottom:"2px solid "+theme}} />
      <div style={{padding:"10px 18px"}}>
        <TaxRows taxBreakdown={taxBreakdown} isIntrastate={isIntrastate} totalCess={totalCess} subTotal={subTotal} grandTotal={grandTotal} fmt={fmt} />
        <div style={{background:grad,color:"white",fontWeight:900,fontSize:13,padding:"11px 14px",borderRadius:10,marginTop:8,display:"flex",justifyContent:"space-between",boxShadow:`0 4px 16px ${theme}55`}}>
          <span>GRAND TOTAL</span><span>₹{fmt(grandTotal)}</span>
        </div>
        <div style={{fontSize:9,color:"#999",marginTop:5,fontStyle:"italic"}}>Rupees <b>{numberToWords(Math.floor(grandTotal))} Only</b></div>
      </div>
      {(notes||terms) && <div style={{padding:"8px 18px",borderTop:"1px solid #f0f0f0",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:10,color:"#444"}}>
        {notes && <div><div style={{color:theme,fontWeight:700,fontSize:8,textTransform:"uppercase",letterSpacing:1}}>Notes</div><p style={{margin:"3px 0 0"}}>{notes}</p></div>}
        {terms && <div><div style={{color:theme,fontWeight:700,fontSize:8,textTransform:"uppercase",letterSpacing:1}}>Terms</div><p style={{margin:"3px 0 0"}}>{terms}</p></div>}
      </div>}
    </div>
  );
}

/* ── Template 9: Sunset (warm orange-pink gradient header) ── */
function TplSunset({ theme,logo,seller,buyer,invoiceNo,invoiceDate,dueDate,computed,subTotal,totalCess,grandTotal,taxBreakdown,isIntrastate,placeOfSupply,notes,terms,fmt,numberToWords }) {
  const sunGrad = "linear-gradient(135deg,#ff6b35,#f7931e,#ffcd3c)";
  const sunDark = "#7c2d12";
  return (
    <div className="invoice-preview text-[#1a1a2e] rounded-none overflow-x-hidden overflow-y-auto text-[11px] w-full shadow-[0_4px_32px_rgba(0,0,0,0.6),0_1px_4px_rgba(0,0,0,0.3)] aspect-[1/1.4142]" id="invoice-preview" style={{ fontFamily: '"Inter", sans-serif', background: "#fffbf7" }}>
      <div style={{background:sunGrad,padding:"18px 20px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {logo ? <img src={logo} alt="logo" style={{height:40,objectFit:"contain",borderRadius:6,background:"rgba(255,255,255,0.25)",padding:2}} /> : <div style={{width:44,height:36,background:"rgba(255,255,255,0.3)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#7c2d12",fontWeight:800}}>LOGO</div>}
          <div>
            <div style={{fontSize:14,fontWeight:900,color:"#fff",textShadow:"0 1px 3px rgba(0,0,0,0.2)"}}>{seller.company||"Your Company"}</div>
            {seller.gstin && <div style={{fontSize:8,color:"rgba(255,255,255,0.85)",fontFamily:"monospace"}}>GSTIN: {seller.gstin}</div>}
            <div style={{fontSize:9,color:"rgba(255,255,255,0.8)"}}>{[seller.city,seller.state].filter(Boolean).join(", ")}</div>
          </div>
        </div>
        <div style={{textAlign:"right",background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"8px 12px"}}>
          <div style={{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:2,textShadow:"0 1px 3px rgba(0,0,0,0.2)"}}>TAX INVOICE</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.9)",marginTop:4}}>#{invoiceNo} | {invoiceDate}</div>
          {dueDate && <div style={{fontSize:9,color:"rgba(255,255,255,0.8)"}}>Due: {dueDate}</div>}
        </div>
      </div>
      {/* Warm Bill-To strip */}
      <div style={{background:"#fff3e0",padding:"10px 18px",display:"flex",gap:12,borderBottom:"2px solid #ffcd3c"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:8,fontWeight:700,color:"#ea580c",textTransform:"uppercase",letterSpacing:1}}>Bill To</div>
          <div style={{fontSize:12,fontWeight:800,color:"#1a1a2e",marginTop:2}}>{buyer.company||"Client Company"}</div>
          {buyer.gstin && <div style={{fontSize:9,color:"#78350f"}}>GSTIN: {buyer.gstin}</div>}
          <div style={{fontSize:9,color:"#92400e"}}>{[buyer.address,buyer.city,buyer.state].filter(Boolean).join(", ")}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:8,fontWeight:700,color:"#ea580c",textTransform:"uppercase",letterSpacing:1}}>Tax Type</div>
          <div style={{fontSize:11,fontWeight:800,color:sunDark,marginTop:2}}>{isIntrastate?"CGST + SGST":"IGST"}</div>
          <div style={{fontSize:9,color:"#78350f"}}>{placeOfSupply}</div>
        </div>
      </div>
      <ItemsTable computed={computed} isIntrastate={isIntrastate} fmt={fmt} thStyle={{background:"#ea580c",color:"white"}} />
      <div style={{padding:"10px 18px",background:"#fffbf7"}}>
        <TaxRows taxBreakdown={taxBreakdown} isIntrastate={isIntrastate} totalCess={totalCess} subTotal={subTotal} grandTotal={grandTotal} fmt={fmt} />
        <div style={{background:sunGrad,color:"white",fontWeight:900,fontSize:13,padding:"10px 14px",marginTop:8,display:"flex",justifyContent:"space-between",borderRadius:8,boxShadow:"0 4px 14px rgba(255,107,53,0.4)"}}>
          <span>GRAND TOTAL</span><span>₹{fmt(grandTotal)}</span>
        </div>
        <div style={{fontSize:9,color:"#92400e",marginTop:5,fontStyle:"italic"}}>Rupees <b>{numberToWords(Math.floor(grandTotal))} Only</b></div>
      </div>
      {(notes||terms) && <div style={{padding:"8px 18px",borderTop:"1px solid #fed7aa",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:10,color:"#78350f",background:"#fff7ed"}}>
        {notes && <div><div style={{fontWeight:700,color:"#ea580c",fontSize:8,textTransform:"uppercase"}}>Notes</div><p style={{margin:"3px 0 0"}}>{notes}</p></div>}
        {terms && <div><div style={{fontWeight:700,color:"#ea580c",fontSize:8,textTransform:"uppercase"}}>Terms</div><p style={{margin:"3px 0 0"}}>{terms}</p></div>}
      </div>}
      <div style={{height:4,background:sunGrad}} />
    </div>
  );
}

/* ── Template 10: Ocean (blue-teal, wave footer) ── */
function TplOcean({ theme,logo,seller,buyer,invoiceNo,invoiceDate,dueDate,computed,subTotal,totalCess,grandTotal,taxBreakdown,isIntrastate,placeOfSupply,notes,terms,fmt,numberToWords }) {
  const ocean1="#0ea5e9", ocean2="#0891b2", oceanDark="#0c4a6e";
  const oceanGrad=`linear-gradient(135deg,${ocean1},${ocean2})`;
  return (
    <div className="invoice-preview text-[#1a1a2e] rounded-none overflow-x-hidden overflow-y-auto text-[11px] w-full shadow-[0_4px_32px_rgba(0,0,0,0.6),0_1px_4px_rgba(0,0,0,0.3)] aspect-[1/1.4142]" id="invoice-preview" style={{ fontFamily: '"Inter", sans-serif', background: "#f0f9ff" }}>
      <div style={{background:oceanGrad,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {logo ? <img src={logo} alt="logo" style={{height:40,objectFit:"contain",borderRadius:6,background:"rgba(255,255,255,0.2)",padding:2}} /> : <div style={{width:44,height:36,background:"rgba(255,255,255,0.2)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"white",fontWeight:700}}>LOGO</div>}
          <div>
            <div style={{fontSize:14,fontWeight:900,color:"white"}}>{seller.company||"Your Company"}</div>
            {seller.gstin && <div style={{fontSize:8,color:"rgba(255,255,255,0.8)",fontFamily:"monospace"}}>GSTIN: {seller.gstin}</div>}
            <div style={{fontSize:9,color:"rgba(255,255,255,0.75)"}}>{[seller.city,seller.state].filter(Boolean).join(", ")}</div>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:16,fontWeight:900,color:"white",letterSpacing:2}}>TAX INVOICE</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.85)",marginTop:4}}>#{invoiceNo} | {invoiceDate}</div>
          {dueDate && <div style={{fontSize:9,color:"rgba(255,255,255,0.75)"}}>Due: {dueDate}</div>}
        </div>
      </div>
      <div style={{background:"#e0f2fe",padding:"10px 18px",display:"flex",gap:12,borderBottom:"2px solid "+ocean1}}>
        <div style={{flex:1}}>
          <div style={{fontSize:8,fontWeight:700,color:ocean2,textTransform:"uppercase",letterSpacing:1}}>Bill To</div>
          <div style={{fontSize:12,fontWeight:800,color:oceanDark,marginTop:2}}>{buyer.company||"Client Company"}</div>
          {buyer.gstin && <div style={{fontSize:9,color:"#0369a1"}}>GSTIN: {buyer.gstin}</div>}
          <div style={{fontSize:9,color:"#0284c7"}}>{[buyer.address,buyer.city,buyer.state].filter(Boolean).join(", ")}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:8,fontWeight:700,color:ocean2,textTransform:"uppercase",letterSpacing:1}}>Tax Type</div>
          <div style={{fontSize:11,fontWeight:800,color:oceanDark,marginTop:2}}>{isIntrastate?"CGST + SGST":"IGST"}</div>
          <div style={{fontSize:9,color:"#0284c7"}}>{placeOfSupply}</div>
        </div>
      </div>
      <ItemsTable computed={computed} isIntrastate={isIntrastate} fmt={fmt} thStyle={{background:oceanDark,color:"white"}} />
      <div style={{padding:"10px 18px",background:"#f0f9ff"}}>
        <TaxRows taxBreakdown={taxBreakdown} isIntrastate={isIntrastate} totalCess={totalCess} subTotal={subTotal} grandTotal={grandTotal} fmt={fmt} />
        <div style={{background:oceanGrad,color:"white",fontWeight:900,fontSize:13,padding:"10px 14px",marginTop:8,display:"flex",justifyContent:"space-between",borderRadius:8,boxShadow:"0 4px 14px rgba(14,165,233,0.35)"}}>
          <span>GRAND TOTAL</span><span>₹{fmt(grandTotal)}</span>
        </div>
        <div style={{fontSize:9,color:"#0369a1",marginTop:5,fontStyle:"italic"}}>Rupees <b>{numberToWords(Math.floor(grandTotal))} Only</b></div>
      </div>
      {(notes||terms) && <div style={{padding:"8px 18px",borderTop:"1px solid #bae6fd",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:10,color:"#0369a1",background:"#e0f2fe"}}>
        {notes && <div><div style={{fontWeight:700,color:ocean2,fontSize:8,textTransform:"uppercase"}}>Notes</div><p style={{margin:"3px 0 0"}}>{notes}</p></div>}
        {terms && <div><div style={{fontWeight:700,color:ocean2,fontSize:8,textTransform:"uppercase"}}>Terms</div><p style={{margin:"3px 0 0"}}>{terms}</p></div>}
      </div>}
      <div style={{height:4,background:oceanGrad}} />
    </div>
  );
}

/* ── Template 11: Dark Mode Invoice ── */
function TplDark({ theme,logo,seller,buyer,invoiceNo,invoiceDate,dueDate,computed,subTotal,totalCess,grandTotal,taxBreakdown,isIntrastate,placeOfSupply,notes,terms,fmt,numberToWords }) {
  const bg="#0f172a", surface="#1e293b", border="#334155", muted="#94a3b8", text="#f1f5f9";
  return (
    <div className="invoice-preview rounded-none overflow-x-hidden overflow-y-auto text-[11px] w-full shadow-[0_4px_32px_rgba(0,0,0,0.6),0_1px_4px_rgba(0,0,0,0.3)] aspect-[1/1.4142]" id="invoice-preview" style={{ fontFamily: '"Inter", sans-serif', background: bg, color: text }}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"16px 18px",borderBottom:`1px solid ${border}`}}>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {logo ? <img src={logo} alt="logo" style={{height:40,objectFit:"contain",borderRadius:6,background:surface,padding:2}} /> : <div style={{width:44,height:36,background:surface,border:`1px solid ${border}`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:muted,fontWeight:700}}>LOGO</div>}
          <div>
            <div style={{fontSize:14,fontWeight:900,color:text}}>{seller.company||"Your Company"}</div>
            {seller.gstin && <div style={{fontSize:8,color:muted,fontFamily:"monospace"}}>GSTIN: {seller.gstin}</div>}
            <div style={{fontSize:9,color:muted}}>{[seller.address,seller.city,seller.state].filter(Boolean).join(", ")}</div>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:16,fontWeight:900,color:theme,letterSpacing:2}}>TAX INVOICE</div>
          <div style={{fontSize:9,color:muted,marginTop:4}}>#{invoiceNo}</div>
          <div style={{fontSize:9,color:muted}}>{invoiceDate}</div>
          {dueDate && <div style={{fontSize:9,color:muted}}>Due: {dueDate}</div>}
        </div>
      </div>
      {/* Bill To */}
      <div style={{display:"flex",gap:12,padding:"10px 18px",borderBottom:`1px solid ${border}`,background:surface}}>
        <div style={{flex:1}}>
          <div style={{fontSize:8,fontWeight:700,color:theme,textTransform:"uppercase",letterSpacing:1}}>Bill To</div>
          <div style={{fontSize:12,fontWeight:800,color:text,marginTop:2}}>{buyer.company||"Client Company"}</div>
          {buyer.gstin && <div style={{fontSize:9,color:muted}}>GSTIN: {buyer.gstin}</div>}
          <div style={{fontSize:9,color:muted}}>{[buyer.address,buyer.city,buyer.state].filter(Boolean).join(", ")}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:8,fontWeight:700,color:theme,textTransform:"uppercase",letterSpacing:1}}>Tax</div>
          <div style={{fontSize:11,fontWeight:700,color:text,marginTop:2}}>{isIntrastate?"CGST + SGST":"IGST"}</div>
          <div style={{fontSize:9,color:muted}}>{placeOfSupply}</div>
        </div>
      </div>
      {/* Items */}
      <table className="w-full border-collapse text-[10px]" style={{background:bg}}>
        <thead><tr style={{background:surface,color:theme,borderBottom:`2px solid ${theme}`}}>
          <th style={{padding:"7px 8px",textAlign:"left",fontWeight:700,fontSize:10}}>sr. no</th>
          <th style={{padding:"7px 8px",textAlign:"left",fontWeight:700,fontSize:10}}>Description</th>
          <th style={{padding:"7px 8px",textAlign:"left",fontWeight:700,fontSize:10}}>HSN/SAC</th>
          <th style={{padding:"7px 8px",textAlign:"left",fontWeight:700,fontSize:10}}>Qty</th>
          <th style={{padding:"7px 8px",textAlign:"left",fontWeight:700,fontSize:10}}>Rate</th>
          {isIntrastate ? <><th style={{padding:"7px 8px",textAlign:"left",fontWeight:700,fontSize:10}}>CGST</th><th style={{padding:"7px 8px",textAlign:"left",fontWeight:700,fontSize:10}}>SGST</th></> : <th style={{padding:"7px 8px",textAlign:"left",fontWeight:700,fontSize:10}}>IGST</th>}
          <th style={{padding:"7px 8px",textAlign:"left",fontWeight:700,fontSize:10}}>Amount</th>
        </tr></thead>
        <tbody>{computed.map((it,idx) => (
          <tr key={it.id} style={{background:idx%2===0?bg:surface,color:text,borderBottom:`1px solid ${border}`}}>
            <td style={{padding:"6px 8px",fontSize:10}}>{idx+1}</td>
            <td style={{padding:"6px 8px",fontSize:10}}>{it.description||"—"}</td>
            <td style={{padding:"6px 8px",fontSize:10}}>{it.hsn||"—"}</td>
            <td style={{padding:"6px 8px",fontSize:10}}>{it.qty}</td>
            <td style={{padding:"6px 8px",fontSize:10}}>₹{fmt(it.rate)}</td>
            {isIntrastate ? <><td style={{padding:"6px 8px",fontSize:10}}>{it.taxRate/2}%</td><td style={{padding:"6px 8px",fontSize:10}}>{it.taxRate/2}%</td></> : <td style={{padding:"6px 8px",fontSize:10}}>{it.taxRate}%</td>}
            <td style={{padding:"6px 8px",fontSize:10,fontWeight:700,color:theme}}>₹{fmt(it.total)}</td>
          </tr>
        ))}</tbody>
      </table>
      {/* Totals */}
      <div style={{padding:"10px 18px",borderTop:`2px solid ${border}`}}>
        {Object.entries(taxBreakdown).map(([rate,{tax}]) => isIntrastate
          ? <div key={`c${rate}`} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:11,color:muted}}><span>CGST @ {rate/2}%</span><span>₹{fmt(tax/2)}</span></div>
          : <div key={`i${rate}`} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:11,color:muted}}><span>IGST @ {rate}%</span><span>₹{fmt(tax)}</span></div>
        )}
        {isIntrastate && Object.entries(taxBreakdown).map(([rate,{tax}]) => (
          <div key={`s${rate}`} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:11,color:muted}}><span>SGST @ {rate/2}%</span><span>₹{fmt(tax/2)}</span></div>
        ))}
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:muted,padding:"3px 0"}}><span>Sub Total</span><span>₹{fmt(subTotal)}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",background:theme,color:"white",fontWeight:900,fontSize:13,padding:"10px 12px",borderRadius:6,marginTop:8}}>
          <span>GRAND TOTAL</span><span>₹{fmt(grandTotal)}</span>
        </div>
        <div style={{fontSize:9,color:muted,marginTop:5,fontStyle:"italic"}}>Rupees <b>{numberToWords(Math.floor(grandTotal))} Only</b></div>
      </div>
      {(notes||terms) && <div style={{padding:"8px 18px",borderTop:`1px solid ${border}`,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:10,color:muted}}>
        {notes && <div><div style={{fontWeight:700,color:theme,fontSize:8,textTransform:"uppercase"}}>Notes</div><p style={{margin:"3px 0 0"}}>{notes}</p></div>}
        {terms && <div><div style={{fontWeight:700,color:theme,fontSize:8,textTransform:"uppercase"}}>Terms</div><p style={{margin:"3px 0 0"}}>{terms}</p></div>}
      </div>}
      <div style={{height:4,background:theme}} />
    </div>
  );
}

/* ── Template 12: Retro (sepia, typewriter feel) ── */
function TplRetro({ theme,logo,seller,buyer,invoiceNo,invoiceDate,dueDate,computed,subTotal,totalCess,grandTotal,taxBreakdown,isIntrastate,placeOfSupply,notes,terms,fmt,numberToWords }) {
  const sepia="#f5f0e8", sepiaText="#3d2b1f", sepiaAccent="#8b5e3c", sepiaBorder="#c8a882";
  return (
    <div className="invoice-preview rounded-none overflow-x-hidden overflow-y-auto text-[11px] w-full shadow-[0_4px_32px_rgba(0,0,0,0.6),0_1px_4px_rgba(0,0,0,0.3)] aspect-[1/1.4142]" id="invoice-preview" style={{ background: sepia, fontFamily: "'Courier New',Courier,monospace", color: sepiaText }}>
      {/* Retro header — centered */}
      <div style={{borderBottom:`3px double ${sepiaBorder}`,padding:"14px 20px",textAlign:"center",background:"#ede8dc"}}>
        <div style={{fontSize:20,fontWeight:900,letterSpacing:4,color:sepiaText,textTransform:"uppercase"}}>TAX INVOICE</div>
        <div style={{fontSize:9,color:sepiaAccent,marginTop:4,letterSpacing:2}}>★ GST COMPLIANT ★</div>
      </div>
      {/* Company + meta */}
      <div style={{display:"flex",justifyContent:"space-between",padding:"12px 20px",borderBottom:`1px dashed ${sepiaBorder}`}}>
        <div>
          {logo ? <img src={logo} alt="logo" style={{height:34,objectFit:"contain",marginBottom:4,filter:"sepia(0.5)"}} /> : null}
          <div style={{fontSize:13,fontWeight:700,color:sepiaText,textDecoration:"underline"}}>{seller.company||"Your Company"}</div>
          {seller.gstin && <div style={{fontSize:9,color:sepiaAccent}}>GSTIN: {seller.gstin}</div>}
          <div style={{fontSize:9,color:sepiaAccent}}>{[seller.address,seller.city,seller.state].filter(Boolean).join(", ")}</div>
        </div>
        <div style={{textAlign:"right",fontSize:10,color:sepiaText}}>
          <div>No: <b>{invoiceNo}</b></div>
          <div>Date: <b>{invoiceDate}</b></div>
          {dueDate && <div>Due: <b>{dueDate}</b></div>}
        </div>
      </div>
      {/* Bill To */}
      <div style={{padding:"8px 20px",borderBottom:`1px dashed ${sepiaBorder}`,display:"flex",gap:16}}>
        <div style={{flex:1}}>
          <div style={{fontSize:8,fontWeight:700,color:sepiaAccent,textTransform:"uppercase",letterSpacing:2,marginBottom:2}}>Bill To:</div>
          <div style={{fontSize:12,fontWeight:700,color:sepiaText}}>{buyer.company||"Client Company"}</div>
          {buyer.gstin && <div style={{fontSize:9,color:sepiaAccent}}>GSTIN: {buyer.gstin}</div>}
          <div style={{fontSize:9,color:sepiaAccent}}>{[buyer.address,buyer.city,buyer.state].filter(Boolean).join(", ")}</div>
        </div>
        <div style={{textAlign:"right",fontSize:9,color:sepiaAccent}}>
          <div>Place: {placeOfSupply}</div>
          <div style={{fontWeight:700,color:sepiaText}}>{isIntrastate?"CGST + SGST":"IGST"}</div>
        </div>
      </div>
      {/* Items — retro table */}
      <table className="w-full border-collapse text-[9px]" style={{borderCollapse:"collapse",width:"100%",fontSize:9}}>
        <thead><tr style={{background:"#ede8dc",borderTop:`2px solid ${sepiaBorder}`,borderBottom:`2px solid ${sepiaBorder}`}}>
          {["sr. no","Description","HSN/SAC","Qty","Rate",isIntrastate?"CGST":"IGST",isIntrastate?"SGST":null,"Amount"].filter(Boolean).map((h,i)=>(
            <th key={i} style={{padding:"5px 8px",textAlign:"left",color:sepiaText,fontFamily:"'Courier New',monospace",textTransform:"uppercase",fontSize:8,letterSpacing:1}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>{computed.map((it,idx)=>(
          <tr key={it.id} style={{borderBottom:`1px dashed ${sepiaBorder}`,background:idx%2===0?sepia:"#f0ebe0"}}>
            <td style={{padding:"5px 8px"}}>{idx+1}</td>
            <td style={{padding:"5px 8px"}}>{it.description||"—"}</td>
            <td style={{padding:"5px 8px"}}>{it.hsn||"—"}</td>
            <td style={{padding:"5px 8px"}}>{it.qty}</td>
            <td style={{padding:"5px 8px"}}>₹{fmt(it.rate)}</td>
            {isIntrastate ? <><td style={{padding:"5px 8px"}}>{it.taxRate/2}%</td><td style={{padding:"5px 8px"}}>{it.taxRate/2}%</td></> : <td style={{padding:"5px 8px"}}>{it.taxRate}%</td>}
            <td style={{padding:"5px 8px",fontWeight:700}}>₹{fmt(it.total)}</td>
          </tr>
        ))}</tbody>
      </table>
      {/* Totals */}
      <div style={{padding:"10px 20px",borderTop:`2px solid ${sepiaBorder}`}}>
        <TaxRows taxBreakdown={taxBreakdown} isIntrastate={isIntrastate} totalCess={totalCess} subTotal={subTotal} grandTotal={grandTotal} fmt={fmt} />
        <div style={{display:"flex",justifyContent:"space-between",borderTop:`3px double ${sepiaBorder}`,borderBottom:`3px double ${sepiaBorder}`,padding:"8px 0",marginTop:6,fontWeight:900,fontSize:13,color:sepiaText,fontFamily:"'Courier New',monospace"}}>
          <span>GRAND TOTAL</span><span>₹{fmt(grandTotal)}</span>
        </div>
        <div style={{fontSize:9,color:sepiaAccent,marginTop:5,fontStyle:"italic"}}>Rupees <b>{numberToWords(Math.floor(grandTotal))} Only</b></div>
      </div>
      {(notes||terms) && <div style={{padding:"8px 20px",borderTop:`1px dashed ${sepiaBorder}`,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:9,color:sepiaAccent}}>
        {notes && <div><div style={{fontWeight:700,textTransform:"uppercase",letterSpacing:1,fontSize:8}}>Notes:</div><p style={{margin:"3px 0 0"}}>{notes}</p></div>}
        {terms && <div><div style={{fontWeight:700,textTransform:"uppercase",letterSpacing:1,fontSize:8}}>Terms:</div><p style={{margin:"3px 0 0"}}>{terms}</p></div>}
      </div>}
      <div style={{padding:"8px 20px",textAlign:"center",borderTop:`1px solid ${sepiaBorder}`,fontSize:8,color:sepiaAccent,letterSpacing:1}}>
        ✦ THANK YOU FOR YOUR BUSINESS ✦
      </div>
    </div>
  );
}
