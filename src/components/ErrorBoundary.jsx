import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("UtilsFlow ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="tool-page fade-in" style={{ textAlign: "center" }}>
          <div className="tool-page-inner">
            <p style={{ fontSize: "64px" }}>⚠️</p>
            <h1 className="tool-title">Something went wrong</h1>
            <p className="tool-description">
              This tool hit an unexpected error. Try refreshing the page.
            </p>
            <button
              className="btn-primary"
              style={{ marginTop: "20px" }}
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              🔄 Try Again
            </button>
            <a href="/" className="btn-secondary" style={{ marginTop: "12px", marginLeft: "12px" }}>
              🏠 Go Home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
