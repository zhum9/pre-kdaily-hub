import * as store from "../learning/store.js?v=31";
import { emptyScience, validateScienceCatalog } from "./engine.js?v=31";
export async function refreshScience(fetcher = fetch) {
  await store.initialize();
  const controller = new AbortController(),
    timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetcher("./content/science-manifest.json", {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) throw Error("科普内容清单读取失败");
    const manifest = await response.json();
    if (
      manifest.schemaVersion !== 1 ||
      !/^science-[a-zA-Z0-9.-]+\.json$/.test(manifest.file) ||
      !/^[a-f0-9]{64}$/.test(manifest.sha256)
    )
      throw Error("科普清单格式不正确");
    if (store.getSnapshot().science?.catalog?.version === manifest.version)
      return { updated: false };
    const result = await fetcher("./content/" + manifest.file, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!result.ok) throw Error("科普内容包读取失败");
    const buffer = await result.arrayBuffer();
    if (buffer.byteLength > 1200000) throw Error("科普内容包过大");
    const digest = await crypto.subtle.digest("SHA-256", buffer);
    const actual = Array.from(new Uint8Array(digest), (b) =>
      b.toString(16).padStart(2, "0"),
    ).join("");
    if (actual !== manifest.sha256)
      throw Error("科普内容校验未通过，保留原版本");
    const catalog = validateScienceCatalog(
      JSON.parse(new TextDecoder().decode(buffer)),
    );
    if (catalog.version !== manifest.version) throw Error("科普内容版本不一致");
    await store.update((state) => {
      state.science ||= emptyScience();
      state.science.catalog = catalog;
    });
    return { updated: true };
  } catch (error) {
    if (store.getSnapshot().science?.catalog)
      return { updated: false, offline: true, error: error.message };
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
