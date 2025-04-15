#!/usr/bin/env node
import { migrate } from '../src/commands/migrate.js';
import { analyze } from '../src/commands/analyze.js';
import inquirer from 'inquirer';

const [, , command, ...args] = process.argv;

const getFlag = (name: string): string | undefined => {
  const flag = args.find(arg => arg.startsWith(`--${name}=`));
  return flag?.split('=')[1];
};

(async () => {
  if (command === 'migrate') {
    const targetVersion = getFlag('to');
    if (!targetVersion || isNaN(Number(targetVersion))) {
      console.error('❌ Please provide a valid target version using --to=X');
      process.exit(1);
    }

    await migrate(Number(targetVersion));
  } else {
    await analyze();
  }
})();
