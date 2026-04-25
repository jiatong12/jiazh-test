import type { IPlayerOptions } from 'xgplayer'
import type Player from 'xgplayer'

export interface BaseVideoPlayerTimeupdatePayload {
  currentTime: number
  duration: number
  player: Player
}

export interface BaseVideoPlayerProps {
  url: string
  poster?: string
  width?: number | string
  height?: number | string
  fluid?: boolean
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  volume?: number
  playsinline?: boolean
  isLive?: boolean
  controls?: boolean
  lang?: string
  defaultPlaybackRate?: number
  playbackRates?: number[]
  options?: Partial<IPlayerOptions>
  className?: string
}

export interface BaseVideoPlayerExpose {
  play: () => Promise<void> | void
  pause: () => void
  replay: () => void
  recreate: () => Promise<void>
  destroy: () => void
  getPlayer: () => Player | null
}
