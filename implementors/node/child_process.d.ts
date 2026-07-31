export interface SpawnTestOptions {
  cwd?: string;
  stdout?: 'pipe' | 'inherit';
  worker?: boolean;
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
): Promise<SpawnTestResult>;
