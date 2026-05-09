"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [types, setTypes] = useState([]);
  const [months, setMonths] = useState([]);
  const [type, setType] = useState("");
  const [month, setMonth] = useState("");
  const [query, setQuery] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOptions();
  }, []);

  async function callApi(action, payload = {}) {
    const res = await fetch("/api/gas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action,
        ...payload
      })
    });

    return await res.json();
  }

  async function loadOptions() {
    setLoading(true);
    const data = await callApi("getOptions");
    setLoading(false);

    if (data.success) {
      setTypes(data.types || []);
      setMonths(data.months || []);

      if (data.types?.length) setType(data.types[0]);
      if (data.months?.length) setMonth(data.months[0]);
    } else {
      setSyncMessage(data.message || "Unable to load options");
    }
  }

  async function syncData() {
    setLoading(true);
    setSyncMessage("Loading selected data...");
    setResults([]);

    const data = await callApi("sync", {
      type,
      month
    });

    setLoading(false);

    if (data.success) {
      setSyncMessage(data.message);
    } else {
      setSyncMessage(data.message || "Failed to load data");
    }
  }

  async function searchData() {
    if (!query.trim()) {
      setSearchMessage("Please enter customer name / PAN / mobile / loan ID");
      return;
    }

    setLoading(true);
    setSearchMessage("Searching...");
    setResults([]);

    const data = await callApi("search", {
      query
    });

    setLoading(false);

    if (data.success) {
      setResults(data.results || []);
      setSearchMessage(`${data.count || 0} result(s) found`);
    } else {
      setSearchMessage(data.message || "Search failed");
    }
  }

  return (
    <main className="page">
      <section className="card hero">
        <h1>Customer Lookup Tool</h1>
        <p>
          Select request type and month, then load data and search customer details.
        </p>
      </section>

      <section className="card">
        <h2>Step 1: Select Type and Month</h2>

        <div className="grid">
          <div>
            <label>Request Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Month</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={syncData} disabled={loading}>
          {loading ? "Please wait..." : "Load Selected Data"}
        </button>

        {syncMessage && <p className="message">{syncMessage}</p>}
      </section>

      <section className="card">
        <h2>Step 2: Search Customer</h2>

        <label>Search by Name / PAN / Mobile / Loan ID</label>
        <div className="searchRow">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search value"
            onKeyDown={(e) => {
              if (e.key === "Enter") searchData();
            }}
          />
          <button onClick={searchData} disabled={loading}>
            Search
          </button>
        </div>

        {searchMessage && <p className="message">{searchMessage}</p>}

        <ResultsTable results={results} />
      </section>
    </main>
  );
}

function ResultsTable({ results }) {
  if (!results || results.length === 0) return null;

  const headers = Object.keys(results[0]);

  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {results.map((row, index) => (
            <tr key={index}>
              {headers.map((h) => (
                <td key={h}>{row[h]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
