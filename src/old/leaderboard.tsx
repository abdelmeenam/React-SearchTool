import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";

// If you already have these in your project, replace the two imports below with your actual paths.
// import axiosInstance from "@/lib/axiosInstance";
// import { getAuthHeader } from "@/lib/auth";

/**
 * Types
 */
export interface Log {
  id: number;
  userName: string;
  date: string; // ISO string
  action: string;
  parsedDet?: string;
}

interface LeaderboardRow {
  userName: string;
  count: number;
  uniqueActions: number;
  firstActivity?: Date;
  lastActivity?: Date;
}

/**
 * Utility helpers
 */
const LOCAL_STORAGE_EXCLUDED = "logs_leaderboard_excluded_users";
const DEFAULT_EXCLUDED = ["wael","Emad","Ali","Mina","Andrew"]; // you can change this

function toISODateOnly(d: Date) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    .toISOString()
    .slice(0, 10);
}

function formatDateTime(d?: Date) {
  if (!d) return "-";
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

function timeAgo(date?: Date) {
  if (!date) return "-";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals: [number, string][] = [
    [60 * 60 * 24 * 365, "y"],
    [60 * 60 * 24 * 30, "mo"],
    [60 * 60 * 24, "d"],
    [60 * 60, "h"],
    [60, "m"],
  ];
  for (const [secs, label] of intervals) {
    const v = Math.floor(seconds / secs);
    if (v >= 1) return `${v}${label}`;
  }
  return `${seconds}s`;
}

function downloadCSV(filename: string, rows: any[]) {
  if (!rows?.length) return;
  const header = Object.keys(rows[0]);
  const csv = [
    header.join(","),
    ...rows.map((r) => header.map((h) => JSON.stringify(r[h] ?? "")).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Main page component
 */
const LogsLeaderboardPage: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & UI state
  const [search, setSearch] = useState("");
  const [range, setRange] = useState<"all" | "7d" | "30d" | "custom">("30d");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [excludedUsers, setExcludedUsers] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_EXCLUDED);
      return raw ? JSON.parse(raw) : DEFAULT_EXCLUDED;
    } catch {
      return DEFAULT_EXCLUDED;
    }
  });
  const [newExclude, setNewExclude] = useState("");
  const [persistExclude, setPersistExclude] = useState(true);

  const [sortKey, setSortKey] = useState<keyof LeaderboardRow>("count");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  // Derived date range for quick presets
  useEffect(() => {
    if (range === "custom") return; // don't overwrite custom
    const end = new Date();
    const start = new Date();
    if (range === "7d") start.setDate(start.getDate() - 7);
    if (range === "30d") start.setDate(start.getDate() - 30);
    setFromDate(range === "all" ? "" : toISODateOnly(start));
    setToDate(range === "all" ? "" : toISODateOnly(end));
  }, [range]);

  // Persist excluded users
  useEffect(() => {
    if (persistExclude) {
      localStorage.setItem(
        LOCAL_STORAGE_EXCLUDED,
        JSON.stringify(excludedUsers)
      );
    }
  }, [excludedUsers, persistExclude]);

  // Fetch logs
  async function fetchLogs() {
    try {
      setLoading(true);
      setError(null);

      const res = await axiosInstance.get("/Logs/GetLogs");
      // Subtract 10 hours from each log's date
      const adjustedLogs = (res.data || []).map((log: Log) => ({
        ...log,
        date: new Date(
          new Date(log.date).getTime() - 10 * 60 * 60 * 1000
        ).toISOString(),
      }));
      setLogs(adjustedLogs);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtering & aggregation
  const filteredLogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    const hasFrom = !!fromDate;
    const hasTo = !!toDate;
    const from = hasFrom ? new Date(fromDate) : null;
    const to = hasTo ? new Date(toDate) : null;
    const excluded = new Set(
      excludedUsers.map((u) => u.trim().toLowerCase()).filter(Boolean)
    );

    return logs.filter((l) => {
      const name = (l.userName || "").toLowerCase();
      if (excluded.has(name)) return false; // exact match exclude

      // search by user or action
      if (
        q &&
        !(name.includes(q) || (l.action || "").toLowerCase().includes(q))
      )
        return false;

      const d = new Date(l.date);
      if (from && d < new Date(from.getTime())) return false;
      if (to) {
        const endOfDay = new Date(to);
        endOfDay.setHours(23, 59, 59, 999);
        if (d > endOfDay) return false;
      }
      return true;
    });
  }, [logs, search, fromDate, toDate, excludedUsers]);

  const leaderboard = useMemo<LeaderboardRow[]>(() => {
    const map = new Map<
      string,
      { count: number; actions: Set<string>; first?: Date; last?: Date }
    >();
    for (const l of filteredLogs) {
      const key = (l.userName || "").trim();
      if (!key) continue;
      const d = new Date(l.date);
      const entry = map.get(key) || {
        count: 0,
        actions: new Set<string>(),
        first: d,
        last: d,
      };
      entry.count++;
      entry.actions.add(l.action || "");
      if (!entry.first || d < entry.first) entry.first = d;
      if (!entry.last || d > entry.last) entry.last = d;
      map.set(key, entry);
    }
    return Array.from(map.entries()).map(([userName, v]) => ({
      userName,
      count: v.count,
      uniqueActions: v.actions.size,
      firstActivity: v.first,
      lastActivity: v.last,
    }));
  }, [filteredLogs]);

  const sorted = useMemo(() => {
    const arr = [...leaderboard];
    arr.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const va = (a[sortKey] ?? 0) as any;
      const vb = (b[sortKey] ?? 0) as any;
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return a.userName.localeCompare(b.userName) * dir;
    });
    return arr;
  }, [leaderboard, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);
  const pageData = useMemo(
    () => sorted.slice((page - 1) * pageSize, page * pageSize),
    [sorted, page]
  );

  // Summary cards
  const totalLogs = filteredLogs.length;
  const uniqueUsers = leaderboard.length;
  const topUser = sorted[0]?.userName ?? "-";

  const activeRangeLabel = useMemo(() => {
    if (range === "all") return "All Time";
    if (range === "custom")
      return fromDate && toDate ? `${fromDate} → ${toDate}` : "Custom";
    return range === "7d" ? "Last 7 days" : "Last 30 days";
  }, [range, fromDate, toDate]);

  function toggleSort(key: keyof LeaderboardRow) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "userName" ? "asc" : "desc");
    }
  }

  function addExcluded() {
    const v = newExclude.trim();
    if (!v) return;
    if (!excludedUsers.map((x) => x.toLowerCase()).includes(v.toLowerCase())) {
      setExcludedUsers((s) => [...s, v]);
    }
    setNewExclude("");
  }

  function removeExcluded(name: string) {
    setExcludedUsers((s) =>
      s.filter((x) => x.toLowerCase() !== name.toLowerCase())
    );
  }

  function clearExcluded() {
    setExcludedUsers([]);
  }

  function exportCurrentCSV() {
    const rows = sorted.map((r, i) => ({
      rank: i + 1,
      userName: r.userName,
      actions: r.count,
      uniqueActions: r.uniqueActions,
      firstActivity: r.firstActivity ? r.firstActivity.toISOString() : "",
      lastActivity: r.lastActivity ? r.lastActivity.toISOString() : "",
    }));
    downloadCSV(`logs_leaderboard_${Date.now()}.csv`, rows);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Logs Leaderboard
        </h1>
        <p className="text-sm text-muted-foreground/80">
          Rank users by activity. Hide test users. Filter by time and search.
        </p>
      </div>

      {/* Filters & Actions */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 items-end">
        {/* Search */}
        <div className="md:col-span-3">
          <label className="text-xs font-medium text-muted-foreground">
            Search
          </label>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search user or action..."
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Range Preset */}
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">
            Range
          </label>
          <select
            value={range}
            onChange={(e) => {
              setRange(e.target.value as any);
              setPage(1);
            }}
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All time</option>
            <option value="custom">Custom...</option>
          </select>
        </div>

        {/* Custom Dates */}
        <div className="md:col-span-3 flex gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground">
              From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setRange("custom");
                setPage(1);
              }}
              className="mt-1 w-full rounded-xl border bg-background px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground">
              To
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setRange("custom");
                setPage(1);
              }}
              className="mt-1 w-full rounded-xl border bg-background px-3 py-2"
            />
          </div>
        </div>

        {/* Exclude users editor */}

        {/* Actions */}
        <div className="md:col-span-12 flex flex-wrap items-center gap-2">
          <button
            onClick={fetchLogs}
            className="rounded-xl border px-3 py-2 hover:bg-muted"
          >
            Reload
          </button>
          <button
            onClick={exportCurrentCSV}
            className="rounded-xl border px-3 py-2 hover:bg-muted"
          >
            Export CSV
          </button>
          <span className="ml-auto text-sm text-muted-foreground">
            Range: {activeRangeLabel}
          </span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Logs" value={totalLogs.toLocaleString()} />
        <StatCard label="Unique Users" value={uniqueUsers.toLocaleString()} />
        <StatCard label="Top User" value={topUser} />
        <StatCard label="Updated" value={new Date().toLocaleTimeString()} />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border">
        <table className="w-full border-collapse">
          <thead className="bg-muted/50">
            <tr className="text-left text-sm">
              <Th
                sortable
                onClick={() => toggleSort("count")}
                active={sortKey === "count"}
                dir={sortDir}
              >
                Rank
              </Th>
              <Th
                sortable
                onClick={() => toggleSort("userName")}
                active={sortKey === "userName"}
                dir={sortDir}
              >
                User
              </Th>
              <Th
                sortable
                onClick={() => toggleSort("count")}
                active={sortKey === "count"}
                dir={sortDir}
              >
                Actions
              </Th>
              <Th
                sortable
                onClick={() => toggleSort("uniqueActions")}
                active={sortKey === "uniqueActions"}
                dir={sortDir}
              >
                Unique Actions
              </Th>
              <Th
                sortable
                onClick={() => toggleSort("lastActivity")}
                active={sortKey === "lastActivity"}
                dir={sortDir}
              >
                Last Activity
              </Th>
              <Th
                sortable
                onClick={() => toggleSort("firstActivity")}
                active={sortKey === "firstActivity"}
                dir={sortDir}
              >
                First Activity
              </Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-sm text-muted-foreground"
                >
                  Loading logs…
                </td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-sm text-destructive"
                >
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && pageData.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-sm text-muted-foreground"
                >
                  No results for current filters.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              pageData.map((r, idx) => (
                <tr key={r.userName} className="border-t">
                  <td className="px-3 py-3 text-sm align-middle">
                    {(page - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-3 py-3 text-sm align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar name={r.userName} />
                      <div className="leading-tight">
                        <div className="font-medium">{r.userName}</div>
                        <div className="text-xs text-muted-foreground">
                          {((r.count / Math.max(1, totalLogs)) * 100).toFixed(
                            1
                          )}
                          % of activity
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm align-middle font-medium">
                    {r.count.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-sm align-middle">
                    {r.uniqueActions.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-sm align-middle">
                    <div className="flex flex-col">
                      <span>{formatDateTime(r.lastActivity)}</span>
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(r.lastActivity)} ago
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm align-middle">
                    {formatDateTime(r.firstActivity)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{pageData.length}</span> of{" "}
          <span className="font-medium">{sorted.length}</span> users
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-xl border px-3 py-2 disabled:opacity-50"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            « First
          </button>
          <button
            className="rounded-xl border px-3 py-2 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ‹ Prev
          </button>
          <span className="text-sm">
            Page <span className="font-medium">{page}</span> / {totalPages}
          </span>
          <button
            className="rounded-xl border px-3 py-2 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next ›
          </button>
          <button
            className="rounded-xl border px-3 py-2 disabled:opacity-50"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            Last »
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogsLeaderboardPage;

/**
 * Small UI bits
 */
function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Th({
  children,
  sortable,
  onClick,
  active,
  dir,
}: {
  children: React.ReactNode;
  sortable?: boolean;
  onClick?: () => void;
  active?: boolean;
  dir?: "asc" | "desc";
}) {
  return (
    <th
      className={`px-3 py-3 font-medium ${
        sortable ? "cursor-pointer select-none" : ""
      }`}
      onClick={onClick}
      title={sortable ? "Click to sort" : undefined}
    >
      <div className="inline-flex items-center gap-1">
        <span>{children}</span>
        {sortable && (
          <span className={`text-xs ${active ? "opacity-100" : "opacity-30"}`}>
            {dir === "asc" ? "▲" : "▼"}
          </span>
        )}
      </div>
    </th>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = (name || "?")
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-semibold">
      {initials}
    </div>
  );
}
