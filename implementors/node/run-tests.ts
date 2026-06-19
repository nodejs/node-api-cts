import path from 'node:path';
import { test } from 'node:test';

import { listDirectoryEntries, runFileInSubprocess } from './tests.ts';

const ROOT_PATH = path.resolve(import.meta.dirname, '..', '..');
const TESTS_ROOT_PATH = path.join(ROOT_PATH, 'tests');

function populateSuite(
  dir: string,
) {
  const { directories, files } = listDirectoryEntries(dir);

  for (const file of files) {
    test(path.relative(TESTS_ROOT_PATH, path.join(dir, file)), () => runFileInSubprocess(dir, file));
  }

  for (const directory of directories) {
    populateSuite(path.join(dir, directory));
  }
}

populateSuite(path.join(TESTS_ROOT_PATH, 'harness'));
populateSuite(path.join(TESTS_ROOT_PATH, 'js-native-api'));
populateSuite(path.join(TESTS_ROOT_PATH, 'node-api'));
