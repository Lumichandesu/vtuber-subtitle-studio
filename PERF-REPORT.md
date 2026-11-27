# Performance report: perf-wave-1

Measured on 2026-11-27, Windows 11, Bun, against `HEAD` (f308c98, "before") checked out in a temporary
worktree and the `perf-wave-1` working tree ("after"). Server numbers come from `scripts/bench-server.ts`
(5 cold starts, then 3 WebSocket clients idle for 15 s, then 30 subtitle round trips). Outbound HTTP is
pointed at a dead proxy during the benchmark, so translation uses the offline lexicon/cache path and no
network traffic is made.

## Results

| Metric | Before | After | Change |
|---|---|---|---|
| UI JS shipped (vite build, raw) | 455.93 kB + 66.34 kB lazy chunk = 522.27 kB | 306.71 kB | -41% |
| UI JS shipped (gzip) | 128.78 kB + 19.84 kB = 148.62 kB | 89.57 kB | -40% |
| UI modules transformed | 1923 | 1604 | -319 |
| Server startup to first `/ping` (median of 5) | 101 ms, 97 ms (two runs) | 102 ms, 88 ms (two runs) | no measurable change |
| Server idle CPU, 3 clients, 15 s | 0.21 %, 0 % | 0 %, 0.31 % | no measurable change (noise) |
| Server RSS after idle | 67-68 MB | 68-70 MB | no measurable change |
| Subtitle round trip, cached phrase (median) | 0.20 / 0.23 ms | 0.14 / 0.15 ms | small, near noise |
| Telemetry timers with N clients | N | 1 | by code |
| JSON.stringify per broadcast with N clients | N | 1 | by code |

The server was already light at idle; the real waste was in the UI bundle and in per-client work that grows
with the number of connected overlays (OBS browser sources, control panel, extra tabs).

## Changes

1. UI bundle: `src-ui/hooks/useServerSync.ts` imported `BUILT_IN_PRESETS` from `src-server/types/schema.ts`,
   which also builds TypeBox/Elysia schemas, so the browser bundle pulled in TypeBox plus a Buffer polyfill
   chunk. The presets now live in the dependency-free `src-server/types/presets.ts`; `schema.ts` re-exports
   them, so server imports are unchanged.
2. WebSocket broadcasts (`src-server/routes/websocket.route.ts`): each event payload is serialized once and
   the string is reused for every client (cached per payload object in a WeakMap).
3. Telemetry: one shared 2.5 s timer for all clients instead of one per client. This also fixes the CPU
   percentage, which with several clients only measured the time since the previous client's tick.
4. Subtitle latency path (`src-server/services/ai-translator.ts`): the fallback "force target translation"
   step awaited each target language one after another; it now runs all targets in parallel. With 2 target
   languages that need the fallback, the worst-case wait drops from the sum of two HTTP calls to the slower
   one. Not benchmarked (it needs the network); verified by code reading and the existing tests.

## Tests

`bun test`: 6 pass with `PORT=28990`. Without it, the port test fails on this machine both before and after
the change, because Windows reserves TCP 18888-18987 (`netsh interface ipv4 show excludedportrange
protocol=tcp`), which covers the default port 18890 and the whole 50-port probe range. That is an
environment issue, not a regression. `vite build` succeeds.

Reproduce: `bun scripts/bench-server.ts . 3 15` (set `BENCH_PORT` to change the port).
