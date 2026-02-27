import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

vi.mock("react-chartjs-2", () => ({
  Line: () => <div data-testid="mock-chart">Chart</div>,
}));

vi.mock("mqtt", () => ({
  default: {
    connect: () => ({
      on: vi.fn(),
      subscribe: vi.fn(),
      end: vi.fn(),
    }),
  },
}));

describe("NovaMetrics UI Rakennelmatesti", () => {
  it("sisältää pääotsikon elementin ja se ei ole tyhjä", () => {
    const { container } = render(<App />);
    const header = container.querySelector("h1");

    expect(header).toBeDefined();
    expect(header?.textContent?.trim().length).toBeGreaterThan(3);
  });

  it("sisältää lämpötilan näyttöalueen ja se ei ole tyhjä", () => {
    const { container } = render(<App />);
    const tempValue = container.querySelector(".text-8xl");

    expect(tempValue).toBeDefined();
    expect(tempValue?.textContent?.trim()).not.toBe("");
  });

  it("sisältää status-ilmoituksen (Network/Online) ja se ei ole tyhjä", () => {
    const { container } = render(<App />);
    const statusArea = container.querySelector(
      ".bg-white\\/5, .flex.items-center.gap-3",
    );

    expect(statusArea).toBeDefined();
    expect(statusArea?.textContent?.trim().length).toBeGreaterThan(0);
  });

  it("sisältää footerin ja se ei ole tyhjä", () => {
    const { container } = render(<App />);
    const footer = container.querySelector("footer");

    expect(footer).toBeDefined();
    expect(footer?.textContent?.trim().length).toBeGreaterThan(5);
  });

  it("renderöi kuvaaja-alueen (Chart Container)", () => {
    const { container } = render(<App />);
    const chartContainer = container.querySelector(".lg\\:col-span-2");

    expect(chartContainer).toBeDefined();
  });
});
