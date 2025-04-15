import { exec as _exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(_exec);

export async function exec(cmd: string, verbose: boolean = false) {
  const { stdout, stderr } = await execAsync(cmd);
  if (verbose && stdout) console.log(stdout);
  if (verbose && stderr) console.error(stderr);
}
