import { describe, expect, test } from "vitest";
import { timeAgo } from "../src/core";

describe("timeAgo", () => {
  test("returns invalid date for null/undefined", () => {
    expect(timeAgo(null)).toBe("invalid date");
    expect(timeAgo(undefined)).toBe("invalid date");
  });

  test("returns invalid date for invalid date string", () => {
    expect(timeAgo("not-a-date")).toBe("invalid date");
  });

  test("exact same time returns just now", () => {
    const now = new Date("2020-01-01T00:00:10.000Z");
    expect(timeAgo(now, { now })).toBe("just now");
  });

  test("seconds", () => {
    const now = new Date("2020-01-01T00:00:30.000Z");
    const input = new Date("2020-01-01T00:00:00.000Z");
    expect(timeAgo(input, { now })).toBe("30s ago");
  });

  test("minutes", () => {
    const now = new Date("2020-01-01T00:02:00.000Z");
    const input = new Date("2020-01-01T00:00:00.000Z");
    expect(timeAgo(input, { now })).toBe("2m ago");
  });

  test("hours", () => {
    const now = new Date("2020-01-01T03:00:00.000Z");
    const input = new Date("2020-01-01T00:00:00.000Z");
    expect(timeAgo(input, { now })).toBe("3h ago");
  });

  test("days", () => {
    const now = new Date("2020-01-06T00:00:00.000Z");
    const input = new Date("2020-01-01T00:00:00.000Z");
    expect(timeAgo(input, { now })).toBe("5d ago");
  });

  test("months (30d approximation)", () => {
    const now = new Date("2020-03-01T00:00:00.000Z");
    const input = new Date("2020-01-01T00:00:00.000Z");
    expect(timeAgo(input, { now })).toBe("2mo ago");
  });

  test("years (365d approximation)", () => {
    const now = new Date("2021-01-01T00:00:00.000Z");
    const input = new Date("2020-01-01T00:00:00.000Z");
    expect(timeAgo(input, { now })).toBe("1y ago");
  });

  test("future outputs when enabled", () => {
    const now = new Date("2020-01-01T00:00:00.000Z");
    const input = new Date("2020-01-01T00:02:00.000Z");
    expect(timeAgo(input, { now, future: true })).toBe("in 2m");
  });

  test("future clamps to just now when disabled", () => {
    const now = new Date("2020-01-01T00:00:00.000Z");
    const input = new Date("2020-01-01T00:02:00.000Z");
    expect(timeAgo(input, { now, future: false })).toBe("just now");
  });

  test("futureDisabledLabel shown when future: false and input is future", () => {
    const now = new Date("2020-01-01T00:00:00.000Z");
    const input = new Date("2020-01-01T00:02:00.000Z");
    expect(timeAgo(input, { now, future: false, futureDisabledLabel: "not yet" })).toBe("not yet");
  });

  test("justNowThreshold minimum is 2", () => {
    const now = new Date("2020-01-01T00:00:02.000Z");
    const input = new Date("2020-01-01T00:00:00.000Z");
    // passing 0 should still treat 2s diff as "just now"
    expect(timeAgo(input, { now, justNowThreshold: 0 })).toBe("just now");
  });

  test("short=false uses long labels", () => {
    const now = new Date("2020-01-01T00:02:00.000Z");
    const input = new Date("2020-01-01T00:00:00.000Z");
    expect(timeAgo(input, { now, short: false })).toBe("2 minutes ago");
  });

  test("locale switching (fr)", () => {
    const now = new Date("2020-01-01T00:02:00.000Z");
    const input = new Date("2020-01-01T00:00:00.000Z");
    expect(timeAgo(input, { now, locale: "fr" })).toBe("2min plus tôt");
  });

  test("locale base tag fallback (es-ES)", () => {
    const now = new Date("2020-01-01T00:02:00.000Z");
    const input = new Date("2020-01-01T00:00:00.000Z");
    expect(timeAgo(input, { now, locale: "es-ES" })).toBe("2min atrás");
  });

  test("custom label overrides", () => {
    const now = new Date("2020-01-01T00:02:00.000Z");
    const input = new Date("2020-01-01T00:00:00.000Z");
    expect(timeAgo(input, { now, labels: { minutes: "mins" } })).toBe("2mins ago");
  });

  test("accepts epoch seconds heuristically", () => {
    const now = 1_600_000_000_000;
    const inputSeconds = 1_600_000_000;
    expect(timeAgo(inputSeconds, { now })).toBe("just now");
  });

  test("seconds always floor (59.6s → 59s)", () => {
    const now = new Date("2020-01-01T00:00:59.600Z");
    const input = new Date("2020-01-01T00:00:00.000Z");
    expect(timeAgo(input, { now })).toBe("59s ago");
  });

  test("accepts ISO string input", () => {
    const now = new Date("2020-01-01T00:00:30.000Z");
    expect(timeAgo("2020-01-01T00:00:00.000Z", { now })).toBe("30s ago");
  });
});

