import { Link } from "react-router-dom";

function Breadcrumb({ toolName, category, categoryPath }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: "20px" }}>
      <ol
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          listStyle: "none",
          flexWrap: "wrap",
          fontSize: "13px",
          color: "var(--text-secondary)",
        }}
      >
        <li>
          <Link
            to="/"
            style={{ color: "var(--text-secondary)", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.target.style.color = "var(--primary-light)")}
            onMouseLeave={(e) => (e.target.style.color = "var(--text-secondary)")}
          >
            🏠 Home
          </Link>
        </li>
        <li aria-hidden="true" style={{ opacity: 0.4 }}>›</li>

        {category && categoryPath ? (
          <>
            <li>
              <Link
                to={categoryPath}
                style={{ color: "var(--text-secondary)", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.target.style.color = "var(--primary-light)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--text-secondary)")}
              >
                {category}
              </Link>
            </li>
            <li aria-hidden="true" style={{ opacity: 0.4 }}>›</li>
          </>
        ) : null}

        <li aria-current="page" style={{ color: "var(--text-primary)", fontWeight: 500 }}>
          {toolName}
        </li>
      </ol>
    </nav>
  );
}

export default Breadcrumb;
