# UI Guidelines

# Retail Analytics Dashboard

**Version:** 1.0

---

# Design Philosophy

The interface should feel like a modern SaaS analytics dashboard.

Design priorities:

* Clean
* Minimal
* Fast
* Professional
* Accessible
* Data-focused

Avoid unnecessary visual noise.

Information should always have visual hierarchy.

---

# Design Inspiration

The visual language should be inspired by:

* Vercel
* Linear
* Stripe Dashboard
* GitHub
* shadcn/ui

The goal is not to copy these products but to follow their design principles.

---

# Theme

Dark Mode should be the default experience.

Light Mode support should remain possible through Theme Provider.

---

# Color Palette

Use semantic colors instead of hardcoded values.

Examples:

Primary

Muted

Success

Warning

Destructive

Border

Background

Foreground

Leverage the default shadcn/ui theme and extend it only if necessary.

---

# Typography

Use a single font family across the application.

Recommended:

Geist

Hierarchy:

Page Title

Section Title

Card Title

Body

Caption

Font weight should communicate importance instead of increasing font size excessively.

---

# Layout

Maximum content width:

```text
1440px
```

Centered layout.

Consistent spacing throughout the application.

---

# Dashboard Layout

```
---------------------------------------------------

Retail Analytics Dashboard

---------------------------------------------------

Search Input

Region Filter

---------------------------------------------------

Stat Cards

Revenue

Products

Stores

Categories

---------------------------------------------------

Stores Table

---------------------------------------------------
```

---

# Store Detail Layout

```
---------------------------------------------------

Breadcrumb

Store Name

---------------------------------------------------

Summary Cards

---------------------------------------------------

Top Products

---------------------------------------------------

Products Table

---------------------------------------------------
```

---

# Grid System

Desktop

4-column KPI grid.

Tablet

2-column grid.

Mobile

Single-column layout.

---

# Spacing

Use Tailwind spacing scale consistently.

Preferred spacing:

4

6

8

12

16

Avoid arbitrary spacing values.

---

# Cards

Cards should:

* Have subtle borders.
* Avoid heavy shadows.
* Use rounded corners.
* Maintain consistent padding.

Every metric card should contain:

Icon

Title

Value

Optional helper text

---

# Tables

Use TanStack Table.

Requirements:

Sticky header.

Hover states.

Sortable columns.

Responsive overflow.

Readable row height.

Consistent alignment.

Numeric columns should be right aligned.

---

# Search Inputs

Search bars should include:

Search icon.

Placeholder text.

Clear spacing.

Accessible labels.

---

# Filters

Filters should:

Appear next to search on desktop.

Stack vertically on mobile.

---

# Empty States

Every empty state should include:

Icon.

Title.

Description.

Optional action button.

Example:

"No stores found."

---

# Error States

Error cards should include:

Icon.

Clear message.

Retry button.

Never expose raw error messages.

---

# Loading States

Prefer Skeleton components.

Avoid loading spinners unless absolutely necessary.

Skeletons should resemble the final UI.

---

# Breadcrumbs

Store Detail should include:

Dashboard

/

Store Name

---

# Badges

Categories should be displayed using badges.

Badges should use subtle colors.

---

# Tooltips

Use tooltips only when additional context improves usability.

Do not overuse them.

---

# Icons

Use Lucide React exclusively.

Icons should maintain consistent size.

Recommended:

16px

18px

20px

---

# Buttons

Use shadcn Button variants.

Primary actions:

Default Button.

Secondary actions:

Outline Button.

Destructive actions:

Destructive variant.

---

# Animations

Use subtle animations.

Recommended duration:

150ms–250ms.

Transitions should improve usability, never distract.

---

# Hover States

Interactive elements should clearly indicate hover.

Avoid dramatic animations.

---

# Focus States

Keyboard users must always know where focus is.

Never remove focus outlines.

---

# Responsive Behavior

Desktop

Full table.

Tablet

Responsive layout with horizontal scrolling when necessary.

Mobile

Cards stack vertically.

Tables become horizontally scrollable.

Never hide critical information.

---

# Accessibility

Follow WCAG AA guidelines.

Requirements:

Semantic HTML.

Keyboard navigation.

ARIA labels.

Visible focus.

Accessible color contrast.

---

# Number Formatting

Currency:

Use Intl.NumberFormat.

Thousands separators.

No manual formatting.

---

# Component Library

Reusable components should include:

PageHeader

SearchInput

FilterSelect

StatCard

SummaryCard

LoadingState

ErrorState

EmptyState

SectionTitle

Breadcrumbs

DataTable

TopProductsCard

---

# UX Principles

Every screen should answer:

Where am I?

What am I looking at?

What can I do next?

The interface should minimize cognitive load.

---

# Definition of Done

The UI is complete when:

* Responsive across all supported breakpoints.
* Accessible.
* Consistent.
* Uses reusable components.
* Uses semantic colors.
* Includes loading states.
* Includes empty states.
* Includes error states.
* Matches the documented layout.
* Feels like a polished SaaS dashboard.
