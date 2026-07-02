/**
 * Tests for Pocket Device app registry.
 *
 * Verifies that all apps defined in the registry have the required fields
 * and valid lazy-loaded component imports.
 *
 * @author Muneer Alam
 */

import { APPS } from "./apps";

describe("App Registry", () => {
  test("has at least 5 apps", () => {
    expect(APPS.length).toBeGreaterThanOrEqual(5);
  });

  test("every app has required fields", () => {
    APPS.forEach((app) => {
      expect(app.id).toBeDefined();
      expect(typeof app.id).toBe("string");
      expect(app.name).toBeDefined();
      expect(typeof app.name).toBe("string");
      expect(app.icon).toBeDefined();
      expect(app.component).toBeDefined();
      expect(app.category).toBeDefined();
    });
  });

  test("all app IDs are unique", () => {
    const ids = APPS.map((a) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test("all app names are unique", () => {
    const names = APPS.map((a) => a.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  test("terminal app is first (default position)", () => {
    expect(APPS[0].id).toBe("terminal");
  });

  test("every app has a valid category", () => {
    const validCategories = ["system", "portfolio", "actions", "personal"];
    APPS.forEach((app) => {
      expect(validCategories).toContain(app.category);
    });
  });

  test("badge is null or a number", () => {
    APPS.forEach((app) => {
      if (app.badge !== null) {
        expect(typeof app.badge).toBe("number");
        expect(app.badge).toBeGreaterThan(0);
      }
    });
  });
});
