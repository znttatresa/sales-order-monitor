# Sales Order Monitoring Web App

A responsive web dashboard for monitoring sales orders across branches. Built with React and Vite, the application retrieves sales order data from a hosted mock REST API and presents key operational metrics, searchable order records, filtering, sorting, and pagination.

## Live Demo

- **Live Application:** https://salesordermonitor.vercel.app/
- **Source Code:** https://github.com/znttatresa/sales-order-monitor

## Features

- **Dashboard Summary:** Displays total orders, open orders, completed/invoiced orders, cancelled orders, and total sales order value.
- **Sales Order Listing:** Displays order number, customer name, branch, order date, order status, and order amount.
- **Search:** Search for relevant sales order records using the available search fields supported by the API.
- **Filtering:** Filter sales orders by branch and order status.
- **Sorting:** Sort supported columns in ascending or descending order.
- **Pagination:** Navigate through order records with adjustable page sizes.
- **Refresh:** Reload sales order data from the API.
- **Responsive Layout:** Adapts the dashboard layout for different screen sizes.
- **Read-Only Data Access:** Retrieves data using HTTP GET requests without modifying the source dataset.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface and component-based development |
| Vite | Development server and production build tooling |
| JavaScript (ES6+) | Application logic and API integration |
| CSS3 | Styling and responsive layout |
| Fetch API | HTTP requests to the mock REST API |
| Git and GitHub | Version control and source code hosting |
| Vercel | Application deployment |

## Architecture

The application follows a simple frontend-to-API architecture.

1. **User Interface:** React components render dashboard summaries, search and filter controls, and the sales order table.
2. **API Service Layer:** `src/services/salesOrdersApi.js` handles HTTP requests and query parameters.
3. **Mock REST API:** The hosted API returns sales order records, summary information, and metadata.
4. **Deployment:** Vercel hosts the production frontend.

### Project Structure

```text
sales-order-monitor/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── OrderFilters.jsx
│   │   ├── OrderTable.jsx
│   │   └── SummaryCards.jsx
│   ├── services/
│   │   └── salesOrdersApi.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## API Integration

The application uses the provided hosted mock API:

**Base endpoint**

```text
https://hiring.harrisons.my/api/mock/sales-orders
```

**Metadata endpoint**

```text
https://hiring.harrisons.my/api/mock/sales-orders/meta
```

Requests include the assessment header `x-assessment-key`, as specified by the API provider.

### Supported Operations

| Operation | HTTP method | Purpose |
|---|---|---|
| Retrieve sales orders | GET | Fetch order records |
| Retrieve metadata | GET | Obtain available branch and status options |

The sales order endpoint supports query parameters for pagination, search, filtering, and sorting, including `page`, `pageSize`, `q`, `site`, `status`, `sort`, and `order`.

The application is designed for read-only access. It does not create, update, or delete sales orders.

## Getting Started

### Prerequisites

- Node.js and npm installed