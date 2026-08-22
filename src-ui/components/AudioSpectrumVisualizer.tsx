import React, { useEffect, useRef } from 'react';

interface AudioSpectrumVisualizerProps {
  isRecording: boolean;
  volumeLevel: number;
  analyserNode?: AnalyserNode | null;
}

export const AudioSpectrumVisualizer: React.FC<AudioSpectrumVisualizerProps> = ({
  isRecording,
  volumeLevel,
  analyserNode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bufferLength = 32;
    let dataArray = new Uint8Array(bufferLength);

    if (analyserNode) {
      analyserNode.fftSize = 64;
      bufferLength = analyserNode.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Subtle background grid
      ctx.fillStyle = 'rgba(10, 14, 23, 0.4)';
      ctx.fillRect(0, 0, width, height);

      if (isRecording) {
        if (analyserNode) {
          analyserNode.getByteFrequencyData(dataArray);
        } else {
          // Simulated smooth bars based on volumeLevel
          for (let i = 0; i < bufferLength; i++) {
            const harmonic = Math.sin((i / bufferLength) * Math.PI) * 0.8 + 0.2;
            const noise = (Math.random() * 0.2) * (volumeLevel > 0.01 ? 1 : 0);
            dataArray[i] = Math.min(255, (volumeLevel * 300 * harmonic + noise * 50));
          }
        }

        const barWidth = (width / bufferLength) - 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height * 0.9;

          // Gradient from Sakura Pink to Cyber Cyan
          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, '#ff79c6');
          gradient.addColorStop(0.5, '#bd93f9');
          gradient.addColorStop(1, '#8be9fd');

          ctx.fillStyle = gradient;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#ff79c6';

          // Rounded top bar
          ctx.beginPath();
          ctx.roundRect(x, height - Math.max(3, barHeight), barWidth, Math.max(3, barHeight), [2, 2, 0, 0]);
          ctx.fill();

          x += barWidth + 1.5;
        }
      } else {
        // Idle flatline
        ctx.strokeStyle = 'rgba(75, 85, 99, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isRecording, volumeLevel, analyserNode]);

  return (
    <div className="w-full h-12 rounded-lg bg-slate-950/80 border border-slate-800/80 overflow-hidden relative shadow-inner">
      <canvas
        ref={canvasRef}
        width={320}
        height={48}
        className="w-full h-full block"
      />
      <div className="absolute top-1 right-2 text-[9px] font-mono text-slate-500 pointer-events-none">
        {isRecording ? '60FPS FFT SPECTRUM' : 'MUTED / IDLE'}
      </div>
    </div>
  );
};
