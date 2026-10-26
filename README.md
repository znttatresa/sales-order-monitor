# Sales Order Monitoring Web App

A responsive web dashboard developed as a technical assessment to monitor sales orders across different branches. The application retrieves data from a hosted mock REST API and displays order summaries, searchable records, filters, sorting, and pagination.

## Live Demo

- **Live Application:** https://salesordermonitor.vercel.app/
- **GitHub Repository:** https://github.com/znttatresa/sales-order-monitor

## Features

- **Dashboard Summary:** Displays total orders, open orders, invoiced and delivered orders, cancelled orders, and total sales order value.
- **Sales Order Table:** Displays sales order number, customer name, branch, order date, status, and order amount.
- **Search:** Search sales order records using the supported API search functionality.
- **Branch Filtering:** Filter records by branch.
- **Status Filtering:** Filter records by sales order status.
- **Sorting:** Sort supported columns in ascending or descending order.
- **Pagination:** Navigate through order records by page.
- **Refresh:** Request the latest available data from the mock API.
- **Responsive Interface:** Provides a dashboard layout suitable for different screen sizes.
- **Read-Only Access:** Uses GET requests to retrieve data without modifying sales orders.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| Vite | Development server and production build |
| JavaScript (ES6+) | Application logic and interactions |
| CSS3 | Styling and responsive layout |
| Fetch API | Communicating with the REST API |
| Git and GitHub | Version control and source code hosting |
| Vercel | Hosting the deployed application |
| ChatGPT | AI-assisted development, troubleshooting, and documentation |

## Architecture

The application uses a React-based frontend with a dedicated service module for API communication.

- **User Interface (`src/App.jsx`):** Implements the main dashboard, manages application state, and coordinates the display of sales order data and user interactions.
- **API Service (`src/services/salesOrdersApi.js`):** Sends requests to the hosted mock API, including the required assessment header and supported query parameters.
- **Styling (`src/App.css` and `src/index.css`):** Defines the dashboard appearance, layout, and responsive styling.
- **Application Entry Point (`src/main.jsx`):** Loads the React application.
- **Deployment:** The source code is hosted on GitHub, and the frontend is deployed using Vercel.

### Data Flow

1. The application requests sales order data from the mock REST API.
2. The API returns JSON data containing order records and summary information.
3. React state stores the retrieved data and manages user interactions.
4. The dashboard renders the summary cards and order table.
5. Search, filters, sorting, and pagination trigger the relevant updates or API requests.

## API Integration

The application uses the assessment-provided mock REST API.

**Sales orders endpoint**

```text
https://hiring.harrisons.my/api/mock/sales-orders
```

**Metadata endpoint**

```text
https://hiring.harrisons.my/api/mock/sales-orders/meta
```

Requests include the required `x-assessment-key` header.

The sales order endpoint supports query parameters for:

| Parameter | Purpose |
|---|---|
| `page` | Selects the page of results |
| `pageSize` | Specifies the number of records per page |
| `q` | Searches for matching records |
| `site` | Filters records by branch |
| `status` | Filters records by sales order status |
| `sort` | Specifies the sorting field |
| `order` | Specifies ascending or descending order |

The application uses read-only GET requests. It does not create, edit, or delete sales orders.

## Getting Started

### Prerequisites

- Node.js
- npm
- Git
- Internet access to reach the hosted mock API

### Installation

Clone the repository:

```bash
git clone https://github.com/znttatresa/sales-order-monitor.git
```

Navigate to the project folder:

```bash
cd sales-order-monitor
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually `http://localhost:5173`.

### Production Build

Build the application:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Testing and Verification

Testing was performed manually during development. The following areas were used to verify the application:

- Initial dashboard loading and retrieval of API data.
- Display of order records and summary metrics.
- Search and filtering by branch and order status.
- Sorting of supported columns.
- Pagination between result pages.
- Refreshing the displayed data.
- Error and empty-result handling.
- Layout and usability at different screen sizes.
- Production deployment through the public Vercel URL.

The application was also built and deployed to verify that it could run outside the local development environment. Automated unit and integration tests were not implemented.


## Author

**Zanetta Teresa Damian**

- GitHub: https://github.com/znttatresa
- Repository: https://github.com/znttatresa/sales-order-monitor
- Live Demo: https://salesordermonitor.vercel.app/

---

Developed as a technical assessment project.