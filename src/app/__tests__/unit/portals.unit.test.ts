import { getPortalById, portals, VALID_PORTALS } from "../../data/portals";

describe("portals data", () => {
  it("exposes OLX, Allegro, Vinted and Marketplace", () => {
    expect(VALID_PORTALS).toEqual([
      "olx",
      "allegro",
      "vinted",
      "marketplace",
    ]);
    expect(portals.map((p) => p.id)).toEqual(VALID_PORTALS);
  });

  it("returns OLX limits for olx portal", () => {
    const olx = getPortalById("olx");
    expect(olx.titleMax).toBe(150);
    expect(olx.descriptionMin).toBe(40);
    expect(olx.descriptionMax).toBe(9000);
  });

  it("falls back to OLX for unknown id", () => {
    expect(getPortalById("unknown").id).toBe("olx");
  });
});
