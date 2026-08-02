/**
 * Portfolio Data Unit Tests
 *
 * Tests for the portfolio data configuration to ensure content
 * is properly structured and all required fields are present.
 */
import { portfolioData } from "./portfolioData";

describe("portfolioData", () => {
  test("bio contains identity", () => {
    expect(portfolioData.bio).toContain("Creative systems engineer");
    expect(portfolioData.bio.length).toBeGreaterThan(50);
  });

  test("education contains institutions", () => {
    expect(portfolioData.education).toContain("Scaler School of Technology");
    expect(portfolioData.education).toContain("9.29");
    expect(portfolioData.education.length).toBeGreaterThan(20);
  });

  test("skills lists key technologies", () => {
    expect(portfolioData.skills).toContain("Python");
    expect(portfolioData.skills).toContain("React");
    expect(portfolioData.skills).toContain("Docker");
    expect(portfolioData.skills).toContain("multi-agent systems");
    expect(portfolioData.skills.length).toBeGreaterThan(50);
  });

  test("skillTags is non-empty array", () => {
    expect(Array.isArray(portfolioData.skillTags)).toBe(true);
    expect(portfolioData.skillTags.length).toBeGreaterThan(0);
    expect(portfolioData.skillTags).toContain("Python");
    expect(portfolioData.skillTags).toContain("React");
    expect(portfolioData.skillTags).toContain("Go");
  });

  test("experience has entries", () => {
    expect(portfolioData.experience).toContain("ParaPixel DigiServices");
    expect(portfolioData.experience).toContain("Ascent TechFest");
    expect(portfolioData.experience.length).toBeGreaterThan(50);
  });

  test("projects contains key projects", () => {
    expect(portfolioData.projects).toContain("Ascent Dashboard");
    expect(portfolioData.projects).toContain("RhinoBox");
    expect(portfolioData.projects).toContain("BOOP");
    expect(portfolioData.projects).toContain("codelines");
    expect(portfolioData.projects).toContain("GitGuild");
    expect(portfolioData.projects).toContain("LNX");
    expect(portfolioData.projects.length).toBeGreaterThan(100);
  });

  test("achievements contains hackathon wins", () => {
    expect(portfolioData.achievements).toContain("Smart Delhi Hackathon");
    expect(portfolioData.achievements).toContain("Blocktrain");
    expect(portfolioData.achievements).toContain("Clash of Code");
    expect(portfolioData.achievements.length).toBeGreaterThan(50);
  });

  test("certifications contains entries", () => {
    expect(portfolioData.certifications).toContain("GeeksforGeeks");
    expect(portfolioData.certifications).toContain("AWS");
    expect(portfolioData.certifications.length).toBeGreaterThan(20);
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
    expect(portfolioData.quickStats.projects).toBe("30+ Repositories");
    expect(portfolioData.quickStats.technologies).toBe("40+ Technologies");
  });
});
