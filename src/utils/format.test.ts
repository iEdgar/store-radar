import { describe, expect, it } from "vitest";

import { formatCurrency, formatNumber, formatPercent } from "@/utils/format";

describe("formatCurrency", () => {
  it("formats a value as USD without decimals", () => {
    expect(formatCurrency(1491571)).toBe("$1,491,571");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });
});

describe("formatNumber", () => {
  it("adds locale-aware thousands separators", () => {
    expect(formatNumber(16099)).toBe("16,099");
  });

  it("leaves small numbers unchanged", () => {
    expect(formatNumber(5)).toBe("5");
  });
});

describe("formatPercent", () => {
  it("formats a fraction as a rounded percentage", () => {
    expect(formatPercent(0.5)).toBe("50%");
    expect(formatPercent(0.314)).toBe("31%");
  });
});
