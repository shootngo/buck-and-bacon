import { APP_VERSION } from "./version.js";

export { APP_VERSION };

export function latestVersionMessage(version = APP_VERSION) {
  return `You're on the latest version (V ${version}).`;
}

export function updateFoundMessage(version = APP_VERSION) {
  return `Update found (V ${version}). Reloading…`;
}

export function shouldActivateUpdate({
  remoteVersion,
  localVersion = APP_VERSION,
  hasWaitingWorker = false,
} = {}) {
  if (hasWaitingWorker) return true;
  if (remoteVersion != null && String(remoteVersion) !== String(localVersion)) return true;
  return false;
}

export async function fetchRemoteVersion(
  fetchImpl = globalThis.fetch,
  url = `./version.json?t=${Date.now()}`,
) {
  const res = await fetchImpl(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`version.json ${res.status}`);
  const data = await res.json();
  if (!data || typeof data.version !== "string" || !data.version.trim()) {
    throw new Error("bad version.json");
  }
  return data.version.trim();
}
