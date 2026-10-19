import React, { useState, useEffect } from "react";

function renderInlineFormatting(str) {
  if (!str) return "";
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function FormattedReport({ text }) {
  if (!text) return null;
  const lines = text.split("\n");

  return (
    <div className="formatted-ai-report" style={{ lineHeight: 1.7, fontSize: "0.95rem" }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} style={{ height: "6px" }} />;

        if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
          const headerText = trimmed.replace(/^#+\s*/, "");
          return (
            <h4 key={idx} style={{ margin: "16px 0 8px", color: "var(--primary-blue)", fontSize: "1.05rem" }}>
              {headerText}
            </h4>
          );
        }

        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const itemText = trimmed.substring(2);
          return (
            <div key={idx} style={{ display: "flex", gap: "8px", margin: "4px 0", paddingLeft: "10px" }}>
              <span style={{ color: "var(--primary-blue)", fontWeight: 700 }}>•</span>
              <div>{renderInlineFormatting(itemText)}</div>
            </div>
          );
        }

        if (trimmed === "---") {
          return <hr key={idx} style={{ margin: "14px 0", border: "none", borderTop: "1px solid var(--border-color)" }} />;
        }

        if (trimmed.startsWith("*(💡") || trimmed.startsWith("(💡")) {
          return (
            <div key={idx} className="notification-banner" style={{ margin: "14px 0", fontSize: "0.85rem" }}>
              {renderInlineFormatting(trimmed.replace(/^\*\(|\)\*$/g, ""))}
            </div>
          );
        }

        return (
          <p key={idx} style={{ margin: "4px 0" }}>
            {renderInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function AIPredictor() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState("");
  const [aiSource, setAiSource] = useState("");
  const [telemetryCount, setTelemetryCount] = useState(0);

  // Chat state
  const [userQuestion, setUserQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  // 1. Call Gemini AI to analyze recent MongoDB telemetry
  const runGeminiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setAiReport(data.analysis);
        setAiSource(data.source || "Google Gemini AI");
        setTelemetryCount(data.dataCount || 0);
      } else {
        setAiReport("Failed to generate AI analysis: " + data.message);
      }
    } catch (err) {
      console.error("AI Analysis error:", err);
      setAiReport("Network error connecting to backend Gemini AI endpoint.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 2. Chat with Gemini about pod telemetry
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    setIsAsking(true);
    setChatAnswer("");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
      });
      const data = await res.json();
      if (data.success) {
        setChatAnswer(data.reply);
      } else {
        setChatAnswer("AI Error: " + data.message);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setChatAnswer("Error connecting to Gemini API.");
    } finally {
      setIsAsking(false);
    }
  };

  useEffect(() => {
    runGeminiAnalysis();
  }, []);

  return (
    <div className="ai-predictor-container">
      <div className="page-header flex-between">
        <div>
          <h2>SomaiyaPod AI &amp; Gemini Diagnostics</h2>
          <p className="subtitle">
            Autonomous Machine Learning Telemetry Assessment &amp; Google Gemini AI Insights
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={runGeminiAnalysis}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing with Gemini..." : "✨ Run Gemini Diagnostics"}
        </button>
      </div>

      {/* Main Analysis Card */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div className="flex-between" style={{ marginBottom: "14px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
          <div>
            <span className="card-title">AI Diagnostics Engine</span>
            <h3 style={{ margin: 0 }}>Mission Flight Analysis</h3>
          </div>
          <div className="flex-between" style={{ gap: "8px" }}>
            <span className="code-tag">Source: {aiSource || "Gemini Engine"}</span>
            <span className="badge badge-nominal">{telemetryCount} Records Analyzed</span>
          </div>
        </div>

        {isAnalyzing ? (
          <div className="loading-container">
            <p>Processing MongoDB telemetry with Gemini AI...</p>
          </div>
        ) : (
          <FormattedReport text={aiReport} />
        )}
      </div>

      {/* Gemini Chat Question Section */}
      <div className="card" style={{ marginTop: "20px" }}>
        <h3>💬 Ask Gemini AI Flight Engineer</h3>
        <p className="form-subtitle" style={{ marginBottom: "14px" }}>
          Ask any question about SomaiyaPod health, battery life, orbital decay, or sensor anomalies.
        </p>

        <form onSubmit={handleAskQuestion}>
          <div className="flex-between" style={{ gap: "10px", alignItems: "stretch" }}>
            <input
              type="text"
              placeholder="e.g. Is our battery drain normal? What is the predicted next pass window?"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              className="filter-input"
              style={{ flex: 1, padding: "10px 14px", fontSize: "0.95rem" }}
              disabled={isAsking}
            />
            <button
              type="submit"
              className="primary-btn"
              disabled={isAsking || !userQuestion.trim()}
              style={{ padding: "0 22px" }}
            >
              {isAsking ? "Thinking..." : "Ask Gemini"}
            </button>
          </div>
        </form>

        {/* Quick Suggestion Chips */}
        <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", alignSelf: "center" }}>Suggestions:</span>
          {[
            "How is the thermal temperature trend?",
            "What happens if battery drops below 30%?",
            "Is the orbital altitude stable?",
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="filter-btn"
              style={{ fontSize: "0.8rem", padding: "3px 10px" }}
              onClick={() => setUserQuestion(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {chatAnswer && (
          <div
            className="card"
            style={{
              marginTop: "16px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              whiteSpace: "pre-line",
              lineHeight: 1.6,
            }}
          >
            <div style={{ fontWeight: 700, color: "var(--accent-green)", marginBottom: "6px" }}>
              🤖 Gemini AI Response:
            </div>
            <div>{chatAnswer}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIPredictor;
