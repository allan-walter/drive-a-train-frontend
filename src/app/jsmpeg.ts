declare global {
  namespace JSMpeg {
    interface PlayerOptions {
      canvas?: HTMLCanvasElement;
      loop?: boolean;
      autoplay?: boolean;
      audio?: boolean;
      video?: boolean;
      poster?: string;
      pauseWhenHidden?: boolean;
      disableGl?: boolean;
      disableWebAssembly?: boolean;
      preserveDrawingBuffer?: boolean;
      progressive?: boolean;
      throttled?: boolean;
      chunkSize?: number;
      maxAudioLag?: number;
      videoBufferSize?: number;
      audioBufferSize?: number;
      onVideoDecode?: (decoder: unknown, time: number) => void;
      onAudioDecode?: (decoder: unknown, time: number) => void;
      onPlay?: (player: Player) => void;
      onPause?: (player: Player) => void;
      onEnded?: (player: Player) => void;
      onStalled?: (player: Player) => void;
      onSourceEstablished?: (source: unknown) => void;
      onSourceCompleted?: (source: unknown) => void;
    }

    interface Player {
      play(): void;
      pause(): void;
      stop(): void;
      nextFrame(): HTMLCanvasElement | false;
      destroy(): void;
      startRecording(callback?: (player: Player) => void): void;
      stopRecording(): Blob;
      paused: boolean;
      volume: number;
      currentTime: number;
      duration: number;
      frameCount: number;
      framesDecoded: number;
    }

    interface VideoElementOptions extends PlayerOptions {
      poster?: string;
    }

    interface VideoElement {
      play(): void;
      pause(): void;
      stop(): void;
      destroy(): void;
      player: Player;
    }

    interface VideoElementConstructor {
      new (
        wrapper: string | Element,
        url: string,
        options?: VideoElementOptions,
        overlayOptions?: Record<string, unknown>,
      ): VideoElement;
    }

    interface PlayerConstructor {
      new (url: string, options?: PlayerOptions): Player;
    }

    const VideoElement: VideoElementConstructor;
    const Player: PlayerConstructor;
  }

  interface Window {
    JSMpeg: typeof JSMpeg;
  }
}

export {};
