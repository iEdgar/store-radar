# Database Design

# Retail Analytics Dashboard

**Version:** 2.1

---

# Purpose

Although this project uses local JSON files as a Mock API, the data model must be designed following relational database principles.

The objective is to create a normalized domain model that can evolve into a real backend without requiring changes to the frontend architecture.

The JSON files represent persisted domain entities.

Business logic must never depend directly on the JSON structure.

---

# Design Principles

The data model should remain:

* Normalized
* Predictable
* Easy to validate
* Easy to extend
* Easy to maintain

Avoid storing duplicated or derived information.

Whenever possible, values should be computed from the source data.

---

# Domain Model

The application contains three core entities.

* Store
* Product
* StoreProductSales

---

# Entity Relationship Diagram

```text
                 Store
                   │
             1     │     N
                   │
                   ▼
          StoreProductSales
                   ▲
             N     │     1
                   │
                Product
```

---

# Data Flow

```text
stores.json
        │
        │
        ├──────────────┐
        │              │
        ▼              ▼
store-product-sales.json       products.json
        │
        ▼
Business Logic

↓

Computed Metrics

↓

Dashboard

↓

Store Detail
```

The frontend should consume domain models instead of raw JSON whenever possible.

---

# Entity: Store

Represents a physical retail location.

## Fields

| Field  | Type   | Required | Description       |
| ------ | ------ | -------- | ----------------- |
| id     | string | Yes      | Unique identifier |
| name   | string | Yes      | Store name        |
| city   | string | Yes      | Store city        |
| region | string | Yes      | Sales region      |

---

## Example

```json
{
  "id": "store_001",
  "name": "Downtown Store",
  "city": "New York",
  "region": "East"
}
```

---

# Entity: Product

Represents a sellable product.

## Fields

| Field    | Type   | Required | Description       |
| -------- | ------ | -------- | ----------------- |
| id       | string | Yes      | Unique identifier |
| sku      | string | Yes      | Product SKU       |
| name     | string | Yes      | Product name      |
| category | string | Yes      | Product category  |

---

## Example

```json
{
  "id": "product_001",
  "sku": "SKU-1001",
  "name": "Wireless Mouse",
  "category": "Electronics"
}
```

---

# Entity: StoreProductSales

Represents the aggregated sales performance of one product inside one store.

Each record represents:

One Store

*

One Product

↓

Sales Metrics

---

## Fields

| Field        | Type   | Required | Description       |
| ------------ | ------ | -------- | ----------------- |
| id           | string | Yes      | Unique identifier |
| storeId      | string | Yes      | Related Store     |
| productId    | string | Yes      | Related Product   |
| unitsSold    | number | Yes      | Units sold        |
| totalRevenue | number | Yes      | Revenue generated |

---

## Example

```json
{
  "id": "metric_001",
  "storeId": "store_001",
  "productId": "product_001",
  "unitsSold": 82,
  "totalRevenue": 5740
}
```

---

# Relationships

## Store

One Store

↓

Many StoreProductSales

---

## Product

One Product

↓

Many StoreProductSales

---

## StoreProductSales

Each record belongs to:

* One Store
* One Product

---

# Persisted Data

The following information should exist inside JSON files.

## stores.json

```text
id
name
city
region
```

---

## products.json

```text
id
sku
name
category
```

---

## store-product-sales.json

```text
id
storeId
productId
unitsSold
totalRevenue
```

---

# Computed Fields

The following values must never be persisted because they can be calculated.

| Field                       | Calculation                 |
| --------------------------- | --------------------------- |
| Total Sales                 | Sum(totalRevenue)           |
| Products Sold               | Sum(unitsSold)              |
| Product Count               | Count(distinct productId)   |
| Categories Count            | Count(distinct category)    |
| Average Revenue per Product | Total Sales / Product Count |
| Top Products                | Order by totalRevenue DESC  |

These values should be generated inside the service layer.

---

# Business Rules

Every Store must have:

* Unique ID
* Name
* City
* Region

---

Every Product must have:

* Unique ID
* Unique SKU
* Name
* Category

---

Every StoreProductSales record must reference:

* Existing Store
* Existing Product

No orphan records are allowed.

---

Revenue cannot be negative.

---

Units sold cannot be negative.

---

IDs cannot be duplicated.

---

# Validation

Every entity must be validated using Zod.

Schemas:

```text
StoreSchema

ProductSchema

StoreProductSalesSchema
```

Collections:

```text
StoresSchema

ProductsSchema

StoreProductSalesCollectionSchema
```

Validation must occur immediately after reading the JSON files.

---

# TypeScript Models

Each entity should have a dedicated TypeScript type.

```text
Store

Product

StoreProductSales
```

Avoid duplicated interfaces.

Shared types belong in the shared types directory.

---

# Folder Structure

```text
data/

stores.json

products.json

store-product-sales.json
```

Each file should contain an array of entities.

---

# Naming Conventions

Store IDs

```text
store_001
```

Product IDs

```text
product_001
```

Sales Metrics IDs

```text
metric_001
```

SKUs

```text
SKU-1001
```

Maintain consistent naming across all datasets.

---

# Future Scalability

The model should support adding new entities without modifying existing relationships.

Possible future entities:

* Users
* Roles
* Categories
* Inventory
* Orders
* Customers
* Suppliers
* Sales Targets
* Promotions

The current architecture should allow these additions with minimal changes.

---

# Data Ownership

Each entity owns only its intrinsic information.

Store owns:

* name
* city
* region

Product owns:

* sku
* name
* category

StoreProductSales owns:

* unitsSold
* totalRevenue

Computed metrics belong to the service layer and should never be persisted.

---

# Architecture Rule

Business calculations must never be performed inside UI components.

The correct flow is:

```text
JSON

↓

Route Handler

↓

Validation (Zod)

↓

Service Layer

↓

Computed Metrics

↓

TanStack Query

↓

Feature Hooks

↓

UI Components
```

The UI should receive already processed data whenever possible.

---

# Definition of Done

The data model is considered complete when:

* Entities are normalized.
* No duplicated information exists.
* Relationships are consistent.
* Validation passes.
* JSON structure matches the documented model.
* Business calculations are delegated to the service layer.
* The model can migrate to a relational database without structural changes.
