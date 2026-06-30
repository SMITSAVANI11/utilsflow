import { useState, useMemo } from "react";
import ToolLayout from "../../components/ToolLayout";

const TIME_ZONES = [
  { name: "UTC", offset: 0, label: "Coordinated Universal Time (UTC)" },
  { name: "EST / EDT", offset: -5, label: "Eastern Standard Time (New York)" },
  { name: "PST / PDT", offset: -8, label: "Pacific Standard Time (Los Angeles)" },
  { name: "GMT / BST", offset: 0, label: "Greenwich Mean Time (London)" },
  { name: "IST", offset: 5.5, label: "Indian Standard Time (New Delhi)" },
  { name: "JST", offset: 9, label: "Japan Standard Time (Tokyo)" },
  { name: "AEST", offset: 10, label: "Australian Eastern Time (Sydney)" },
  { name: "CET", offset: 1, label: "Central European Time (Paris)" },
  { name: "GST", offset: 4, label: "Gulf Standard Time (Dubai)" },
  { name: "SGT", offset: 8, label: "Singapore Time (Singapore)" }
];

function TimeZoneConverter() {
  const [baseTime, setBaseTime] = useState(() => {
    // Current date/time in YYYY-MM-DDTHH:MM format
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  const [searchQuery, setSearchQuery] = useState("");

  const parsedBaseDate = useMemo(() => {
    try {
      return new Date(baseTime);
    } catch (e) {
      return new Date();
    }
  }, [baseTime]);

  const convertedTimes = useMemo(() => {
    // Calculate base UTC time in ms
    const localOffsetMs = parsedBaseDate.getTimezoneOffset() * 60 * 1000;
    const utcTimeMs = parsedBaseDate.getTime() + localOffsetMs;

    return TIME_ZONES.map(tz => {
      const targetTimeMs = utcTimeMs + (tz.offset * 60 * 60 * 1000);
      const targetDate = new Date(targetTimeMs);
      return {
        ...tz,
        formattedTime: targetDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        formattedDate: targetDate.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }),
        offsetStr: tz.offset >= 0 ? `+${tz.offset}` : tz.offset
      };
    });
  }, [parsedBaseDate]);

  const filteredTimes = useMemo(() => {
    if (!searchQuery.trim()) return convertedTimes;
    return convertedTimes.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [convertedTimes, searchQuery]);

  return (
    <ToolLayout
      toolId="timezone-converter"
      title="Time Zone Converter"
      description="Translate time zones, synchronize schedules, look up local timezone differences, and map international times client-side."
      path="/tools/timezone-converter"
      category="unit-converter"
      categoryPath="/?cat=unit-converter"
    >
      <div className="tool-box">
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }} className="editor-grid">
          <div>
            <label className="label" htmlFor="tz-base">Base Date & Time (Your Local Time)</label>
            <input
              id="tz-base"
              type="datetime-local"
              className="input-field"
              value={baseTime}
              onChange={e => setBaseTime(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="tz-search">Filter / Search Time Zones</label>
            <input
              id="tz-search"
              type="text"
              className="input-field"
              placeholder="Search e.g. London, JST..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Time zones list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredTimes.map((tz, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "14px 18px",
                gap: "12px"
              }}
            >
              <div>
                <div style={{ fontSize: "15px", fontWeight: "bold", color: "var(--primary-light)" }}>
                  {tz.name} <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: "normal" }}>({tz.offsetStr} hrs UTC)</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  {tz.label}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "var(--text-primary)" }}>
                  {tz.formattedTime}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  {tz.formattedDate}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </ToolLayout>
  );
}

export default TimeZoneConverter;
