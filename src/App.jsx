
import { useCallback, useEffect, useState } from "react";
import {
  fetchSalesOrders,
  fetchSalesOrderMeta,
} from "./services/salesOrdersApi";
import "./App.css";

const PAGE_SIZE = 25;

const STATUS_OPTIONS = [
  "Open order",
  "Invoiced",
  "Delivered",
  "Cancelled",
];

const SORT_OPTIONS = [
  { value: "SalesId", label: "Order number" },
  { value: "CreatedDateTime1", label: "Order date" },
  { value: "HAR_TotalSOAmount", label: "Order amount" },
  { value: "SalesStatus", label: "Status" },
  { value: "InventSiteId", label: "Branch" },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function StatusBadge({ status }) {
  const className = status
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`status-badge status-${className}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

function SummaryCard({ label, value, icon, tone }) {
  return (
    <article className="summary-card">
      <div className={`summary-icon ${tone}`}>{icon}</div>
      <p className="summary-label">{label}</p>
      <h2 className="summary-value">{value}</h2>
    </article>
  );
}

export default function App() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [meta, setMeta] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [site, setSite] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("SalesId");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [metaError, setMetaError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchSalesOrders({
          page,
          pageSize,
          q: search,
          site,
          status,
          sort,
          order: sortOrder,
          signal: controller.signal,
        });

        setOrders(result.data ?? []);
        setSummary(result.summary ?? null);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => controller.abort();
  }, [page, pageSize, search, site, status, sort, sortOrder]);

  const loadMeta = useCallback(async () => {
    try {
      const result = await fetchSalesOrderMeta();
      setMeta(result);
      setMetaError("");
    } catch (err) {
      setMetaError(
        err.message || "Could not load filter options."
      );
    }
  }, []);

  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setSite("");
    setStatus("");
    setSort("SalesId");
    setSortOrder("asc");
    setPage(1);
  };

  const toggleSort = (field) => {
    if (sort === field) {
      setSortOrder((current) =>
        current === "asc" ? "desc" : "asc"
      );
    } else {
      setSort(field);
      setSortOrder("asc");
    }

    setPage(1);
  };

  const totalPages = Math.max(
    1,
    Math.ceil(
      (Number(summary?.filtered_orders ?? 0)) / pageSize
    )
  );

  const sites = meta?.facets?.sites ?? [];
  const statuses = meta?.facets?.statuses ?? STATUS_OPTIONS;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#dashboard">
          <span className="brand-mark">S</span>
          <span>
            <strong>SalesFlow</strong>
            <small>ORDER MONITOR</small>
          </span>
        </a>

        <p className="nav-heading">WORKSPACE</p>
        <a className="nav-link active" href="#dashboard">
          <span>▦</span> Dashboard
        </a>
        <a className="nav-link" href="#orders">
          <span>▤</span> Sales orders
        </a>

        <div className="sidebar-bottom">
          <span className="live-indicator" />
          <div>
            <strong>Mock API</strong>
            <small>Read-only data source</small>
          </div>
        </div>
      </aside>

      <section className="main-content" id="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">SALES OPERATIONS</p>
            <h1>Sales Order Monitor</h1>
            <p className="page-subtitle">
              Monitor orders and performance across branches.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={() => setRefreshKey((key) => key + 1)}
          >
            ↻ Refresh
          </button>
        </header>

        {metaError && (
          <div className="notice">
            {metaError} Branch options may be unavailable.
            <button onClick={loadMeta}>Retry</button>
          </div>
        )}

        <section className="summary-grid" aria-label="Order summary">
          <SummaryCard
            label="Total orders"
            value={
              summary
                ? Number(summary.total_orders).toLocaleString()
                : "—"
            }
            icon="▤"
            tone="blue"
          />
          <SummaryCard
            label="Open / pending"
            value={
              summary
                ? Number(summary.open_orders).toLocaleString()
                : "—"
            }
            icon="◷"
            tone="amber"
          />
          <SummaryCard
            label="Completed / invoiced"
            value={
              summary
                ? (
                    Number(summary.invoiced_orders) +
                    Number(summary.delivered_orders)
                  ).toLocaleString()
                : "—"
            }
            icon="✓"
            tone="green"
          />
          <SummaryCard
            label="Cancelled"
            value={
              summary
                ? Number(summary.cancelled_orders).toLocaleString()
                : "—"
            }
            icon="×"
            tone="red"
          />
          <SummaryCard
            label="Total order value"
            value={
              summary
                ? formatCurrency(summary.total_order_value)
                : "—"
            }
            icon="RM"
            tone="purple"
          />
        </section>

        <section className="orders-panel" id="orders">
          <div className="panel-heading">
            <div>
              <h2>Sales orders</h2>
              <p>
                {summary
                  ? `${Number(
                      summary.filtered_orders
                    ).toLocaleString()} matching orders`
                  : "Orders across all branches"}
              </p>
            </div>

            <button
              className="reset-button"
              onClick={resetFilters}
            >
              Reset filters
            </button>
          </div>

          <div className="filters">
            <label className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search order, customer, account..."
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(event.target.value)
                }
                aria-label="Search sales orders"
              />
            </label>

            <select
              value={site}
              onChange={(event) => {
                setSite(event.target.value);
                setPage(1);
              }}
              aria-label="Filter by branch"
            >
              <option value="">All branches</option>
              {sites.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              {statuses.map((item) => {
                const value =
                  typeof item === "string" ? item : item.value;

                return (
                  <option key={value} value={value}>
                    {value}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="table-toolbar">
            <span>
              {loading
                ? "Updating orders..."
                : `Page ${page} of ${totalPages}`}
            </span>

            <label>
              Rows
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </label>
          </div>

          {error && (
            <div className="error-state" role="alert">
              <strong>Couldn't load sales orders</strong>
              <p>{error}</p>
              <button
                onClick={() => setRefreshKey((key) => key + 1)}
              >
                Retry by changing a filter, or reload the page
              </button>
            </div>
          )}

          {!error && loading && (
            <div className="loading-state">
              <span className="spinner" />
              <p>Loading sales orders...</p>
            </div>
          )}

          {!error && !loading && orders.length === 0 && (
            <div className="empty-state">
              <span>⌕</span>
              <h3>No orders found</h3>
              <p>
                Try another search term or clear your filters.
              </p>
              <button onClick={resetFilters}>
                Clear filters
              </button>
            </div>
          )}

          {!error && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>
                      <button
                        className="sort-button"
                        onClick={() => toggleSort("SalesId")}
                      >
                        ORDER NUMBER
                        {sort === "SalesId"
                          ? sortOrder === "asc" ? " ↑" : " ↓"
                          : ""}
                      </button>
                    </th>
                    <th>CUSTOMER</th>
                    <th>
                      <button
                        className="sort-button"
                        onClick={() =>
                          toggleSort("InventSiteId")
                        }
                      >
                        BRANCH
                        {sort === "InventSiteId"
                          ? sortOrder === "asc" ? " ↑" : " ↓"
                          : ""}
                      </button>
                    </th>
                    <th>
                      <button
                        className="sort-button"
                        onClick={() =>
                          toggleSort("CreatedDateTime1")
                        }
                      >
                        ORDER DATE
                        {sort === "CreatedDateTime1"
                          ? sortOrder === "asc" ? " ↑" : " ↓"
                          : ""}
                      </button>
                    </th>
                    <th>STATUS</th>
                    <th className="amount-column">
                      <button
                        className="sort-button"
                        onClick={() =>
                          toggleSort("HAR_TotalSOAmount")
                        }
                      >
                        AMOUNT
                        {sort === "HAR_TotalSOAmount"
                          ? sortOrder === "asc" ? " ↑" : " ↓"
                          : ""}
                      </button>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {!loading &&
                    !error &&
                    orders.map((item) => (
                      <tr key={item.SalesId}>
                        <td>
                          <strong className="order-number">
                            {item.SalesId}
                          </strong>
                        </td>
                        <td>
                          <div className="customer-cell">
                            <strong>{item.SalesName}</strong>
                            <small>{item.CustAccount}</small>
                          </div>
                        </td>
                        <td>
                          <span className="branch-tag">
                            {item.InventSiteId}
                          </span>
                        </td>
                        <td>{formatDate(item.CreatedDateTime1)}</td>
                        <td>
                          <StatusBadge status={item.SalesStatus} />
                        </td>
                        <td className="amount-column">
                          <strong>
                            {formatCurrency(item.HAR_TotalSOAmount)}
                          </strong>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {!error && (
            <footer className="pagination">
              <span>
                {summary
                  ? `Showing ${
                      orders.length === 0
                        ? 0
                        : (page - 1) * pageSize + 1
                    }–${(page - 1) * pageSize + orders.length} of ${Number(
                      summary.filtered_orders
                    ).toLocaleString()}`
                  : "Waiting for data"}
              </span>

              <div className="pagination-actions">
                <button
                  disabled={page <= 1 || loading}
                  onClick={() =>
                    setPage((current) => current - 1)
                  }
                >
                  Previous
                </button>
                <span>{page} / {totalPages}</span>
                <button
                  disabled={page >= totalPages || loading}
                  onClick={() =>
                    setPage((current) => current + 1)
                  }
                >
                  Next
                </button>
              </div>
            </footer>
          )}
        </section>

        <footer className="app-footer">
          SalesFlow · Sales Order Monitoring · Assessment demo
        </footer>
      </section>
    </main>
  );
}
