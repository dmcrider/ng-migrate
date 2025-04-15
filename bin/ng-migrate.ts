#!/usr/bin/env node
import { migrate } from '../src/commands/migrate.js';
import { analyze } from '../src/commands/analyze.js';

function parseFlags(args: string[]) {
  const flags: Record<string, string | boolean> = {};

  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, val] = arg.replace(/^--/, '').split('=');
      flags[key] = val ?? true;
    } else if (arg.startsWith('-')) {
      const shorthand = arg.replace(/^-/, '');
      switch (shorthand) {
        case 'y': flags['yes'] = true; break;
        case 'd': flags['dry-run'] = true; break;
        case 'v': flags['verbose'] = true; break;
        case 'h': flags['help'] = true; break;
        case 'confirm': flags['confirm-each-step'] = true; break;
        case 'snapshot': flags['create-git-snapshots'] = true; break;
        default:
          console.warn(`Unknown flag: ${arg}`);
      }
    }
  });

  return flags;
}

function printHelp() {
  console.log(`
ng-migrate CLI

Usage:
  ng-migrate migrate --to=<version> [options]

Required:
  --to=<version>        Target Angular version to upgrade to

Options:
  -h, --help                                    Show this help message
  -y, --yes                                     Auto-confirm all prompts
  -d, --dry-run                                 Simulate entire migration (no changes made)
  -v, --verbose                                 Show full command output
  -confirm, --confirm-each-step                 Confirm each step with dry-run preview
  -snapshot, --create-git-snapshots             Git commit before each update step

Examples:
  ng-migrate migrate --to=18 -confirm -snapshot
  ng-migrate migrate --to=17 -y -v
  ng-migrate migrate --to=15 -d
`);
}

const [, , command, ...args] = process.argv;

(async () => {
  const flags = parseFlags(args);
  if(flags['help']) {
    printHelp();
    process.exit(0);
  }
  if (command === 'migrate') {
    const targetVersion = flags['to'];
    if (!targetVersion || isNaN(Number(targetVersion))) {
      console.error('❌ Please provide a valid target version using --to=X');
      process.exit(1);
    }

    const options = {
      confirmEachStep: !!flags['confirmEachStep'],
      autoConfirm: !!flags['autoConfirm'],
      dryRun: !!flags['dryRun'],
      verbose: !!flags['verbose'],
      createGitSnapshots: !!flags['createGitSnapshots']
    };

    await migrate(Number(targetVersion), options);
  } else {
    await analyze();
  }
})();
