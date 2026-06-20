import { describe, expect, it } from "vitest";

import { sortByField } from "@/utils/sort";

interface Row {
  name: string;
  value: number;
}

const rows: Row[] = [
  { name: "Beta", value: 30 },
  { name: "alpha", value: 10 },
  { name: "Gamma", value: 20 },
];

describe("sortByField", () => {
  it("sorts numbers ascending by default", () => {
    expect(sortByField(rows, "value").map((row) => row.value)).toEqual([
      10, 20, 30,
    ]);
  });

  it("sorts numbers descending", () => {
    expect(sortByField(rows, "value", "desc").map((row) => row.value)).toEqual([
      30, 20, 10,
    ]);
  });

  it("sorts strings with locale-aware comparison", () => {
    expect(sortByField(rows, "name").map((row) => row.name)).toEqual([
      "alpha",
      "Beta",
      "Gamma",
    ]);
  });

  it("does not mutate the input array", () => {
    const snapshot = [...rows];
    sortByField(rows, "value", "desc");
    expect(rows).toEqual(snapshot);
  });
});
