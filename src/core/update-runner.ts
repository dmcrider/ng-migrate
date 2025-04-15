import { UpdateOptions } from 'src/types/options.js';
import { exec } from '../utils/exec.js';
import { log } from './logger.js';
import { runCodemods } from 'src/codemods/codemod-runner.js';
import inquirer from 'inquirer';

async function gitSnapshot(version: number){
  try {
    await exec(`git add . && git commit -m "Snapshot before Angular ${version} update"`);
    log.info(`📸 Git snapshot saved.`);
  } catch (err) {
    log.warn(`⚠️ Git snapshot failed (not a git repo?): ${err}`);
  }
}

export async function runUpdate(versions: number[], options: UpdateOptions) {
  let current = versions[0] - 1;
  for (const version of versions) {
    const cmd = `npx ng update @angular/core@${version} @angular/cli@${version}`;

    if(options.dryRun) {
      log.info(` [DRY-RUN] Would execute: ${cmd}`);
      log.info(` [DRY-RUN] Would run codemods for Angular ${current} → ${version}`);
      current = version;
      continue;
    }

    if (options.createGitSnapshots) {
      await gitSnapshot(version);
    }

    if (options.confirmEachStep && !options.autoConfirm) {
      log.info(`🔍 Previewing update for Angular ${version}...`);
      try {
        await exec(`${cmd} --dry-run`, options.verbose);
      } catch (error) {
        log.warn(`⚠️ Dry-run failed for Angular ${version}: ${error}`);
      }

      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: `Proceed with actual update to Angular ${version}?`,
          default: true
        }
      ]);

      if (!proceed) {
        log.warn(`⏭️ Skipped update to Angular ${version}.`);
        continue;
      }
    }

    log.info(`➡️ Executing: ${cmd}`);
    try {
      await exec(cmd, options.verbose);
      log.success(`✅ Angular ${version} update complete.`);

      log.info(`🔧 Running codemods for Angular ${current} → ${version}...`);
      await runCodemods(current, version, options.dryRun);
    } catch (error) {
      log.error(`❌ Failed at Angular ${version}: ${error}`);
      break;
    }
  }
}
