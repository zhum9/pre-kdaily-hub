import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { validateCatalog } from "../learning/engine.js";
const file = process.argv[2] || "catalog-2026.11.01.json";
if (!/^catalog-[a-zA-Z0-9.-]+\.json$/.test(file))
  throw Error("Expected a versioned catalog JSON filename");
const contentUrl = new URL("../content/" + file, import.meta.url);
// The digest must match the bytes served from Git on every OS.
const bytes = Buffer.from((await readFile(contentUrl, 'utf8')).replace(/\r\n/g, '\n'));
const catalog = validateCatalog(JSON.parse(bytes));
await writeFile(contentUrl,bytes);
await writeFile(
  new URL("../content/manifest.json", import.meta.url),
  JSON.stringify(
    {
      schemaVersion: 1,
      version: catalog.version,
      file,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Validated ${catalog.skills.length} skills; manifest updated to ${catalog.version}`,
);
