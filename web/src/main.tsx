import React from "react";
import { createRoot } from "react-dom/client";

import BmiHealthHelloWorld from "./component";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Widget Error Boundary caught error:", error, errorInfo);
    // Log to server
    try {
        fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                event: "crash",
                data: {
                    error: error?.message || "Unknown error",
                    stack: error?.stack,
                    componentStack: errorInfo?.componentStack
                }
            })
        }).catch(e => console.error("Failed to report crash", e));
    } catch (e) {
        // Ignore reporting errors
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, textAlign: "center", fontFamily: "sans-serif", color: "#DC2626" }}>
          <h3>Something went wrong.</h3>
          <p>Please try refreshing the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Add hydration type definitions
interface OpenAIGlobals {
  toolOutput?: any;
  structuredContent?: any;
  toolInput?: any;
  result?: {
    structuredContent?: any;
  };
}

// Hydration Helper
const getHydrationData = (): any => {
  // Check for window.openai
  if (typeof window === 'undefined') return {};
  
  const oa = (window as any).openai as OpenAIGlobals;
  if (!oa) return {};

  // Prioritize sources as per reference implementation
  const candidates = [
    oa.toolOutput,
    oa.structuredContent,
    oa.result?.structuredContent,
    oa.toolInput
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === 'object' && Object.keys(candidate).length > 0) {
      console.log("[Hydration] Found data:", candidate);
      return candidate;
    }
  }
  
  return {};
};

const container = document.getElementById("bmi-health-calculator-root");

if (!container) {
  throw new Error("bmi-health-calculator-root element not found");
}

// Get initial data
const initialData = getHydrationData();

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BmiHealthHelloWorld initialData={initialData} />
    </ErrorBoundary>
  </React.StrictMode>
);

// Listen for late hydration events (Apps SDK pattern)
window.addEventListener('openai:set_globals', (ev: any) => {
  const globals = ev?.detail?.globals;
  if (globals) {
    // We might need to re-render or update state if this event fires late
    // For now, we rely on the component to handle updates if we passed a way to do so,
    // or just log it. A full implementation would pass a state setter down or use a context.
    console.log("[Hydration] Late event received:", globals);
  }
});
