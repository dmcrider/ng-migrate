import { exec as _exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(_exec);

export async function exec(cmd: string) {
  const { stdout, stderr } = await execAsync(cmd);
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
}
