// CountdownTimer.jsx — Countdown to any date/event
import { useState, useEffect, useRef } from "react";
import ToolLayout from "../../components/ToolLayout";

// Extract helper component to top level to avoid re-creation on every tick
const Unit = ({ value, label }) => (
  <div style={{ textAlign:"center",flex:1 }}>
    <div style={{ fontSize:"clamp(32px,6vw,56px)",fontWeight:800,fontFamily:"JetBrains Mono, monospace",color:"var(--primary-light)",lineHeight:1.1,background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.2)",borderRadius:"16px",padding:"20px 10px" }}>
      {String(value).padStart(2,"0")}
    </div>
    <p style={{ marginTop:"8px",fontSize:"12px",color:"var(--text-secondary)",textTransform:"uppercase",letterSpacing:"1px" }}>{label}</p>
  </div>
);

function CountdownTimer() {
  const [targetDate, setTargetDate] = useState("");
  const [eventName,  setEventName]  = useState("");
  const [timeLeft,   setTimeLeft]   = useState(null);
  const [running,    setRunning]    = useState(false);
  const intervalRef = useRef(null);

  function startCountdown() {
    if (!targetDate) return;
    const target = new Date(targetDate).getTime();
    if (isNaN(target) || target <= Date.now()) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) {
        clearInterval(intervalRef.current);
        setRunning(false);
        setTimeLeft({ days:0,hours:0,minutes:0,seconds:0 });
        return;
      }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
  }

  function stop() {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTimeLeft(null);
  }

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const isPast = targetDate && new Date(targetDate).getTime() <= Date.now();

  return (
    <ToolLayout
      toolId="countdown-timer"
      title="Countdown Timer"
      description="Count down to any date or event. Set a custom event name and watch the clock tick. Free online countdown timer."
      path="/tools/countdown-timer"
      category="Productivity"
      categoryPath="/?cat=productivity"
    >
      <h1 className="tool-title">⏳ Countdown Timer</h1>
      <p className="tool-description">Count down to any date — a deadline, birthday, event, or milestone.</p>

      <div className="tool-box">
        <div style={{ marginBottom:"16px" }}>
          <label className="label" htmlFor="event-name">Event Name (optional)</label>
          <input id="event-name" className="input-field" value={eventName} onChange={(e)=>setEventName(e.target.value)} placeholder="e.g. New Year 2026, Product Launch…" />
        </div>
        <div style={{ marginBottom:"20px" }}>
          <label className="label" htmlFor="target-date">Target Date & Time</label>
          <input id="target-date" className="input-field" type="datetime-local" value={targetDate} onChange={(e)=>setTargetDate(e.target.value)} min={new Date().toISOString().slice(0,16)} />
        </div>
        {isPast && <p style={{ color:"var(--danger)",fontSize:"13px",marginBottom:"12px" }}>⚠️ Please select a future date and time.</p>}
        <div style={{ display:"flex",gap:"10px" }}>
          <button id="start-countdown-btn" className="btn-primary" onClick={startCountdown} disabled={running||!targetDate||isPast} style={{ flex:1 }}>▶ Start Countdown</button>
          {running && <button className="btn-secondary" onClick={stop} style={{ flex:1 }}>⏹ Stop</button>}
        </div>
      </div>

      {timeLeft && (
        <div style={{ marginTop:"30px" }}>
          {eventName && <h2 style={{ textAlign:"center",marginBottom:"20px",fontSize:"20px",color:"var(--text-secondary)" }}>{eventName}</h2>}
          <div style={{ display:"flex",gap:"12px" }}>
            <Unit value={timeLeft.days}    label="Days" />
            <Unit value={timeLeft.hours}   label="Hours" />
            <Unit value={timeLeft.minutes} label="Minutes" />
            <Unit value={timeLeft.seconds} label="Seconds" />
          </div>
          {timeLeft.days===0&&timeLeft.hours===0&&timeLeft.minutes===0&&timeLeft.seconds===0&&(
            <div className="result-box" style={{ textAlign:"center",marginTop:"20px",fontSize:"20px" }}>🎉 {eventName||"Time's up!"}</div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}

export default CountdownTimer;
