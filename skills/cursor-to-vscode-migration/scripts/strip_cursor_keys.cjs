#!/usr/bin/env node
// Removes Cursor-specific keys from a VS Code settings.json file.
// Handles JSONC (comments and trailing commas) by stripping them before parsing.

const fs = require("fs");
const path = require("path");

const filePath =
  process.argv[2] ||
  path.join(
    process.env.HOME,
    "Library",
    "Application Support",
    "Code",
    "User",
    "settings.json"
  );

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const raw = fs.readFileSync(filePath, "utf8");

// Strip JSONC features: single-line comments, block comments, trailing commas
function stripJsonc(str) {
  let result = "";
  let i = 0;
  let inString = false;

  while (i < str.length) {
    // Handle string literals (skip their contents)
    if (str[i] === '"' && (i === 0 || str[i - 1] !== "\\")) {
      inString = !inString;
      result += str[i];
      i++;
      continue;
    }

    if (inString) {
      result += str[i];
      i++;
      continue;
    }

    // Single-line comment
    if (str[i] === "/" && str[i + 1] === "/") {
      while (i < str.length && str[i] !== "\n") i++;
      continue;
    }

    // Block comment
    if (str[i] === "/" && str[i + 1] === "*") {
      i += 2;
      while (i < str.length && !(str[i] === "*" && str[i + 1] === "/")) i++;
      i += 2;
      continue;
    }

    result += str[i];
    i++;
  }

  // Remove trailing commas before } or ]
  return result.replace(/,(\s*[}\]])/g, "$1");
}

let settings;
try {
  settings = JSON.parse(stripJsonc(raw));
} catch (err) {
  console.error(`Failed to parse settings file: ${err.message}`);
  process.exit(1);
}

const CURSOR_PREFIXES = ["cursor.", "aicursor.", "anysphere."];
const removed = [];

for (const key of Object.keys(settings)) {
  if (CURSOR_PREFIXES.some((prefix) => key.startsWith(prefix))) {
    removed.push(key);
    delete settings[key];
  }
}

if (removed.length === 0) {
  console.log("No Cursor-specific keys found.");
  process.exit(0);
}

fs.writeFileSync(filePath, JSON.stringify(settings, null, 4) + "\n", "utf8");

console.log(`Removed ${removed.length} Cursor-specific key(s):`);
removed.forEach((k) => console.log(`  - ${k}`));
