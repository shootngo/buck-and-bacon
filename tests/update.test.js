import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { APP_VERSION } from "../js/version.js";
import {
  fetchRemoteVersion,
  latestVersionMessage,
  shouldActivateUpdate,
  updateFoundMessage,
} from "../js/update.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => readFileSync(join(root, name), "utf8");

describe("visible version stays in lockstep", () => {
  it("uses a V x.y app version", () => {
    assert.match(APP_VERSION, /^\d+\.\d+$/);
  });

  it("version.json matches js/version.js", () => {
    const json = JSON.parse(read("version.json"));
    assert.equal(json.version, APP_VERSION);
  });

  it("service worker cache name includes the app version", () => {
    const sw = read("sw.js");
    assert.match(sw, new RegExp(`buck-and-bacon-v${APP_VERSION.replaceAll(".", "\\.")}`));
    assert.match(sw, /SKIP_WAITING/);
    assert.match(sw, /version\.json/);
  });

  it("menu and about copy show Check for update and V x.y", () => {
    const html = read("index.html");
    assert.match(html, /data-action="check-update"/);
    assert.match(html, />Check for update</);
    assert.match(html, /data-app-version/);
    assert.match(html, /id="toast"/);
    assert.match(html, /id="update-banner"/);
  });
});

describe("update-check copy and decision", () => {
  it("friendly toast names the running version", () => {
    assert.equal(latestVersionMessage("1.1"), "You're on the latest version (V 1.1).");
    assert.equal(updateFoundMessage("1.2"), "Update found (V 1.2). Reloading…");
  });

  it("reloads when a waiting worker exists or the remote version differs", () => {
    assert.equal(shouldActivateUpdate({ hasWaitingWorker: true, remoteVersion: "1.1" }), true);
    assert.equal(shouldActivateUpdate({ remoteVersion: "1.2", localVersion: "1.1" }), true);
    assert.equal(shouldActivateUpdate({ remoteVersion: "1.1", localVersion: "1.1" }), false);
    assert.equal(shouldActivateUpdate({}), false);
  });

  it("reads version.json through a cache-busting fetch", async () => {
    const calls = [];
    const fetchImpl = async (url, opts) => {
      calls.push({ url, opts });
      return {
        ok: true,
        json: async () => ({ version: "1.1" }),
      };
    };
    const version = await fetchRemoteVersion(fetchImpl, "./version.json?t=1");
    assert.equal(version, "1.1");
    assert.equal(calls[0].opts.cache, "no-store");
  });

  it("rejects a missing or empty version payload", async () => {
    await assert.rejects(
      () =>
        fetchRemoteVersion(async () => ({
          ok: false,
          status: 404,
          json: async () => ({}),
        })),
      /version\.json 404/,
    );
    await assert.rejects(
      () =>
        fetchRemoteVersion(async () => ({
          ok: true,
          json: async () => ({ version: "  " }),
        })),
      /bad version\.json/,
    );
  });
});
