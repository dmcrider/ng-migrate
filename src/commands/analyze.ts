import { detectVersions } from '../core/version-detector.js';
import { log } from '../core/logger.js';

export async function analyze() {
  const versions = await detectVersions();
  log.info(`Detected Angular version: ${versions.angular}`);
  log.info(`Detected TypeScript version: ${versions.typescript}`);
  log.info(`Detected RxJS version: ${versions.rxjs}`);
}
