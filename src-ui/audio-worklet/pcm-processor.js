/**
 * Ultra-Low Latency 16kHz PCM AudioWorklet Processor
 * Runs directly on the dedicated audio rendering thread for zero jitter
 */

class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 2048;
    this.buffer = new Float32Array(this.bufferSize);
    this.bytesWritten = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input.length) {
      return true;
    }

    // Capture first channel (mono)
    const channelData = input[0];
    const len = channelData.length;

    let sumSquares = 0;
    let peak = 0;

    for (let i = 0; i < len; i++) {
      const val = channelData[i];
      sumSquares += val * val;
      const absVal = Math.abs(val);
      if (absVal > peak) peak = absVal;

      this.buffer[this.bytesWritten] = val;
      this.bytesWritten++;

      if (this.bytesWritten >= this.bufferSize) {
        // Post full chunk to main thread
        this.port.postMessage({
          type: 'pcm_data',
          pcm: this.buffer.slice(0, this.bufferSize),
        });
        this.bytesWritten = 0;
      }
    }

    // Calculate real-time RMS (Root Mean Square) volume level
    const rms = Math.sqrt(sumSquares / len);

    // Send high-rate volume telemetry to main thread for 60fps VU meter
    this.port.postMessage({
      type: 'volume_level',
      volume: rms,
      peak: peak,
    });

    return true;
  }
}

registerProcessor('pcm-processor', PCMProcessor);
