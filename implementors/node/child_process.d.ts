export interface SpawnTestOptions {
  cwd?: string;
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
