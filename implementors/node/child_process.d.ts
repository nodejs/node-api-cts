export interface SpawnTestOptions {
  cwd?: string;
  nodeFlags?: string[];
}

export interface SpawnTestResult {
  status: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
}

export function spawnTest(
  filePath: string,
  options?: SpawnTestOptions
): SpawnTestResult;
