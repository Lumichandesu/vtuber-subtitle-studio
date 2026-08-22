import net from 'net';

/**
 * Server Configuration & Dynamic Port Fallback System
 * 
 * Default Port: 18890 (Unassigned High-Range Port)
 * If port 18890 is busy or collision occurs, dynamically searches upward (18891, 18892...)
 */

export interface AppEnvConfig {
  PORT: number;
  HOST: string;
  IS_DEV: boolean;
  GEMINI_API_KEY?: string;
  OPENAI_API_KEY?: string;
  AUDIO_SAMPLE_RATE: number;
  DEFAULT_VAD_THRESHOLD: number;
}

const DEFAULT_PORT = 18890;
const HOST = process.env.HOST || '0.0.0.0';
const IS_DEV = process.env.NODE_ENV !== 'production';

/**
 * Checks whether a given TCP port is available on localhost.
 * Resolves with true if free, false if in use.
 */
export async function isPortAvailable(port: number, host = '127.0.0.1'): Promise<boolean> {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', (err: any) => {
        if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
          resolve(false);
        } else {
          resolve(false);
        }
      })
      .once('listening', () => {
        tester.once('close', () => resolve(true)).close();
      })
      .listen(port, host);
  });
}

/**
 * Discovers the first free port starting from the default port.
 */
export async function getAvailablePort(startPort = DEFAULT_PORT, maxAttempts = 50): Promise<number> {
  // Allow manual override via PORT environment variable if provided
  const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : startPort;
  
  for (let port = envPort; port < envPort + maxAttempts; port++) {
    const free = await isPortAvailable(port);
    if (free) {
      return port;
    }
    console.warn(`[Anti-Collision] Port ${port} is occupied. Probing port ${port + 1}...`);
  }
  
  throw new Error(`Unable to find an available port in range ${envPort} - ${envPort + maxAttempts}`);
}

export const ENV: AppEnvConfig = {
  PORT: DEFAULT_PORT,
  HOST,
  IS_DEV,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  AUDIO_SAMPLE_RATE: 16000, // 16kHz PCM standard for STT
  DEFAULT_VAD_THRESHOLD: 0.015,
};
