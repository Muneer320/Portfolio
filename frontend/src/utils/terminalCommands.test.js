/**
 * Terminal Commands Unit Tests
 */
import * as fileSystemLoader from "../utils/fileSystemLoader";
import { executeSystemCommand } from "../utils/terminalCommands";

const mockFileSystem = {
  "/": {
    type: "directory",
    children: {
      home: {
        type: "directory",
        children: {
          muneer: {
            type: "directory",
            children: {
              Documents: {
                type: "directory",
                children: {
                  "test.txt": { type: "file", content: "Hello World" },
                },
              },
              Music: { type: "directory", children: {} },
              Pictures: { type: "directory", children: {} },
            },
          },
        },
      },
    },
  },
};

beforeEach(() => {
  jest
    .spyOn(fileSystemLoader, "loadFileSystem")
    .mockResolvedValue(mockFileSystem);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("executeSystemCommand", () => {
  test("pwd returns current path", async () => {
    const result = await executeSystemCommand("pwd", "/home/muneer", jest.fn());
    expect(result.output).toBe("/home/muneer");
  });

  test("whoami returns username", async () => {
    const result = await executeSystemCommand("whoami", "/home/muneer", jest.fn());
    expect(result.output).toBe("muneer");
  });

  test("date returns a non-empty string", async () => {
    const result = await executeSystemCommand("date", "/home/muneer", jest.fn());
    expect(result.output.length).toBeGreaterThan(10);
  });

  test("uptime returns static value", async () => {
    const result = await executeSystemCommand("uptime", "/home/muneer", jest.fn());
    expect(result.output).toContain("2 days");
  });

  test("ls returns directory listing at /home/muneer", async () => {
    const result = await executeSystemCommand("ls", "/home/muneer", jest.fn());
    expect(result.output).toContain("Documents");
    expect(result.output).toContain("Music");
    expect(result.output).toContain("Pictures");
  });

  test("cd navigates to home with no args", async () => {
    const setPath = jest.fn();
    await executeSystemCommand("cd", "/home/muneer/Documents", setPath);
    expect(setPath).toHaveBeenCalledWith("/home/muneer");
  });

  test("cd .. goes to parent", async () => {
    const setPath = jest.fn();
    await executeSystemCommand("cd ..", "/home/muneer/Documents", setPath);
    expect(setPath).toHaveBeenCalledWith("/home/muneer");
  });

  test("cd to nonexistent directory returns error", async () => {
    const setPath = jest.fn();
    const result = await executeSystemCommand("cd /x/y/z", "/home/muneer", setPath);
    expect(result.output).toContain("No such file or directory");
  });

  test("unknown command returns error", async () => {
    const result = await executeSystemCommand("nonexistent", "/home/muneer", jest.fn());
    expect(result.output).toContain("Command not found");
  });
});
