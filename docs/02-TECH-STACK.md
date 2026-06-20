# Technology Stack

# Retail Analytics Dashboard

**Version:** 1.3

---

# Philosophy

Este proyecto tiene como objetivo demostrar buenas prácticas modernas de desarrollo Frontend mediante un stack escalable, mantenible y ampliamente adoptado en la industria.

Todas las decisiones técnicas deberán priorizar:

* Simplicidad
* Escalabilidad
* Mantenibilidad
* Reutilización
* Rendimiento
* Legibilidad

No deberán incorporarse librerías innecesarias.

---

# Core Stack

| Technology              | Purpose                          |
| ----------------------- | -------------------------------- |
| Next.js 16 (App Router) | Framework principal              |
| React 19                | Biblioteca de UI                 |
| TypeScript              | Tipado estático                  |
| Tailwind CSS            | Sistema de estilos Utility-First |
| Node.js LTS             | Entorno de ejecución             |

---

# UI Components

## shadcn/ui

Todos los componentes visuales deberán construirse utilizando **shadcn/ui** como base.

Componentes esperados:

* Button
* Card
* Table
* Badge
* Input
* Select
* Skeleton
* Tooltip
* Breadcrumb
* Dropdown Menu
* Separator

Los componentes deberán extenderse mediante composición y nunca modificarse directamente.

---

# Icons

Utilizar exclusivamente **Lucide React**.

No mezclar múltiples librerías de íconos.

---

# Data Layer

## Mock API

Los datos deberán obtenerse mediante una API simulada utilizando **Route Handlers** de Next.js.

Ejemplos:

```text
GET /api/stores
GET /api/stores/:id
GET /api/products
```

Los Route Handlers leerán archivos JSON locales para simular un backend real.

Los componentes nunca deberán consumir archivos JSON directamente.

---

## Data Fetching

Utilizar **TanStack Query** para todas las peticiones HTTP.

Beneficios esperados:

* Manejo automático de loading.
* Manejo automático de errores.
* Caché.
* Invalidación de consultas.
* Reintentos automáticos.
* Separación entre UI y capa de datos.

Toda petición HTTP deberá implementarse mediante custom hooks.

Ejemplo:

```text
useStores()

useStore(id)

useProducts(storeId)
```

Los componentes nunca deberán ejecutar fetch directamente.

---

# Data Validation

Utilizar **Zod** para validar todas las respuestas provenientes de la Mock API.

Los datos deberán validarse antes de ser utilizados por la aplicación.

---

# Forms

**Nota de implementación:** los únicos "formularios" del proyecto son los filtros del dashboard (búsqueda + región) y la búsqueda de productos. Se implementaron como inputs controlados sincronizados con la URL (fuente única de verdad), lo cual es más simple que React Hook Form para este caso. Por ello, **React Hook Form y `@hookform/resolvers` no se utilizaron y se eliminaron de las dependencias**. Si en el futuro se añaden formularios reales (alta/edición), React Hook Form + Zod sigue siendo la opción recomendada.

---

# Tables

Utilizar **TanStack Table**.

La tabla deberá soportar:

* Sorting
* Filtering
* Column Definitions
* Custom Cell Rendering

Evitar implementar lógica personalizada cuando TanStack Table ya proporcione la funcionalidad.

---

# State Management

La aplicación deberá utilizar el estado más simple posible.

## Server State

Toda la información proveniente de la API será administrada mediante **TanStack Query**.

## UI State

Utilizar únicamente React Hooks.

* useState
* useMemo
* useCallback
* useTransition (cuando aporte valor)

No utilizar Redux, MobX, Zustand o Context API para manejo global de datos.

---

# Styling

Utilizar exclusivamente:

* Tailwind CSS
* CSS Variables

No utilizar:

* CSS Modules
* Sass
* Styled Components
* Emotion

---

# Routing

Utilizar App Router de Next.js.

Rutas iniciales:

```text
/
```

Dashboard principal.

```text
/stores/[id]
```

Detalle de tienda.

---

# URL State

Los filtros deberán sincronizarse con los parámetros de la URL.

Ejemplos:

```text
/?search=store
/?region=north
/?search=liverpool&region=west
```

Esto permitirá compartir enlaces y conservar el estado al actualizar la página.

---

# Loading Strategy

Cada consulta deberá implementar:

* Skeleton Loaders
* Suspense cuando sea apropiado
* Loading UI de Next.js
* Estados visuales consistentes

Evitar utilizar spinners como indicador principal.

---

# Error Handling

Cada pantalla deberá contemplar:

* Loading State
* Empty State
* Error State

Los errores deberán centralizarse mediante componentes reutilizables.

---

# Number Formatting

Utilizar la API nativa de JavaScript.

```text
Intl.NumberFormat
```

Aplicaciones:

* Moneda
* Cantidades
* Separadores de miles
* Porcentajes

---

# Accessibility

La aplicación deberá cumplir con buenas prácticas de accesibilidad.

Como mínimo:

* HTML semántico
* Navegación mediante teclado
* Focus visible
* Labels accesibles
* Roles ARIA cuando sean necesarios

---

# Responsive Design

La estrategia será Mobile First.

Breakpoints:

* Mobile
* Tablet
* Desktop

No crear versiones distintas de una misma pantalla.

---

# Code Quality

La aplicación deberá mantener:

* TypeScript Strict Mode
* ESLint
* Prettier

No se permite utilizar:

* any
* @ts-ignore
* código comentado
* variables sin uso

---

# Testing

Aunque no forma parte del alcance obligatorio, la arquitectura deberá permitir incorporar pruebas fácilmente.

Tecnologías recomendadas:

* Vitest
* React Testing Library

Priorizar pruebas para:

* Hooks
* Utilidades
* Componentes reutilizables

---

# Performance Guidelines

Priorizar:

* Componentes reutilizables.
* Memoización cuando aporte valor.
* Lazy Loading de componentes pesados.
* Mínimos renderizados.
* Separación entre lógica y presentación.

Evitar optimizaciones prematuras.

---

# Folder Structure

La organización del proyecto será definida en **03-ARCHITECTURE.md**.

Toda decisión relacionada con capas, responsabilidades y organización de carpetas deberá seguir dicho documento.

---

# Approved Libraries

## Core

* Next.js
* React
* TypeScript

## UI

* Tailwind CSS
* shadcn/ui
* Lucide React

## Data

* TanStack Query
* TanStack Table
* Zod

## Forms

* React Hook Form — *no utilizado en esta versión (los filtros usan inputs controlados + URL); recomendado para formularios reales futuros.*

## Utilities

* clsx
* tailwind-merge

No agregar nuevas dependencias sin una justificación técnica.

---

# Development Principles

Todo el desarrollo deberá seguir los siguientes principios:

* Clean Code
* SOLID
* DRY
* KISS
* Composition over Inheritance
* Single Responsibility Principle

La prioridad será construir una aplicación clara, mantenible y preparada para crecer.
