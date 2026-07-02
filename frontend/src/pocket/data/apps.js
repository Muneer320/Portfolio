/**
 * Pocket Device — App Registry
 *
 * Single source of truth for which apps exist on the Pocket Device.
 * Each entry defines: id, name, display icon, category, lazy-loaded component,
 * and optional badge count.
 *
 * To add a new app: add an entry here, create the component in apps/,
 * and the DeviceShell will render it automatically.
 *
 * @author Muneer Alam
 */

import { lazy } from "react";
import { portfolioData } from "../../data/portfolioData";

// Helper: count projects from portfolio data
const projectCount =
  portfolioData.projects
    ?.split("\n")
    .filter((l) => l.trim().startsWith("###") || l.trim().startsWith("**"))
    .filter((l) => l.includes(":")) // crude heading count
    .length || 12;

const skillCount = portfolioData.skillTags?.length || 30;

export const APPS = [
  {
    id: "terminal",
    name: "Terminal",
    icon: "\u276F\u005F", // >_
    category: "system",
    component: lazy(() => import("../apps/TerminalApp")),
    badge: null,
  },
  {
    id: "projects",
    name: "Projects",
    icon: "\uD83D\uDCC1",
    category: "portfolio",
    component: lazy(() => import("../apps/ProjectsApp")),
    badge: projectCount,
  },
  {
    id: "skills",
    name: "Skills",
    icon: "\uD83D\uDD27",
    category: "portfolio",
    component: lazy(() => import("../apps/SkillsApp")),
    badge: skillCount,
  },
  {
    id: "experience",
    name: "Experience",
    icon: "\uD83D\uDCCB",
    category: "portfolio",
    component: lazy(() => import("../apps/ExperienceApp")),
    badge: null,
  },
  {
    id: "cv",
    name: "CV",
    icon: "\uD83D\uDCC4",
    category: "actions",
    component: lazy(() => import("../apps/CvApp")),
    badge: null,
  },
  {
    id: "contact",
    name: "Contact",
    icon: "\u2709\uFE0F",
    category: "actions",
    component: lazy(() => import("../apps/ContactApp")),
    badge: null,
  },
  {
    id: "about",
    name: "About",
    icon: "\uD83D\uDC64",
    category: "personal",
    component: lazy(() => import("../apps/AboutApp")),
    badge: null,
  },
];

/** Apps that appear in the bottom dock (subset of APPS) */
export const DOCK_APPS = ["home", "terminal", "contact"];

/** Home screen grid columns */
export const GRID_COLUMNS = 3;
