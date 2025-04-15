import { readFileSync } from 'fs';

export async function detectVersions(): Promise<{
  angular: string;
  typescript: string;
  rxjs: string;
}> {
  const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  return {
    angular: deps['@angular/core'] ?? 'unknown',
    typescript: deps['typescript'] ?? 'unknown',
    rxjs: deps['rxjs'] ?? 'unknown'
  };
}
