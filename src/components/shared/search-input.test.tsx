import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SearchInput } from "@/components/shared/search-input";

describe("SearchInput", () => {
  it("exposes an accessible textbox using the given label", () => {
    render(
      <SearchInput value="" onValueChange={() => {}} label="Search stores" />,
    );

    expect(
      screen.getByRole("textbox", { name: "Search stores" }),
    ).toBeInTheDocument();
  });

  it("calls onValueChange as the user types", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SearchInput value="" onValueChange={onValueChange} label="Search" />,
    );

    await user.type(screen.getByRole("textbox"), "a");

    expect(onValueChange).toHaveBeenCalledWith("a");
  });

  it("shows the clear button only when there is a value and clears on click", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <SearchInput value="" onValueChange={onValueChange} label="Search" />,
    );

    expect(
      screen.queryByRole("button", { name: /clear search/i }),
    ).not.toBeInTheDocument();

    rerender(
      <SearchInput value="abc" onValueChange={onValueChange} label="Search" />,
    );
    await user.click(screen.getByRole("button", { name: /clear search/i }));

    expect(onValueChange).toHaveBeenCalledWith("");
  });
});
