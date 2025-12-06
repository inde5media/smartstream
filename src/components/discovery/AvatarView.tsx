'use client';

import { cn } from '@/lib/utils';
import type { VoiceStatus } from '@/types';
import { User, Loader2 } from 'lucide-react';

interface AvatarViewProps {
  status: VoiceStatus;
  responseText: string;
}

export function AvatarView({ status, responseText }: AvatarViewProps) {
  const isActive = status !== 'idle' && status !== 'complete';

  return (
    <div className="flex flex-col items-center">
      {/* Avatar Container */}
      <div
        className={cn(
          'relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden',
          'bg-gradient-to-br from-slate-800 to-slate-900',
          'border-2 transition-all duration-300',
          isActive ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-slate-700'
        )}
      >
        {/* Placeholder Avatar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div
              className={cn(
                'w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center',
                'bg-gradient-to-br from-blue-500/20 to-purple-500/20',
                isActive && 'animate-pulse'
              )}
            >
              {status === 'thinking' || status === 'processing' ? (
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
              ) : (
                <User className="w-12 h-12 text-blue-400" />
              )}
            </div>
            <p className="text-lg font-medium text-white">Alex</p>
            <p className="text-sm text-slate-400">Your Discovery Guide</p>
          </div>
        </div>

        {/* Status Indicator */}
        {isActive && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-slate-900/90 backdrop-blur rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    status === 'listening' && 'bg-red-500 animate-pulse',
                    status === 'processing' && 'bg-yellow-500 animate-pulse',
                    status === 'thinking' && 'bg-blue-500 animate-pulse',
                    status === 'speaking' && 'bg-green-500 animate-pulse'
                  )}
                />
                <span className="text-xs text-slate-300 capitalize">
                  {status === 'listening' && 'Listening...'}
                  {status === 'processing' && 'Processing...'}
                  {status === 'thinking' && 'Thinking...'}
                  {status === 'speaking' && 'Speaking...'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Listening Animation */}
        {status === 'listening' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-red-500 rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Response Text (shown below avatar when speaking/complete) */}
      {responseText && (status === 'speaking' || status === 'complete') && (
        <div className="mt-6 max-w-md text-center">
          <p className="text-slate-300 leading-relaxed">{responseText}</p>
        </div>
      )}
    </div>
  );
}
