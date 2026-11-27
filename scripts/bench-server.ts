/**
 * Server benchmark: startup time, idle CPU/RAM, and WebSocket subtitle round trip.
 * Usage: bun scripts/bench-server.ts [repoRoot] [clients=3] [idleSeconds=20]
 * Outbound HTTP is pointed at a dead proxy so translation falls back offline (no network).
 * Windows only for the CPU/RAM sample (uses PowerShell Get-Process).
 */
import path from 'path';
import fs from 'fs';
import os from 'os';

const root = path.resolve(process.argv[2] || '.');
const clients = Number(process.argv[3] || 3);
const idleSec = Number(process.argv[4] || 20);
const serverEntry = path.join(root, 'src-server', 'server.ts');

function procStats(pid: number): { cpuSec: number; rssMB: number } {
  const out = Bun.spawnSync(['powershell', '-NoProfile', '-Command',
    `$p=Get-Process -Id ${pid}; "$($p.TotalProcessorTime.TotalSeconds) $($p.WorkingSet64)"`]).stdout.toString().trim();
  const [cpu, ws] = out.split(/\s+/).map(Number);
  return { cpuSec: cpu, rssMB: ws / 1048576 };
}

async function waitPing(port: number, t0: number): Promise<number> {
  for (;;) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/ping`);
      if (r.ok) return performance.now() - t0;
    } catch {}
    await Bun.sleep(5);
  }
}

async function startServer(port: number) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'vss-bench-'));
  const t0 = performance.now();
  const proc = Bun.spawn(['bun', serverEntry], { cwd, env: { ...process.env, PORT: String(port), HTTP_PROXY: 'http://127.0.0.1:9', HTTPS_PROXY: 'http://127.0.0.1:9' }, stdout: 'ignore', stderr: 'ignore' });
  const ms = await waitPing(port, t0);
  return { proc, ms, cwd };
}

const port = Number(process.env.BENCH_PORT || 28990);
// 1) Startup time, 5 runs
const startups: number[] = [];
for (let i = 0; i < 5; i++) {
  const { proc, ms } = await startServer(port);
  startups.push(ms);
  proc.kill();
  await proc.exited;
  await Bun.sleep(300);
}

// 2) Idle CPU / RAM with N connected clients
const { proc } = await startServer(port);
const sockets: WebSocket[] = [];
let msgCount = 0;
for (let i = 0; i < clients; i++) {
  const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
  ws.onmessage = () => { msgCount++; };
  await new Promise((r) => (ws.onopen = r));
  sockets.push(ws);
}
await Bun.sleep(3000);
const a = procStats(proc.pid);
msgCount = 0;
await Bun.sleep(idleSec * 1000);
const b = procStats(proc.pid);
const idleMsgs = msgCount;

// 3) Subtitle round trip (repeated phrase, so translation comes from cache after the first call)
const ws = sockets[0];
const rtts: number[] = [];
for (let i = 0; i < 30; i++) {
  const id = `bench_${i}`;
  const t0 = performance.now();
  await new Promise<void>((resolve) => {
    const h = (ev: MessageEvent) => {
      const m = JSON.parse(String(ev.data));
      if ((m.type === 'subtitle_final' || m.type === 'subtitle_live') && m.payload.id === id) {
        ws.removeEventListener('message', h);
        resolve();
      }
    };
    ws.addEventListener('message', h);
    setTimeout(() => { ws.removeEventListener('message', h); resolve(); }, 5000);
    ws.send(JSON.stringify({ type: 'transcript_chunk', text: 'こんにちは', isFinal: true, id }));
  });
  rtts.push(performance.now() - t0);
}
const c = procStats(proc.pid);
for (const s of sockets) s.close();
proc.kill();

const med = (xs: number[]) => [...xs].sort((x, y) => x - y)[Math.floor(xs.length / 2)];
const warm = rtts.slice(1);
console.log(JSON.stringify({
  startupMsMedian: Math.round(med(startups)),
  startupMsAll: startups.map(Math.round),
  idleClients: clients,
  idleSeconds: idleSec,
  idleCpuPercentOneCore: +(((b.cpuSec - a.cpuSec) / idleSec) * 100).toFixed(2),
  idleMessagesReceivedTotal: idleMsgs,
  rssMBAfterIdle: Math.round(b.rssMB),
  rssMBAfterSubtitles: Math.round(c.rssMB),
  subtitleRttFirstMs: Math.round(rtts[0]),
  subtitleRttCachedMedianMs: +med(warm).toFixed(2),
}, null, 2));
process.exit(0);
