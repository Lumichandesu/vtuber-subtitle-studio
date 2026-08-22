import { spawn } from 'child_process';
import path from 'path';

const exe = path.resolve(process.cwd(), 'dist/vtuber-subtitle-server.exe');
console.log('Testing binary:', exe);

const child = spawn(exe, [], {
  cwd: path.dirname(exe),
  stdio: 'pipe'
});

child.stdout?.on('data', (d) => console.log('[STDOUT]', d.toString()));
child.stderr?.on('data', (d) => console.error('[STDERR]', d.toString()));
child.on('exit', (code) => console.log('Process exited with code:', code));

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:18890/ping');
    console.log('HTTP Ping Status:', res.status, await res.text());
  } catch (err: any) {
    console.error('Fetch error:', err.message);
  } finally {
    child.kill();
    process.exit(0);
  }
}, 2500);
