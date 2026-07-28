import { describe, expect, it } from "vitest";
import { createBadge } from "./badge.js";

describe("createBadge", () => {
  it("defaults to the info tone", () => {
    expect(createBadge({ label: "New" })).toBe('<span class="badge badge--info">New</span>');
  });

  it("respects an explicit tone", () => {
    expect(createBadge({ label: "Danger", tone: "error" })).toBe(
      '<span class="badge badge--error">Danger</span>',
    );
  });
});
