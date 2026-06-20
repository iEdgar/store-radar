# API Specification

# Retail Analytics Dashboard

**Version:** 1.1

---

# Purpose

This document defines the contract for the Mock REST API consumed by the frontend.

Although the API is implemented using Next.js Route Handlers and local JSON files, it should behave like a real production REST API.

The frontend must consume the API exclusively through HTTP requests.

Components must never access JSON files directly.

---

# API Design Principles

The API should be:

* RESTful
* Predictable
* Consistent
* Typed
* Easy to extend
* Independent from the UI

All endpoints must return JSON.

---

# Base URL

```text
/api
```

Future versioning should allow:

```text
/api/v1
```

without changing the frontend architecture.

---

# Response Format

Every successful response should follow the same structure.

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

---

Every error response should follow:

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Store not found."
  }
}
```

---

# Endpoints

---

# GET /api/stores

Returns the complete list of stores.

## Query Parameters

| Parameter | Type       | Description          |
| --------- | ---------- | -------------------- |
| search    | string     | Search by store name |
| region    | string     | Filter by region     |
| sort      | string     | Sort field           |
| order     | asc | desc | Sort direction       |

Example

```http
GET /api/stores?search=downtown&region=east
```

---

## Response

```json
{
  "success": true,
  "data": [
    {
      "id": "store_001",
      "name": "Downtown Store",
      "city": "New York",
      "region": "East",
      "totalSales": 125000,
      "productsSold": 4210
    }
  ],
  "meta": {
    "count": 1
  }
}
```

---

# GET /api/stores/:id

Returns the complete detail of one store.

---

## Response

```json
{
  "success": true,
  "data": {
    "store": {},
    "summary": {},
    "topProducts": [],
    "products": []
  }
}
```

---

The endpoint is responsible for aggregating all related information.

The frontend should not compute business metrics.

---

# GET /api/products

Returns all products.

Primarily intended for internal use.

---

# Query Parameters

| Parameter | Description  |
| --------- | ------------ |
| search    | Product name |
| sku       | SKU          |
| category  | Category     |

---

# Response

```json
{
  "success": true,
  "data": [],
  "meta": {
    "count": 0
  }
}
```

---

# GET /api/regions

Returns the list of distinct regions available in the dataset.

Allows the frontend to populate the region filter dynamically instead of hardcoding values.

## Response

```json
{
  "success": true,
  "data": ["East", "North", "South", "West"],
  "meta": {
    "count": 4
  }
}
```

Regions are derived from the stores data inside the service layer and returned sorted ascending.

---

# Resource Models

## Store Summary

```ts
{
  id: string;
  name: string;
  city: string;
  region: string;
  totalSales: number;
  productsSold: number;
}
```

---

## Store Detail

```ts
{
  store: Store;
  summary: Summary;
  topProducts: ProductSales[];
  products: ProductSales[];
}
```

---

## ProductSales

```ts
{
  id: string;
  sku: string;
  name: string;
  category: string;
  unitsSold: number;
  totalRevenue: number;
}
```

---

# HTTP Status Codes

| Code | Meaning            |
| ---- | ------------------ |
| 200  | Success            |
| 400  | Invalid Request    |
| 404  | Resource Not Found |
| 500  | Internal Error     |

---

# Error Codes

Possible API error codes.

```text
STORE_NOT_FOUND

PRODUCT_NOT_FOUND

INVALID_QUERY

INVALID_DATA

INTERNAL_SERVER_ERROR
```

---

# Validation

Every request should validate:

* Parameters
* JSON structure
* Required values

Use Zod whenever applicable.

---

# Computed Data

The API is responsible for calculating:

* Total Sales
* Products Sold
* Product Count
* Categories Count
* Average Revenue
* Top 5 Products

These values should never be calculated by UI components.

---

# Filtering

Filtering should happen inside the API layer whenever possible.

Supported filters:

Store Name

Region

Product Name

SKU

Category

---

# Sorting

Supported sorting fields.

Stores

* name
* city
* region
* totalSales
* productsSold

Products

* sku
* name
* category
* unitsSold
* totalRevenue

Default order:

Ascending.

---

# Pagination

Pagination is not required for the current project.

However, the response format should allow future support.

Example:

```json
{
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 200,
    "totalPages": 10
  }
}
```

---

# Service Layer

Every endpoint should have a corresponding service.

Example

```text
store.service.ts

product.service.ts
```

Services should contain all business logic.

Route Handlers should only orchestrate requests and responses.

---

# Route Handlers Responsibilities

Route Handlers should:

* Read JSON files
* Validate data
* Call services
* Return formatted responses

They should not contain business calculations.

---

# Business Layer Responsibilities

Services should:

* Aggregate data
* Join entities
* Compute metrics
* Filter
* Sort
* Transform data

---

# UI Responsibilities

The UI should only:

* Request data
* Display information
* Handle interactions
* Render loading/error states

Business calculations should never occur inside components.

---

# Future Scalability

The API should support future endpoints such as:

```text
GET /api/regions

GET /api/categories

GET /api/reports

GET /api/users
```

without requiring structural changes.

---

# Definition of Done

The API is considered complete when:

* Every endpoint follows the documented contract.
* Responses are consistent.
* Errors are standardized.
* Validation is implemented.
* Business logic is isolated in services.
* Route Handlers remain thin.
* The frontend consumes only HTTP endpoints.
* The API can be replaced by a real backend without changing the frontend.
