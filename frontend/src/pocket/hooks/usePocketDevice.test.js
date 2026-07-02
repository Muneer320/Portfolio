/**
 * Tests for usePocketDevice hook.
 *
 * Since the hook interacts with browser history (pushState/popState)
 * and sessionStorage, these tests verify the state management logic.
 *
 * @author Muneer Alam
 */

import { renderHook, act } from "@testing-library/react";
import usePocketDevice from "./usePocketDevice";

describe("usePocketDevice", () => {
  beforeEach(() => {
    // Clear sessionStorage and history state
    sessionStorage.clear();
    // Reset the URL hash to avoid history pollution
    window.history.replaceState(null, "", "/");
  });

  test("starts locked by default", () => {
    const { result } = renderHook(() => usePocketDevice());
    expect(result.current.isLocked).toBe(true);
    expect(result.current.currentApp).toBeNull();
  });

  test("unlock sets isLocked to false", () => {
    const { result } = renderHook(() => usePocketDevice());

    act(() => {
      result.current.unlock();
    });

    expect(result.current.isLocked).toBe(false);
    expect(result.current.currentApp).toBeNull();
  });

  test("openApp sets currentApp", () => {
    const { result } = renderHook(() => usePocketDevice());

    act(() => {
      result.current.unlock();
    });

    act(() => {
      result.current.openApp("projects");
    });

    expect(result.current.currentApp).toBe("projects");
  });

  test("closeApp returns to home screen", () => {
    const { result } = renderHook(() => usePocketDevice());

    act(() => {
      result.current.unlock();
    });
    act(() => {
      result.current.openApp("terminal");
    });
    act(() => {
      result.current.closeApp();
    });

    expect(result.current.currentApp).toBeNull();
  });

  test("showToast shows a message", () => {
    const { result } = renderHook(() => usePocketDevice());

    act(() => {
      result.current.showToast("Test notification");
    });

    expect(result.current.toast).toBe("Test notification");
  });

  test("multiple unlock and app switches", () => {
    const { result } = renderHook(() => usePocketDevice());

    act(() => {
      result.current.unlock();
    });
    act(() => {
      result.current.openApp("skills");
    });
    expect(result.current.currentApp).toBe("skills");

    act(() => {
      result.current.closeApp();
    });
    expect(result.current.currentApp).toBeNull();

    act(() => {
      result.current.openApp("contact");
    });
    expect(result.current.currentApp).toBe("contact");
  });
});
