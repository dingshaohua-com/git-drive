import { execSync } from 'node:child_process';
import { platform } from 'node:os';

const isWin = platform() === 'win32';

const killCommand = (name: string): string =>
  isWin
    ? `taskkill /f /im ${name}.exe 2>nul`
    : `pkill -f ${name}`;

try {
  execSync(killCommand('chokidar'), { stdio: 'inherit' });
  execSync(killCommand('tsx'), { stdio: 'inherit' });
} catch {
  // ignore errors when process not found
}