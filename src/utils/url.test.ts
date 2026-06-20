import { describe, expect, it } from "vitest";

import { buildQueryString } from "@/utils/url";

describe("buildQueryString", () => {
  it("returns an empty string when there is nothing to serialize", () => {
    expect(buildQueryString()).toBe("");
    expect(buildQueryString({})).toBe("");
  });

  it("omits undefined, null and empty values", () => {
    expect(buildQueryString({ a: "x", b: undefined, c: "", d: null })).toBe(
      "?a=x",
    );
  });

  it("serializes multiple values with a leading ?", () => {
    expect(buildQueryString({ search: "downtown", region: "East" })).toBe(
      "?search=downtown&region=East",
    );
  });

  it("encodes special characters", () => {
    expect(buildQueryString({ q: "a b&c" })).toBe("?q=a+b%26c");
  });
});
