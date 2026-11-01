import { DEFAULT_PROFILE, validateCatalog } from "./engine.js?v=31";
import { emptyScience, validateScienceState } from "../science/engine.js?v=31";
import { validateProgression } from "./profile.js?v=31";
export const BACKUP_FORMAT = "mario-learning-backup";
const fresh = () => ({
  schemaVersion: 1,
  profile: { ...DEFAULT_PROFILE },
  attempts: [],
  sessions: {},
  habits: {},
  interests: [],
  catalog: null,
  science: emptyScience(),
});
let db,
  memory = fresh(),
  listeners = new Set(),
  storageMode = "loading",
  storageError = "",
  ready;
export const getSnapshot = () => memory;
export const getStorageStatus = () => ({
  mode: storageMode,
  error: storageError,
});
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function publish(value) {
  const previous = value.profile;
  value.profile = {
    ...DEFAULT_PROFILE,
    ...previous,
    progressionMode:
      previous.progressionMode || (previous.term === 2 ? "manual" : "auto"),
  };
  value.science ||= emptyScience();
  memory = value;
  listeners.forEach((fn) => fn());
}
const clone = (value) => JSON.parse(JSON.stringify(value));
const channel =
  typeof window !== "undefined" && typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel("mario-learning-v1")
    : null;
