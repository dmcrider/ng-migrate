import { runUpdate } from '../core/update-runner.js';
import { detectVersions } from '../core/version-detector.js';
import { log } from '../core/logger.js';

export async function migrate(target: number) {
  const { angular: currentVersionRaw } = await detectVersions();
  const current = parseInt(currentVersionRaw.replace(/[^0-9]/g, ''), 10);

  if (isNaN(current)) {
    log.error(`Unable to parse current Angular version: ${currentVersionRaw}`);
    process.exit(1);
  }

  if (current >= target) {
    log.warn(`Already on Angular ${current} or higher.`);
    return;
  }

  const steps = Array.from({ length: target - current }, (_, i) => current + i + 1);
  await runUpdate(steps);
}
