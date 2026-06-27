"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import type {
  PlayFunction,
  SoundAsset,
  UseSoundOptions,
  UseSoundReturn,
} from "@/lib/sound-types"

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * Minimal soundcn-compatible hook: plays a SoundAsset's base64 dataUri via an
 * HTMLAudioElement. Conforms to the `[play, controls]` contract in sound-types.
 * ponytail: plain <audio>, no Web Audio pooling — swap in soundcn's canonical
 * hook if you need sprites/low-latency overlap.
 */
export function useSound(
  sound: SoundAsset,
  {
    volume = 1,
    playbackRate = 1,
    interrupt = false,
    soundEnabled = true,
    onPlay,
    onEnd,
    onPause,
    onStop,
  }: UseSoundOptions = {}
): UseSoundReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Build the audio element on the client only (SSR-safe).
  useEffect(() => {
    if (typeof Audio === "undefined") return
    const audio = new Audio(sound.dataUri)
    audio.preload = "auto"
    audioRef.current = audio

    const handleEnd = () => {
      setIsPlaying(false)
      onEnd?.()
    }
    audio.addEventListener("ended", handleEnd)
    return () => {
      audio.removeEventListener("ended", handleEnd)
      audio.pause()
      audioRef.current = null
    }
  }, [sound.dataUri, onEnd])

  const play = useCallback<PlayFunction>(
    (overrides) => {
      if (!soundEnabled) return
      const audio = audioRef.current
      if (!audio) return
      if (interrupt) {
        audio.pause()
        audio.currentTime = 0
      }
      audio.volume = clamp01(overrides?.volume ?? volume)
      audio.playbackRate = overrides?.playbackRate ?? playbackRate
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          onPlay?.()
        })
        .catch(() => {
          // Autoplay can be blocked until the first gesture — ignore.
        })
    },
    [soundEnabled, interrupt, volume, playbackRate, onPlay]
  )

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    onStop?.()
  }, [onStop])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    setIsPlaying(false)
    onPause?.()
  }, [onPause])

  return [play, { stop, pause, isPlaying, duration: sound.duration, sound }] as const
}
