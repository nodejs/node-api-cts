#!/usr/bin/env node
import assert from "node:assert/strict";
import {
  spawnSync,
  type SpawnSyncOptionsWithStringEncoding,
} from "node:child_process";
import { cpSync, mkdtempSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";

const PATHS = ["test/js-native-api", "test/node-api", "doc/api/n-api.md"];
const NODE_REPO_URL = "https://github.com/nodejs/node.git";
const ROOT_PATH = path.resolve(import.meta.dirname, "..");
const NODE_ROOT_PATH = path.join(ROOT_PATH, "node");

function getOptionsFromArgs([ref = "main"]: string[]) {
  return { ref };
}

function runGit(
  args: string[],
  options: Partial<SpawnSyncOptionsWithStringEncoding> = {}
) {
  const result = spawnSync("git", args, {
    stdio: options.stdio ?? "inherit",
    encoding: options.encoding ?? "utf8",
    cwd: options.cwd,
  });

  assert(!result.error, result.error);
  assert.equal(
    result.status,
    0,
    `git ${args.join(" ")} exited with ${result.status ?? "unknown"}`
  );

  return result;
}

function ensureGitAvailable() {
  return runGit(["--version"], { stdio: "pipe" }).stdout.trim();
}

function copyPath(source: string, destination: string) {
  rmSync(destination, { recursive: true, force: true });

  mkdirSync(path.dirname(destination), { recursive: true });
  cpSync(source, destination, { recursive: true });
}

function main() {
  const { ref } = getOptionsFromArgs(process.argv.slice(2));
  mkdirSync(NODE_ROOT_PATH, { recursive: true });

  const gitVersion = ensureGitAvailable();
  console.log(`Using ${gitVersion}`);

  const tempDir = mkdtempSync(path.join(tmpdir(), "node-tests-"));
  console.log(`Cloning ${NODE_REPO_URL} @ ${ref} into ${tempDir}`);

  try {
    runGit([
      "clone",
      "--depth=1",
      "--filter=blob:none",
      "--sparse",
      "--branch",
      ref,
      NODE_REPO_URL,
      tempDir,
    ]);

    runGit(["sparse-checkout", "set", "--no-cone", ...PATHS], {
      cwd: tempDir,
    });

    for (const sourcePath of PATHS) {
      const source = path.join(tempDir, sourcePath);
      const destination = path.join(NODE_ROOT_PATH, sourcePath);
      console.log(`Updating ${destination}`);
      copyPath(source, destination);
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }

  console.log("Node.js tests and docs checkout complete.");
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
