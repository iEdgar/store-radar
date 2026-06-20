import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import "@testing-library/jest-dom/vitest";

// With `globals: false`, RTL's automatic cleanup is not registered, so do it here.
afterEach(() => {
  cleanup();
});
