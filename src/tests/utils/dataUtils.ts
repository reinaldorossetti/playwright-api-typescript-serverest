import fs from 'node:fs';
import path from 'node:path';

export function resourcePath(...parts: string[]): string {
  return path.join(process.cwd(), 'src', 'tests', 'resources', ...parts);
}

export function loadJsonResource<T = Record<string, unknown>>(...parts: string[]): T {
  const filePath = resourcePath(...parts);
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

export function readCsvLines(...parts: string[]): string[] {
  const filePath = resourcePath(...parts);
  return fs
    .readFileSync(filePath, 'utf-8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function readCsvColumn(...parts: string[]): string[] {
  const lines = readCsvLines(...parts);
  return lines.slice(1);
}
