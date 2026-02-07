#!/usr/bin/env node
// Lists Cursor extension IDs and writes installable IDs to a file.
// Filters out known Cursor-only extensions.

const fs = require("fs");
const path = require("path");

const CURSOR_EXT_DIR = path.join(process.env.HOME, ".cursor", "extensions");
const OUTPUT_FILE = "/tmp/extensions_to_install.txt";

// Extensions that only work in Cursor or are no longer needed
const SKIP_LIST = new Set([
  "openai.chatgpt",
  "anysphere.cursor-copilot",
  "anysphere.cursor-chat",
  "anysphere.cursor-tools",
]);

// Prefixes for Cursor-only extensions not in the marketplace
const SKIP_PREFIXES = ["anysphere.", "cursor."];

if (!fs.existsSync(CURSOR_EXT_DIR)) {
  console.error(`Cursor extensions directory not found: ${CURSOR_EXT_DIR}`);
  process.exit(1);
}

const entries = fs.readdirSync(CURSOR_EXT_DIR).filter((e) => {
  return e !== "extensions.json" && !e.startsWith(".");
});

// Extract publisher.name from directory names like "publisher.name-1.2.3-universal"
// Strategy: find the last occurrence of -<semver> to handle names with hyphens
const ids = new Set();
for (const entry of entries) {
  // Match everything before the last -<digit>.<digit> pattern
  const match = entry.match(/^(.+)-(\d+\.\d+\.\d+.*)$/);
  if (match) {
    ids.add(match[1]);
  }
}

const toInstall = [];
const skipped = [];

for (const id of [...ids].sort()) {
  if (
    SKIP_LIST.has(id) ||
    SKIP_PREFIXES.some((prefix) => id.startsWith(prefix))
  ) {
    skipped.push(id);
  } else {
    toInstall.push(id);
  }
}

fs.writeFileSync(OUTPUT_FILE, toInstall.join("\n") + "\n", "utf8");

console.log(`Found ${ids.size} extensions in Cursor.`);
console.log(`Installing: ${toInstall.length}`);
if (skipped.length > 0) {
  console.log(`Skipping: ${skipped.join(", ")}`);
}
console.log(`\nExtension list written to: ${OUTPUT_FILE}`);