channel?.addEventListener("message", async () => {
  if (db) {
    try {
      const state = await readDB();
      if (state) publish(state);
    } catch {}
  }
});
function readDB() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("state", "readonly"),
      request = tx.objectStore("state").get("family");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export function initialize() {
  if (ready) return ready;
  ready = (async () => {
    try {
      if (typeof indexedDB === "undefined")
        throw Error("IndexedDB unavailable");
      db = await new Promise((resolve, reject) => {
        const req = indexedDB.open("mario-learning", 1);
        req.onupgradeneeded = () => req.result.createObjectStore("state");
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
        req.onblocked = () => reject(Error("请关闭另一标签页后重试"));
      });
      db.onversionchange = () => db.close();
      const stored = await readDB(),
        existing = stored ? validateState(stored) : null;
      // Recover the fallback if the browser previously denied IndexedDB. Old rewards remain separate.
      const fallback = !existing && localStorage.getItem("mario-learning-v1");
      publish(
        existing || (fallback ? validateState(JSON.parse(fallback)) : fresh()),
      );
      storageMode = "indexeddb";
    } catch {
      db = null;
      storageMode = "local";
      try {
        const raw = localStorage.getItem("mario-learning-v1");
        if (raw) publish(validateState(JSON.parse(raw)));
      } catch {
        storageMode = "memory";
        storageError =
          "浏览器未允许保存，请先导出备份；关闭页面可能丢失本次记录。";
      }
    }
    return memory;
  })();
  return ready;
}
// IndexedDB read/modify/write is one transaction, preventing lost updates across tabs.
export async function update(mutator) {
  await initialize();
  let next;
  if (db) {
    await new Promise((resolve, reject) => {
      const tx = db.transaction("state", "readwrite"),
        store = tx.objectStore("state"),
        req = store.get("family");
      req.onsuccess = () => {
        try {
          next = clone(req.result || memory);
          mutator(next);
          store.put(next, "family");
        } catch (error) {
          tx.abort();
          reject(error);
        }
      };
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || Error("保存失败"));
      tx.onabort = () => reject(tx.error || Error("保存已中止"));
    }).catch((error) => {
      storageError = "保存失败，本次操作未写入。请先导出备份并检查浏览器空间。";
      listeners.forEach((fn) => fn());
      throw error;
    });
  } else {
    next = clone(memory);
    mutator(next);
    try {
      localStorage.setItem("mario-learning-v1", JSON.stringify(next));
      storageMode = "local";
    } catch {
      storageMode = "memory";
      storageError = "浏览器存储不可用，请导出备份；关闭页面可能丢失记录。";
    }
  }
  publish(next);
  channel?.postMessage("updated");
  return memory;
}
export function validateState(state) {
  if (
    !state ||
    state.schemaVersion !== 1 ||
    !state.profile ||
    ![1, 2].includes(state.profile.term) ||
    !Array.isArray(state.attempts) ||
    !state.sessions ||
    !state.habits ||
    !Array.isArray(state.interests) ||
    state.attempts.length > 100000
  )
    throw Error("学习记录格式不正确");
  validateProgression(state.profile);
  if (
    state.attempts.some(
      (a) =>
        !a.id ||
        !a.skillId ||
        !a.itemId ||
        !/^\d{4}-\d{2}-\d{2}$/.test(a.day) ||
        typeof a.correct !== "boolean" ||
        typeof a.at !== "string" ||
        !a.item ||
        a.item.skillId !== a.skillId ||
        a.item.id !== a.itemId,
    )
  )
    throw Error("作答记录不完整");
  if (state.catalog) validateCatalog(state.catalog);
  if (state.science) validateScienceState(state.science);
  for (const session of Object.values(state.sessions))
    if (
      !session.id ||
      !session.subject ||
      !Array.isArray(session.items) ||
      !session.answers
    )
      throw Error("练习记录不完整");
  return state;
}
export function backup(legacyStorage = localStorage) {
  const legacy = {};
  // Keep original stars, pets, dated check-ins. Legacy evidence is never treated as mastery.
  for (let i = 0; i < legacyStorage.length; i++) {
    const key = legacyStorage.key(i);
    if (key?.startsWith("daily-hub-")) legacy[key] = legacyStorage.getItem(key);
  }
  return {
    format: BACKUP_FORMAT,
    version: 1,
    exportedAt: new Date().toISOString(),
    state: clone(memory),
    legacy,
  };
}
export async function importBackup(input) {
  if (input?.format !== BACKUP_FORMAT || input.version !== 1)
    throw Error("不是 Mario 学习备份文件");
  const incoming = validateState(input.state);
  await update((state) => {
    if (!state.profile.configuredAt)
      state.profile = {
        ...DEFAULT_PROFILE,
        ...incoming.profile,
        progressionMode:
          incoming.profile.progressionMode ||
          (incoming.profile.term === 2 ? "manual" : "auto"),
      };
    state.attempts = [
      ...new Map(
        [...incoming.attempts, ...state.attempts].map((a) => [a.id, a]),
      ).values(),
    ].sort((a, b) => a.at.localeCompare(b.at));
    // Merge, never erase newer local session answers, habits or settings.
    for (const [id, s] of Object.entries(incoming.sessions)) {
      const current = state.sessions[id];
      state.sessions[id] = current
        ? { ...s, ...current, answers: { ...s.answers, ...current.answers } }
        : s;
    }
    for (const [day, habits] of Object.entries(incoming.habits))
      state.habits[day] = { ...habits, ...state.habits[day] };
    state.interests = [
      ...new Map(
        [...incoming.interests, ...state.interests].map((a) => [a.id, a]),
      ).values(),
    ];
    if (!state.catalog && incoming.catalog) state.catalog = incoming.catalog;
    if (incoming.science) {
      state.science ||= emptyScience();
      for (const [id, run] of Object.entries(incoming.science.sessions)) {
        const local = state.science.sessions[id];
        state.science.sessions[id] = local
          ? {
              ...run,
              ...local,
              answers: { ...run.answers, ...local.answers },
              finishedAt: local.finishedAt || run.finishedAt,
              prediction: local.prediction || run.prediction,
            }
          : run;
      }
      state.science.observations = {
        ...incoming.science.observations,
        ...state.science.observations,
      };
      if (!state.science.catalog)
        state.science.catalog = incoming.science.catalog;
    }
  });
  // Existing game progress wins. Import only absent legacy keys.
  let restored = 0;
  for (const [key, value] of Object.entries(input.legacy || {}))
    if (
      /^daily-hub-(profile|\d+)$/.test(key) &&
      typeof value === "string" &&
      localStorage.getItem(key) === null
    ) {
      try {
        JSON.parse(value);
        localStorage.setItem(key, value);
        restored++;
      } catch {}
    }
  return restored;
}
export async function refreshCatalog(fetcher = fetch) {
  await initialize();
  const controller = new AbortController(),
    timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetcher("./content/manifest.json", {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) throw Error("内容清单读取失败");
    const manifest = await response.json();
    if (
      manifest.schemaVersion !== 1 ||
      !/^catalog-[a-zA-Z0-9.-]+\.json$/.test(manifest.file) ||
      !/^[a-f0-9]{64}$/.test(manifest.sha256)
    )
      throw Error("内容清单格式不正确");
    if (memory.catalog?.version === manifest.version)
      return { updated: false, catalog: memory.catalog };
    const result = await fetcher("./content/" + manifest.file, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!result.ok) throw Error("内容包读取失败");
    const buffer = await result.arrayBuffer();
    if (buffer.byteLength > 600000) throw Error("内容包过大");
    const digest = await crypto.subtle.digest("SHA-256", buffer),
      actual = Array.from(new Uint8Array(digest), (b) =>
        b.toString(16).padStart(2, "0"),
      ).join("");
    if (actual !== manifest.sha256)
      throw Error("内容包校验未通过，继续使用原版本");
    const catalog = validateCatalog(
      JSON.parse(new TextDecoder().decode(buffer)),
    );
    if (catalog.version !== manifest.version) throw Error("内容版本不一致");
    await update((s) => {
      s.catalog = catalog;
      // Keep old evidence and immutable question snapshots, but do not resume
      // an old foundation session as the new enrichment course's first lesson.
      for (const session of Object.values(s.sessions))
        if (
          session.subject === "thinking" &&
          !session.finished &&
          session.items.length &&
          session.items.every(
            (item) =>
              catalog.skills.find((skill) => skill.id === item.skillId)
                ?.track === "foundation",
          )
        ) {
          session.archived = true;
          session.archiveReason =
            "原思维基础活动已移入数学小课堂，历史题目与作答仍保留";
        }
    });
    return { updated: true, catalog };
  } catch (error) {
    if (memory.catalog)
      return {
        updated: false,
        offline: true,
        catalog: memory.catalog,
        error: error.message,
      };
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
