
"use client";

import { useState } from "react";

const tools = [
  {
    name: "Get Repository Statistics",
    id: "get_repo_stats",
    description: "View stars, forks, language, and open issues.",
  },
  {
    name: "List Recent Commits",
    id: "list_recent_commits",
    description: "Retrieve recent commits from a GitHub repository.",
  },
  {
    name: "Search Repository Issues",
    id: "search_issues",
    description: "Search issues in a GitHub repository.",
  },
  {
    name: "Get Contributor Activity",
    id: "get_contributor_activity",
    description: "View contributor activity for a repository.",
  },
];

export default function Home() {
  const [selectedTool, setSelectedTool] = useState("get_repo_stats");
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState("1");
  const [perPage, setPerPage] = useState("10");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState("");

  async function runTool() {
    if (!owner.trim() || !repo.trim()) {
      setError("Please enter both the GitHub owner and repository name.");
      return;
    }

    if (
      !Number.isInteger(Number(page)) ||
      Number(page) < 1 ||
      !Number.isInteger(Number(perPage)) ||
      Number(perPage) < 1 ||
      Number(perPage) > 100
    ) {
      setError("Page number must be at least 1, and results per page must be between 1 and 100.");
      return;
    }

    if (selectedTool === "search_issues" && !query.trim()) {
      setError("Please enter a search term for repository issues.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch("/api/tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool: selectedTool,
          owner: owner.trim(),
          repo: repo.trim(),
          query: query.trim(),
          page: Number(page),
          perPage: Number(perPage),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Tool execution failed.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: 12,
    marginTop: 6,
    marginBottom: 16,
    border: "1px solid #475569",
    borderRadius: 8,
    background: "#0f172a",
    color: "#f8fafc",
  };

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 24,
        color: "#f8fafc",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <p style={{ color: "#60a5fa" }}>MODEL CONTEXT PROTOCOL</p>

      <h1>GitHub Repo Analyzer MCP</h1>

      <p>
        Analyze GitHub repositories using four tools through one interface.
      </p>

      <h2>Available Tools</h2>

      <div style={{ display: "grid", gap: 16 }}>
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => {
              setSelectedTool(tool.id);
              setResult(null);
              setError("");
            }}
            aria-pressed={selectedTool === tool.id}
            style={{
              padding: 20,
              textAlign: "left",
              color: "#f8fafc",
              background:
                selectedTool === tool.id ? "#1e3a5f" : "#111827",
              border:
                selectedTool === tool.id
                  ? "2px solid #60a5fa"
                  : "1px solid #334155",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            <h3>{tool.name}</h3>

            <code style={{ color: "#60a5fa" }}>{tool.id}</code>

            <p>{tool.description}</p>

            <span>
              {selectedTool === tool.id
                ? "Selected ✓"
                : "Click to select →"}
            </span>
          </button>
        ))}
      </div>

      <section
        style={{
          marginTop: 28,
          padding: 24,
          border: "1px solid #475569",
          borderRadius: 12,
        }}
      >
        <h2>Run Selected Tool</h2>

        <p>
          Selected tool: <code>{selectedTool}</code>
        </p>

        <label htmlFor="owner">GitHub Owner</label>
        <input
          id="owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="Enter owner, e.g. facebook"
          autoComplete="off"
          style={inputStyle}
        />

        <label htmlFor="repo">Repository Name</label>
        <input
          id="repo"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="Enter repository, e.g. react"
          autoComplete="off"
          style={inputStyle}
        />

        {selectedTool === "search_issues" && (
          <>
            <label htmlFor="query">Search Issues</label>
            <input
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a keyword, e.g. bug"
              style={inputStyle}
            />
          </>
        )}

        {selectedTool !== "get_repo_stats" && (
          <>
            <label htmlFor="page">Page Number</label>
            <input
              id="page"
              type="number"
              min="1"
              step="1"
              value={page}
              onChange={(e) => setPage(e.target.value)}
              style={inputStyle}
            />

            <label htmlFor="perPage">Results Per Page</label>
            <input
              id="perPage"
              type="number"
              min="1"
              max="100"
              step="1"
              value={perPage}
              onChange={(e) => setPerPage(e.target.value)}
              style={inputStyle}
            />
          </>
        )}

        <button
          type="button"
          onClick={runTool}
          disabled={loading || !owner.trim() || !repo.trim()}
          style={{
            padding: "12px 22px",
            border: 0,
            borderRadius: 8,
            background: loading ? "#475569" : "#2563eb",
            color: "#ffffff",
            cursor: loading ? "wait" : "pointer",
            opacity: loading || !owner.trim() || !repo.trim() ? 0.7 : 1,
          }}
        >
          {loading ? "Running..." : "Run Tool"}
        </button>

        {error && (
          <p
            role="alert"
            style={{
              color: "#f87171",
              whiteSpace: "pre-wrap",
              marginTop: 16,
            }}
          >
            {error}
          </p>
        )}

        {result !== null && (
          <div style={{ marginTop: 24 }}>
            <h3>Tool Result</h3>

            <pre
              style={{
                padding: 16,
                borderRadius: 8,
                background: "#020617",
                color: "#86efac",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
                overflowX: "auto",
              }}
            >
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </section>

      <p style={{ marginTop: 24 }}>
        MCP Endpoint: <code>/api/mcp</code>
      </p>
    </main>
  );
}
