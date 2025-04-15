import { exec } from '../utils/exec.js';
import { log } from './logger.js';

export async function runUpdate(versions: number[]) {
  for (const version of versions) {
    log.info(`➡️ Updating to Angular ${version}...`);
    try {
      await exec(`npx ng update @angular/core@${version} @angular/cli@${version}`);
      log.success(`✅ Angular ${version} update complete.`);
    } catch (error) {
      log.error(`❌ Failed at Angular ${version}: ${error}`);
      break;
    }
  }
}
