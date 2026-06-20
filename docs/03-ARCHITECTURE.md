# Architecture

# Retail Analytics Dashboard

**Version:** 1.1

---

# Architecture Philosophy

La aplicación deberá seguir una arquitectura **Feature-Driven** con separación por responsabilidades (Layered Architecture).

Cada funcionalidad será independiente y contendrá únicamente los elementos necesarios para su funcionamiento.

El objetivo es facilitar:

* Escalabilidad
* Reutilización
* Mantenibilidad
* Legibilidad
* Bajo acoplamiento
* Alta cohesión

La estructura deberá permanecer consistente durante todo el proyecto.

---

# Architectural Principles

Toda implementación deberá respetar los siguientes principios:

* Single Responsibility Principle
* Separation of Concerns
* Composition over Inheritance
* DRY
* KISS
* Clean Code

La lógica de negocio nunca deberá mezclarse con la presentación.

---

# Project Structure

```text
src/
│
├── app/
│   ├── (dashboard)/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   │
│   ├── stores/
│   │   └── [id]/
│   │       ├── page.tsx
│   │       ├── loading.tsx
│   │       └── error.tsx
│   │
│   ├── api/
│   │   ├── stores/
│   │   └── products/
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── features/
│   ├── dashboard/
│   ├── stores/
│   └── products/
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
│
├── services/
│
├── lib/
│
├── hooks/
│
├── providers/
│
├── types/
│
├── schemas/
│
├── utils/
│
├── constants/
│
└── styles/
```

---

# Feature Structure

Cada feature deberá mantener la siguiente organización.

```text
features/

    stores/

        components/

        hooks/

        services/

        types/

        utils/

        constants/
```

Cada carpeta deberá contener únicamente código relacionado con esa funcionalidad.

---

# Responsibilities

## app/

Contiene únicamente:

* Rutas
* Layouts
* Loading UI
* Error UI
* Route Handlers

No deberá contener lógica de negocio.

---

## features/

Contiene toda la lógica relacionada con cada dominio.

Ejemplo:

Dashboard

Stores

Products

Cada feature es responsable de:

* Componentes
* Hooks
* Servicios
* Tipos
* Utilidades

---

## components/

Contendrá únicamente componentes reutilizables.

Ejemplos:

Button

Card

Table

SearchInput

PageHeader

StatCard

No deberá contener lógica de negocio.

---

## services/

Contendrá únicamente acceso a datos.

Ejemplo:

```ts
getStores()

getStore()

getProducts()
```

No deberá contener JSX.

Los services son **exclusivamente server-side**: leen los archivos JSON (o, en el futuro, una base de datos real) y son invocados únicamente por los Route Handlers. El cliente nunca importa un service: consume la API HTTP a través de hooks de TanStack Query.

---

## hooks/

Hooks reutilizables entre múltiples features.

Ejemplo:

```ts
useDebounce()

useMediaQuery()

useLocalStorage()
```

Los hooks específicos deberán permanecer dentro de cada feature.

---

## providers/

Todos los Providers globales.

Ejemplo:

* TanStack Query Provider
* Theme Provider

---

## schemas/

Validaciones utilizando Zod.

Toda respuesta de la API deberá validarse aquí.

---

## utils/

Funciones completamente reutilizables.

Ejemplos:

* currency formatter
* date formatter
* sorting helpers

No deberán depender de React.

---

## constants/

Valores constantes.

Ejemplos:

* regiones
* rutas
* colores
* configuración

---

## types/

Tipos compartidos entre múltiples features.

Los tipos específicos deberán vivir dentro de su propia feature.

---

# Data Flow

Toda la información deberá seguir el siguiente flujo:

```text
JSON

↓

Route Handler

↓

Service

↓

TanStack Query Hook

↓

Feature

↓

UI
```

Los componentes nunca deberán consumir directamente la API.

---

# Component Architecture

Los componentes deberán clasificarse en:

## UI Components

Componentes provenientes de shadcn/ui.

Ejemplos:

Button

Card

Table

---

## Shared Components

Componentes reutilizables.

Ejemplos:

SearchBar

PageHeader

EmptyState

ErrorState

LoadingState

StatCard

---

## Feature Components

Componentes exclusivos de una funcionalidad.

Ejemplo:

StoreTable

StoreCard

TopProducts

ProductsTable

---

# API Layer

Toda petición HTTP deberá implementarse mediante Services.

Ejemplo:

```ts
store.service.ts

product.service.ts
```

Los Services son server-side y se invocan únicamente desde los Route Handlers.

El cliente consume la API HTTP exclusivamente mediante hooks de TanStack Query.

Nunca realizar fetch desde un componente.

---

# Custom Hooks

Cada feature podrá tener hooks propios.

Ejemplo:

```ts
useStores()

useStore()

useProducts()

useStoreFilters()
```

Los hooks deberán encapsular toda la lógica relacionada con la información.

---

# Component Rules

Cada componente deberá cumplir:

* Una sola responsabilidad.
* Máximo 200 líneas (idealmente menos).
* Props tipadas.
* Sin lógica de negocio.
* Fácilmente reutilizable.

---

# Naming Conventions

## Components

PascalCase

```text
StoreCard.tsx
```

---

## Hooks

camelCase iniciando con use

```text
useStores.ts
```

---

## Services

camelCase

```text
store.service.ts
```

---

## Types

PascalCase

```ts
Store

Product

Sale
```

---

## Files

kebab-case o nombres descriptivos consistentes.

---

# Imports

Orden obligatorio.

1. React
2. Next.js
3. Librerías externas
4. Providers
5. Services
6. Hooks
7. Components
8. Utils
9. Types
10. Styles

Evitar imports circulares.

---

# Error Handling

Todos los errores deberán propagarse mediante TanStack Query.

Los componentes mostrarán únicamente la UI correspondiente.

La lógica de manejo de errores no deberá duplicarse.

---

# Scalability

La arquitectura deberá permitir agregar nuevas funcionalidades sin modificar las existentes.

Ejemplos futuros:

* Authentication
* Analytics
* Reports
* Users
* Settings

Cada nueva funcionalidad deberá implementarse como una nueva Feature.

---

# Definition of Done

Una funcionalidad se considerará terminada únicamente si:

* Sigue esta arquitectura.
* Respeta la estructura de carpetas.
* Mantiene separación de responsabilidades.
* Está completamente tipada.
* No contiene lógica duplicada.
* Es reutilizable cuando corresponda.
* Cumple con ESLint y TypeScript.
