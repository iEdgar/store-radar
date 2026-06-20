import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { ApiClientError, apiRequest } from "@/lib/api-client";

interface FakeResponse {
  ok: boolean;
  status: number;
  body: unknown;
}

function stubFetch(response: FakeResponse) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: response.ok,
      status: response.status,
      json: () => Promise.resolve(response.body),
    }),
  );
}

const schema = z.array(z.object({ id: z.string() }));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("apiRequest", () => {
  it("returns the validated data payload on success", async () => {
    stubFetch({
      ok: true,
      status: 200,
      body: { success: true, data: [{ id: "a" }], meta: { count: 1 } },
    });

    await expect(apiRequest({ path: "/stores", schema })).resolves.toEqual([
      { id: "a" },
    ]);
  });

  it("throws an ApiClientError carrying the code and status on an error response", async () => {
    stubFetch({
      ok: false,
      status: 404,
      body: {
        success: false,
        error: { code: "STORE_NOT_FOUND", message: "Store not found." },
      },
    });

    await expect(
      apiRequest({ path: "/stores/x", schema }),
    ).rejects.toBeInstanceOf(ApiClientError);
    await expect(
      apiRequest({ path: "/stores/x", schema }),
    ).rejects.toMatchObject({ code: "STORE_NOT_FOUND", status: 404 });
  });

  it("throws INVALID_DATA when the response shape is unexpected", async () => {
    stubFetch({
      ok: true,
      status: 200,
      body: { success: true, data: [{ id: 123 }] },
    });

    await expect(apiRequest({ path: "/stores", schema })).rejects.toMatchObject(
      {
        code: "INVALID_DATA",
      },
    );
  });
});
