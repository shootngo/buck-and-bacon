/** Screen stay-on: Wake Lock when the browser allows it, best-effort otherwise. */

export const STAY_ON_KEY = "bnb-stay-on";

export function prefFromStorage(raw) {
  if (raw === "0") return { enabled: false, userSet: true };
  if (raw === "1") return { enabled: true, userSet: true };
  return { enabled: false, userSet: false };
}

/** Default ON in Butchering until the user flips the toggle. */
export function shouldStayOn(pref, { inButchering = false } = {}) {
  if (pref && pref.userSet) return Boolean(pref.enabled);
  return Boolean(inButchering);
}

export function stayOnLabel(enabled, { supported = true, held = false } = {}) {
  if (!enabled) return "Off — screen may sleep";
  if (held) return "On — screen should stay awake";
  if (!supported) return "On — this browser may still dim the screen";
  return "On — keeping the screen awake";
}

export function createStayOnController({
  storage = globalThis.localStorage,
  wakeLockApi = typeof navigator !== "undefined" ? navigator.wakeLock : undefined,
  documentRef = typeof document !== "undefined" ? document : undefined,
} = {}) {
  const pref = prefFromStorage(storage?.getItem?.(STAY_ON_KEY));
  const state = {
    enabled: pref.userSet ? pref.enabled : false,
    userSet: pref.userSet,
    held: false,
    supported: Boolean(wakeLockApi && typeof wakeLockApi.request === "function"),
    sentinel: null,
  };

  async function release() {
    const sentinel = state.sentinel;
    state.sentinel = null;
    state.held = false;
    if (sentinel) {
      try {
        await sentinel.release();
      } catch {
        /* already released */
      }
    }
  }

  async function acquire() {
    if (!state.enabled) {
      await release();
      return false;
    }
    if (!state.supported) return false;
    if (documentRef && documentRef.visibilityState && documentRef.visibilityState !== "visible") {
      return false;
    }
    try {
      const sentinel = await wakeLockApi.request("screen");
      state.sentinel = sentinel;
      state.held = true;
      if (sentinel && typeof sentinel.addEventListener === "function") {
        sentinel.addEventListener("release", () => {
          if (state.sentinel === sentinel) {
            state.held = false;
            state.sentinel = null;
          }
        });
      }
      return true;
    } catch {
      state.held = false;
      state.sentinel = null;
      return false;
    }
  }

  function persist() {
    if (!storage) return;
    if (!state.userSet) {
      storage.removeItem?.(STAY_ON_KEY);
      return;
    }
    storage.setItem(STAY_ON_KEY, state.enabled ? "1" : "0");
  }

  return {
    get enabled() {
      return state.enabled;
    },
    get held() {
      return state.held;
    },
    get supported() {
      return state.supported;
    },
    syncForView(inButchering) {
      if (!state.userSet) {
        state.enabled = shouldStayOn(prefFromStorage(null), { inButchering });
      }
      return state.enabled;
    },
    async setEnabled(on, { userSet = true } = {}) {
      state.enabled = Boolean(on);
      if (userSet) state.userSet = true;
      persist();
      if (state.enabled) return acquire();
      await release();
      return false;
    },
    acquire,
    release,
    label() {
      return stayOnLabel(state.enabled, { supported: state.supported, held: state.held });
    },
  };
}
