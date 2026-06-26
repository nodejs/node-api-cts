export interface SpawnTestOptions {
  cwd?: string;
  stdout?: 'pipe' | 'inherit';
}

export interface SpawnTestResult {
  status: number | null;
  aborted: boolean;
  stdout: string;
  stderr: string;
}

export function spawnTest(
  filePath: string,
  options?: SpawnTestOptions,
): SpawnTestResult;
