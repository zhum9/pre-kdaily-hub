import { writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { catalog } from "./science-content.mjs";
import { validateScienceCatalog } from "../science/engine.js";
validateScienceCatalog(catalog);
const file = "science-2026.11.01.json",
  json = JSON.stringify(catalog, null, 2) + "\n";
await writeFile(new URL("../content/" + file, import.meta.url), json);
await writeFile(
  new URL("../content/science-manifest.json", import.meta.url),
  JSON.stringify(
    {
      schemaVersion: 1,
      version: catalog.version,
      file,
      sha256: createHash("sha256").update(json).digest("hex"),
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `${catalog.topics.length} topics, ${catalog.topics.flatMap((t) => t.levels).length} lessons; science manifest updated`,
);
