// HabitTracker.jsx v2 — TODAY fixed to compute dynamically and local timezone-safe
import { useState, useEffect } from "react";
import ToolLayout from "../../components/ToolLayout";

const STORAGE_KEY = "utilsflow-habits";

// ✅ local timezone-safe date string helper (YYYY-MM-DD)
function getLocalDateString(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Load from localStorage
function loadHabits() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

// ✅ local timezone-safe streak logic
function getStreak(completedDates) {
  if (!completedDates.length) return 0;
  const sorted = [...completedDates].sort().reverse();
  let streak = 0;
  let expected = new Date();

  // If not completed today, check if yesterday was completed to count the streak
  const todayStr = getLocalDateString(expected);
  if (!sorted.includes(todayStr)) {
    expected.setDate(expected.getDate() - 1);
  }

  for (const d of sorted) {
    const expectedStr = getLocalDateString(expected);
    if (d === expectedStr) {
      streak++;
      expected.setDate(expected.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function HabitTracker() {
  const [habits, setHabits] = useState(loadHabits);
  const [newHabit, setNewHabit] = useState("");
  const [newEmoji, setNewEmoji] = useState("⭐");
  const TODAY = getLocalDateString(); // ✅ local timezone-safe

  const EMOJIS = ["⭐", "💪", "📚", "🏃", "🧘", "💧", "🥗", "😴", "✍️", "🎯"];

  // Save to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  // Add a new habit
  function addHabit() {
    const name = newHabit.trim();
    if (!name) return;
    setHabits([...habits, { id: Date.now(), name, emoji: newEmoji, completedDates: [] }]);
    setNewHabit("");
  }

  // Toggle today's completion for a habit
  function toggleToday(id) {
    setHabits(habits.map(h => {
      if (h.id !== id) return h;
      const already = h.completedDates.includes(TODAY);
      return {
        ...h,
        completedDates: already
          ? h.completedDates.filter(d => d !== TODAY)
          : [...h.completedDates, TODAY]
      };
    }));
  }

  // Delete a habit
  function deleteHabit(id) {
    setHabits(habits.filter(h => h.id !== id));
  }

  const completedToday = habits.filter(h => h.completedDates.includes(TODAY)).length;

  return (
    <ToolLayout
      toolId="habit-tracker"
      title="Habit Tracker"
      description="Track your daily habits and build streaks. Data saved in your browser. Free, no signup."
      path="/tools/habit-tracker"
      category="Productivity"
      categoryPath="/?cat=productivity"
    >
      <h1 className="tool-title">✅ Habit Tracker</h1>
      <p className="tool-description">
        Track your daily habits and build winning streaks. Data is saved in your browser.
      </p>

      {/* Progress bar for today */}
      {habits.length > 0 && (
        <div className="tool-box" style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span className="label">Today's Progress</span>
            <span style={{ color: "#a78bfa", fontWeight: 700 }}>{completedToday}/{habits.length}</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "8px", height: "12px", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${habits.length > 0 ? (completedToday / habits.length) * 100 : 0}%`,
              background: "linear-gradient(90deg, var(--primary), var(--success))",
              transition: "width 0.5s ease"
            }} />
          </div>
          {completedToday === habits.length && habits.length > 0 && (
            <p style={{ color: "var(--success)", marginTop: "8px", fontSize: "14px" }}>
              🎉 All habits completed for today! Amazing work!
            </p>
          )}
        </div>
      )}

      {/* Add habit form */}
      <div className="tool-box" style={{ marginBottom: "20px" }}>
        <p className="label">➕ Add New Habit</p>
        <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
          {/* Emoji picker */}
          <select value={newEmoji} onChange={e => setNewEmoji(e.target.value)}
            className="input-field" style={{ width: "80px" }}>
            {EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <input id="new-habit-input" className="input-field" style={{ flex: 1, minWidth: "150px" }}
            placeholder="e.g. Read 20 pages, Drink 2L water..."
            value={newHabit} onChange={e => setNewHabit(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addHabit()} />
          <button className="btn-primary" onClick={addHabit} style={{ padding: "12px 20px" }}>Add</button>
        </div>
      </div>

      {/* Habit list */}
      {habits.length === 0 ? (
        <div className="result-box" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ fontSize: "40px" }}>🌱</p>
          <p style={{ color: "var(--text-secondary)", marginTop: "12px" }}>No habits yet. Add your first one above!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {habits.map(h => {
            const done = h.completedDates.includes(TODAY);
            const streak = getStreak(h.completedDates);
            return (
              <div key={h.id} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "16px", borderRadius: "12px",
                background: done ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${done ? "rgba(16,185,129,0.3)" : "var(--border)"}`,
                transition: "all 0.3s ease"
              }}>
                {/* Check button */}
                <button onClick={() => toggleToday(h.id)} style={{
                  width: "36px", height: "36px", borderRadius: "50%", border: "2px solid",
                  borderColor: done ? "var(--success)" : "var(--border)",
                  background: done ? "var(--success)" : "transparent",
                  color: "white", fontSize: "18px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s", flexShrink: 0
                }}>
                  {done ? "✓" : ""}
                </button>

                {/* Emoji + name */}
                <span style={{ fontSize: "22px" }}>{h.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, textDecoration: done ? "line-through" : "none", color: done ? "var(--text-secondary)" : "var(--text-primary)" }}>
                    {h.name}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {streak > 0 ? `🔥 ${streak} day streak` : "Start your streak today!"}
                  </p>
                </div>

                {/* Total completions */}
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  {h.completedDates.length}×
                </span>

                {/* Delete */}
                <button onClick={() => deleteHabit(h.id)} style={{
                  background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "16px"
                }}>🗑️</button>
              </div>
            );
          })}
        </div>
      )}
    </ToolLayout>
  );
}

export default HabitTracker;
