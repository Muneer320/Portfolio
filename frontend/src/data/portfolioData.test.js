/**
 * Portfolio Data Unit Tests
 *
 * Tests for the portfolio data configuration to ensure content
 * is properly structured and all required fields are present.
 */
import { portfolioData } from "./portfolioData";

describe("portfolioData", () => {
  test("bio contains name", () => {
    expect(portfolioData.bio).toContain("Software Developer");
    expect(portfolioData.bio.length).toBeGreaterThan(50);
  });

  test("education contains institutions", () => {
    expect(portfolioData.education).toContain("IIT Madras");
    expect(portfolioData.education).toContain("Scaler");
    expect(portfolioData.education.length).toBeGreaterThan(20);
  });

  test("skills lists key technologies", () => {
    expect(portfolioData.skills).toContain("Python");
    expect(portfolioData.skills).toContain("React");
    expect(portfolioData.skills).toContain("Docker");
    expect(portfolioData.skills.length).toBeGreaterThan(50);
  });

  test("skillTags is non-empty array", () => {
    expect(Array.isArray(portfolioData.skillTags)).toBe(true);
    expect(portfolioData.skillTags.length).toBeGreaterThan(0);
    expect(portfolioData.skillTags).toContain("Python");
    expect(portfolioData.skillTags).toContain("React");
  });

  test("experience has duration", () => {
    expect(portfolioData.experience).toContain("6+ Years");
    expect(portfolioData.experience).toContain("2017");
    expect(portfolioData.experience.length).toBeGreaterThan(50);
  });

  test("projects contains key projects", () => {
    expect(portfolioData.projects).toContain("Ascent Dashboard");
    expect(portfolioData.projects).toContain("RhinoBox");
    expect(portfolioData.projects).toContain("BOOP");
    expect(portfolioData.projects).toContain("SST Lounge Bot");
    expect(portfolioData.projects).toContain("RehabFlow AI");
    expect(portfolioData.projects.length).toBeGreaterThan(100);
  });

  test("contact has email and links", () => {
    expect(portfolioData.contact).toContain("muneer.alam320@gmail.com");
    expect(portfolioData.contact).toContain("github.com/Muneer320");
    expect(portfolioData.contact).toContain("linkedin.com/in/muneer320");
    expect(portfolioData.contact).toContain("+91 91623 92229");
  });

  test("quickStats has all required fields", () => {
    expect(portfolioData.quickStats).toBeDefined();
    expect(portfolioData.quickStats.experience).toBe("6+ Years");
    expect(portfolioData.quickStats.projects).toBe("12+ Projects");
    expect(portfolioData.quickStats.technologies).toBe("30+ Technologies");
  });
});
