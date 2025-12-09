'use client';

import { cn } from '@/lib/utils';
import type { VoiceStatus } from '@/types';
import { Mic, Loader2, Volume2 } from 'lucide-react';

interface VoiceOnlyViewProps {
  status: VoiceStatus;
  responseText: string;
}

export function VoiceOnlyView({ status, responseText }: VoiceOnlyViewProps) {
  const isActive = status !== 'idle' && status !== 'complete';

  return (
    <div className="flex flex-col items-center">
      {/* Voice Visualization */}
      <div
        className={cn(
          'relative w-40 h-40 rounded-full flex items-center justify-center',
          'bg-gradient-to-br from-slate-800 to-slate-900',
          'border-2 transition-all duration-300',
          isActive ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-slate-700'
        )}
      >
        {/* Center Icon */}
        <div className="relative z-10">
          {status === 'listening' ? (
            <Mic className="w-12 h-12 text-red-400" />
          ) : status === 'processing' || status === 'thinking' ? (
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
          ) : status === 'speaking' ? (
            <Volume2 className="w-12 h-12 text-green-400" />
          ) : (
            <Mic className="w-12 h-12 text-slate-400" />
          )}
        </div>

        {/* Animated Rings */}
        {status === 'listening' && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-red-500/50 animate-ping" />
            <div
              className="absolute inset-[-10px] rounded-full border border-red-500/30 animate-ping"
              style={{ animationDelay: '0.2s' }}
            />
          </>
        )}

        {status === 'speaking' && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-green-500/50 animate-pulse" />
            <div
              className="absolute inset-[-10px] rounded-full border border-green-500/30 animate-pulse"
              style={{ animationDelay: '0.2s' }}
            />
          </>
        )}

        {(status === 'processing' || status === 'thinking') && (
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/50 animate-pulse" />
        )}
      </div>

      {/* Status Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-400">
          {status === 'listening' && 'Listening...'}
          {status === 'processing' && 'Processing your voice...'}
          {status === 'thinking' && 'Alex is thinking...'}
          {status === 'speaking' && 'Alex is responding...'}
          {(status === 'idle' || status === 'complete') && 'Voice-Only Mode'}
        </p>
      </div>

      {/* Response Text */}
      {responseText && (status === 'speaking' || status === 'complete') && (
        <div className="mt-6 max-w-md text-center">
          <p className="text-slate-300 leading-relaxed">{responseText}</p>
        </div>
      )}

      {/* Audio Waveform Visualization (for speaking) */}
      {status === 'speaking' && (
        <div className="mt-4 flex items-center justify-center gap-1">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-green-500 rounded-full animate-pulse"
              style={{
                height: `${Math.sin(i * 0.5) * 15 + 20}px`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
