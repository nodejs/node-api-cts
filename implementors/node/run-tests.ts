import path from "node:path";
import { suite, test } from "node:test";

import { listDirectoryEntries, runFileInSubprocess } from "./tests.ts";

const ROOT_PATH = path.resolve(import.meta.dirname, "..", "..");
const TESTS_ROOT_PATH = path.join(ROOT_PATH, "tests");

function populateSuite(dir: string) {
  const { directories, files } = listDirectoryEntries(dir);

  for (const file of files) {
    test(file, () => runFileInSubprocess(dir, file));
  }

  for (const directory of directories) {
    suite(directory, () => {
      populateSuite(path.join(dir, directory));
    });
  }
}

suite("harness", () => {
  populateSuite(path.join(TESTS_ROOT_PATH, "harness"));
});

suite("js-native-api", () => {
  populateSuite(path.join(TESTS_ROOT_PATH, "js-native-api"));
});

suite("node-api", () => {
  populateSuite(path.join(TESTS_ROOT_PATH, "node-api"));
});
