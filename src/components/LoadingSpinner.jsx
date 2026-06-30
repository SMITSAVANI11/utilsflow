// LoadingSpinner.jsx — Shown while lazy routes are loading
function LoadingSpinner() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "3px solid rgba(124, 58, 237, 0.2)",
          borderTop: "3px solid #7c3aed",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Loading…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default LoadingSpinner;
