#!/usr/bin/env node

// Downloads Node-API headers from the Node.js repository and generates
// Windows .def files by extracting function declarations via clang AST dump.
//
// Usage: node scripts/update-headers.mjs [--branch <branch>]

import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const INCLUDE_DIR = path.join(ROOT, "include");
const DEF_DIR = path.join(INCLUDE_DIR, "def");

const HEADER_FILES = [
  "js_native_api.h",
  "js_native_api_types.h",
  "node_api.h",
  "node_api_types.h",
];

function parseBranch() {
  const idx = process.argv.indexOf("--branch");
  return idx !== -1 && process.argv[idx + 1]
    ? process.argv[idx + 1]
    : "main";
}

async function downloadHeaders(branch) {
  const baseUrl = `https://raw.githubusercontent.com/nodejs/node/${branch}/src`;
  const results = await Promise.all(
    HEADER_FILES.map(async (file) => {
      const url = `${baseUrl}/${file}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download ${url}: ${response.status}`);
      }
      return { file, content: await response.text() };
    })
  );

  fs.mkdirSync(INCLUDE_DIR, { recursive: true });
  for (const { file, content } of results) {
    fs.writeFileSync(path.join(INCLUDE_DIR, file), content);
    console.log(`Downloaded ${file}`);
  }
}

function detectLatestStableVersion() {
  const content = fs.readFileSync(
    path.join(INCLUDE_DIR, "js_native_api.h"),
    "utf8"
  );
  const nodeApiContent = fs.readFileSync(
    path.join(INCLUDE_DIR, "node_api.h"),
    "utf8"
  );
  const combined = content + nodeApiContent;
  const versions = [...combined.matchAll(/NAPI_VERSION >= (\d+)/g)].map(
    (m) => Number(m[1])
  );
  return Math.max(...versions);
}

function runClang(headerFile, { experimental = false, napiVersion } = {}) {
  const args = [
    ...(experimental ? ["-D", "NAPI_EXPERIMENTAL"] : []),
    ...(napiVersion ? ["-D", `NAPI_VERSION=${napiVersion}`] : []),
    "-Xclang",
    "-ast-dump=json",
    "-fsyntax-only",
    "-I",
    INCLUDE_DIR,
    path.join(INCLUDE_DIR, headerFile),
  ];
  return new Promise((resolve, reject) => {
    execFile(
      "clang",
      args,
      { maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          reject(
            new Error(
              `clang failed on ${headerFile}: ${error.message}\n${stderr}`
            )
          );
          return;
        }
        resolve(stdout);
      }
    );
  });
}

function extractSymbols(astJson) {
  const ast = JSON.parse(astJson);
  return new Set(
    ast.inner
      .filter((node) => node.kind === "FunctionDecl")
      .map((node) => node.name)
  );
}

function generateDef(symbols) {
  return [...symbols].sort().join("\n") + "\n";
}

function writeDef(filename, symbols) {
  const defPath = path.join(DEF_DIR, filename);
  fs.writeFileSync(defPath, generateDef(symbols));
  console.log(
    `Generated ${path.relative(ROOT, defPath)} (${symbols.size} symbols)`
  );
}

async function generateDefFiles() {
  const latestVersion = detectLatestStableVersion();
  console.log(`Detected latest stable NAPI_VERSION: ${latestVersion}`);

  const [jsNativeApiAst, nodeApiAst, jsNativeApiExpAst, nodeApiExpAst] =
    await Promise.all([
      runClang("js_native_api.h", { napiVersion: latestVersion }),
      runClang("node_api.h", { napiVersion: latestVersion }),
      runClang("js_native_api.h", { experimental: true }),
      runClang("node_api.h", { experimental: true }),
    ]);

  const jsNativeApiStable = extractSymbols(jsNativeApiAst);
  const allStable = extractSymbols(nodeApiAst);
  const jsNativeApiAll = extractSymbols(jsNativeApiExpAst);
  const allAll = extractSymbols(nodeApiExpAst);

  // Each .def contains only its own layer (no duplicates across files)
  const nodeApiStable = allStable.difference(jsNativeApiStable);
  const jsNativeApiExp = jsNativeApiAll.difference(jsNativeApiStable);
  const nodeApiExp = allAll.difference(allStable).difference(jsNativeApiExp);

  fs.mkdirSync(DEF_DIR, { recursive: true });

  writeDef("js_native_api.def", jsNativeApiStable);
  writeDef("node_api.def", nodeApiStable);
  writeDef("js_native_api_experimental.def", jsNativeApiExp);
  writeDef("node_api_experimental.def", nodeApiExp);
}

const branch = parseBranch();
console.log(`Downloading headers from nodejs/node@${branch}...`);
await downloadHeaders(branch);
console.log("\nGenerating .def files via clang...");
await generateDefFiles();
console.log("\nDone.");
