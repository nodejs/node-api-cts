import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { test, type TestContext } from "node:test";

const ROOT_PATH = path.resolve(import.meta.dirname, "..", "..");
const TESTS_ROOT_PATH = path.join(ROOT_PATH, "tests");

const ASSERT_MODULE_PATH = path.join(
  ROOT_PATH,
  "implementors",
  "node",
  "assert.js"
);
const LOAD_ADDON_MODULE_PATH = path.join(
  ROOT_PATH,
  "implementors",
  "node",
  "load-addon.js"
);

async function listDirectoryEntries(dir: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const directories: string[] = [];
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      directories.push(entry.name);
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(entry.name);
    }
  }

  directories.sort();
  files.sort();

  return { directories, files };
}

function runFileInSubprocess(cwd: string, filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        "--import",
        ASSERT_MODULE_PATH,
        "--import",
        LOAD_ADDON_MODULE_PATH,
        filePath,
      ],
      { cwd }
    );

    let stderrOutput = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => {
      stderrOutput += chunk;
    });

    child.stdout.pipe(process.stdout);

    child.on("error", reject);

    child.on("close", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      const reason =
        code !== null ? `exit code ${code}` : `signal ${signal ?? "unknown"}`;
      const trimmedStderr = stderrOutput.trim();
      const stderrSuffix = trimmedStderr
        ? `\n--- stderr ---\n${trimmedStderr}\n--- end stderr ---`
        : "";
      reject(
        new Error(
          `Test file ${path.relative(
            TESTS_ROOT_PATH,
            filePath
          )} failed (${reason})${stderrSuffix}`
        )
      );
    });
  });
}

async function populateSuite(
  testContext: TestContext,
  dir: string
): Promise<void> {
  const { directories, files } = await listDirectoryEntries(dir);

  for (const file of files) {
    await testContext.test(file, () => runFileInSubprocess(dir, file));
  }

  for (const directory of directories) {
    await testContext.test(directory, async (subTest) => {
      await populateSuite(subTest, path.join(dir, directory));
    });
  }
}

test("harness", async (t) => {
  await populateSuite(t, path.join(TESTS_ROOT_PATH, "harness"));
});

test("js-native-api", async (t) => {
  await populateSuite(t, path.join(TESTS_ROOT_PATH, "js-native-api"));
});

test("node-api", async (t) => {
  await populateSuite(t, path.join(TESTS_ROOT_PATH, "node-api"));
});
