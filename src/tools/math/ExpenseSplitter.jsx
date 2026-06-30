// ============================================================
// ExpenseSplitter.jsx — Group Expense Splitter Tool
// ============================================================
import { useState } from "react";

function ExpenseSplitter() {
  const [people, setPeople] = useState(["Alice", "Bob", "Charlie"]);
  const [newPerson, setNewPerson] = useState("");
  const [expenses, setExpenses] = useState([
    { description: "Dinner", amount: 900, paidBy: "Alice" },
    { description: "Taxi", amount: 300, paidBy: "Bob" },
  ]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("Alice");

  function addPerson() {
    const name = newPerson.trim();
    if (!name || people.includes(name)) return;
    setPeople([...people, name]);
    setNewPerson("");
  }

  function removePerson(name) {
    setPeople(people.filter(p => p !== name));
    setExpenses(expenses.filter(e => e.paidBy !== name));
  }

  function addExpense() {
    const amt = parseFloat(amount);
    if (!desc.trim() || !amt || amt <= 0 || !paidBy) return;
    setExpenses([...expenses, { description: desc.trim(), amount: amt, paidBy }]);
    setDesc(""); setAmount("");
  }

  function removeExpense(i) {
    setExpenses(expenses.filter((_, idx) => idx !== i));
  }

  function calculateSplit() {
    if (people.length === 0) return [];
    const totalPerPerson = expenses.reduce((sum, e) => sum + e.amount, 0) / people.length;
    const paid = {};
    people.forEach(p => (paid[p] = 0));
    expenses.forEach(e => { if (paid[e.paidBy] !== undefined) paid[e.paidBy] += e.amount; });
    const balance = {};
    people.forEach(p => (balance[p] = paid[p] - totalPerPerson));
    const settlements = [];
    const creditors = people.filter(p => balance[p] > 0.01).map(p => ({ name: p, amount: balance[p] }));
    const debtors = people.filter(p => balance[p] < -0.01).map(p => ({ name: p, amount: -balance[p] }));
    let i = 0, j = 0;
    while (i < creditors.length && j < debtors.length) {
      const transfer = Math.min(creditors[i].amount, debtors[j].amount);
      settlements.push({ from: debtors[j].name, to: creditors[i].name, amount: transfer });
      creditors[i].amount -= transfer;
      debtors[j].amount -= transfer;
      if (creditors[i].amount < 0.01) i++;
      if (debtors[j].amount < 0.01) j++;
    }
    return settlements;
  }

  const settlements = calculateSplit();
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const perPerson = people.length > 0 ? totalExpense / people.length : 0;

  return (
    <div className="tool-page fade-in">
      <div className="tool-page-inner">
        <h1 className="tool-title">🧾 Expense Splitter</h1>
        <p className="tool-description">Add people and expenses, then see who owes whom.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* People */}
          <div className="tool-box">
            <p className="label">👥 Group Members</p>
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <input id="new-person-input" className="input-field" placeholder="Name..." value={newPerson}
                onChange={e => setNewPerson(e.target.value)} onKeyDown={e => e.key === "Enter" && addPerson()} />
              <button className="btn-primary" onClick={addPerson} style={{ padding: "12px 16px" }}>+</button>
            </div>
            <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {people.map(p => (
                <div key={p} style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "20px", padding: "6px 12px", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  {p}
                  <button onClick={() => removePerson(p)} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}>×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Add expense */}
          <div className="tool-box">
            <p className="label">➕ Add Expense</p>
            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <input className="input-field" placeholder="Description..." value={desc} onChange={e => setDesc(e.target.value)} />
              <input className="input-field" type="number" placeholder="Amount (₹)..." value={amount} onChange={e => setAmount(e.target.value)} />
              <select className="input-field" value={paidBy} onChange={e => setPaidBy(e.target.value)}>
                {people.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <button id="add-expense-btn" className="btn-primary" onClick={addExpense}>Add Expense</button>
            </div>
          </div>
        </div>

        {/* Expense list */}
        {expenses.length > 0 && (
          <div className="tool-box" style={{ marginTop: "20px" }}>
            <p className="label">💳 Expenses — Total: ₹{totalExpense.toFixed(0)} | Per person: ₹{perPerson.toFixed(0)}</p>
            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {expenses.map((e, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: "8px" }}>
                  <span>{e.description}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{e.paidBy} paid</span>
                  <span style={{ color: "#a78bfa", fontWeight: 600 }}>₹{e.amount}</span>
                  <button onClick={() => removeExpense(i)} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}>🗑️</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settlements */}
        <div className="result-box" style={{ marginTop: "20px" }}>
          <p className="label" style={{ marginBottom: "12px" }}>💸 Who Pays Whom</p>
          {settlements.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>
              {expenses.length === 0 ? "Add expenses to see settlements." : "✅ All settled up!"}
            </p>
          ) : settlements.map((s, i) => (
            <div key={i} style={{ padding: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "8px", marginBottom: "8px" }}>
              <strong style={{ color: "var(--danger)" }}>{s.from}</strong>
              <span style={{ color: "var(--text-secondary)" }}> pays </span>
              <strong style={{ color: "var(--success)" }}>{s.to}</strong>
              <span style={{ float: "right", color: "#a78bfa", fontWeight: 700 }}>₹{s.amount.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExpenseSplitter;
