import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "@/components/shared/empty-state";

describe("EmptyState", () => {
  it("renders the title and description with a status role", () => {
    render(
      <EmptyState
        title="No stores found"
        description="No stores match your current filters."
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "No stores found" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("No stores match your current filters."),
    ).toBeInTheDocument();
  });

  it("renders an optional action", () => {
    render(
      <EmptyState title="Empty" action={<button>Clear filters</button>} />,
    );

    expect(
      screen.getByRole("button", { name: "Clear filters" }),
    ).toBeInTheDocument();
  });
});
