
const API_URL = "https://hiring.harrisons.my/api/mock/sales-orders";

const API_HEADERS = {
  "x-assessment-key": "hssb-assessment-mock-2026",
};

export async function fetchSalesOrders({
  page = 1,
  pageSize = 25,
  q = "",
  site = "",
  status = "",
  sort = "SalesId",
  order = "asc",
  signal,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sort,
    order,
  });

  if (q.trim()) params.set("q", q.trim());
  if (site) params.set("site", site);
  if (status) params.set("status", status);

  const response = await fetch(
    `${API_URL}?${params.toString()}`,
    {
      method: "GET",
      headers: API_HEADERS,
      signal,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load orders (HTTP ${response.status}).`
    );
  }

  return response.json();
}

export async function fetchSalesOrderMeta() {
  const response = await fetch(`${API_URL}/meta`, {
    method: "GET",
    headers: API_HEADERS,
  });

  if (!response.ok) {
    throw new Error("Unable to load branch and status options.");
  }

  return response.json();
}
