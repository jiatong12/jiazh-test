<script setup lang="ts">
import type { IPlayerOptions } from 'xgplayer'
import type { BaseVideoPlayerExpose, BaseVideoPlayerProps, BaseVideoPlayerTimeupdatePayload } from './types'
import XGPlayer from 'xgplayer'
import 'xgplayer/dist/index.min.css'

defineOptions({
  name: 'BaseVideoPlayer',
})

const props = withDefaults(defineProps<BaseVideoPlayerProps>(), {
  poster: '',
  width: '100%',
  height: 360,
  fluid: false,
  autoplay: false,
  loop: false,
  muted: false,
  volume: 0.6,
  playsinline: true,
  isLive: false,
  controls: true,
  lang: 'zh-cn',
  defaultPlaybackRate: 1,
  playbackRates: () => [0.5, 1, 1.25, 1.5, 2],
  options: () => ({}),
  className: '',
})

const emit = defineEmits<{
  (e: 'ready', player: InstanceType<typeof XGPlayer>): void
  (e: 'play', player: InstanceType<typeof XGPlayer>): void
  (e: 'pause', player: InstanceType<typeof XGPlayer>): void
  (e: 'ended', player: InstanceType<typeof XGPlayer>): void
  (e: 'error', player: InstanceType<typeof XGPlayer>, error: unknown): void
  (e: 'timeupdate', payload: BaseVideoPlayerTimeupdatePayload): void
}>()

const playerMountRef = ref<HTMLDivElement | null>(null)
const playerRef = shallowRef<InstanceType<typeof XGPlayer> | null>(null)

function clampVolume(value: number) {
  if (Number.isNaN(value)) { return 0.6 }
  return Math.min(1, Math.max(0, value))
}

function buildPlayerOptions(mountEl: HTMLElement): IPlayerOptions {
  const customVideoAttributes = props.options.videoAttributes || {}

  return {
    ...props.options,
    el: mountEl,
    url: props.url,
    poster: props.poster || undefined,
    width: props.width,
    height: props.height,
    fluid: props.fluid,
    autoplay: props.autoplay,
    autoplayMuted: props.autoplay && props.muted,
    loop: props.loop,
    playsinline: props.playsinline,
    isLive: props.isLive,
    controls: props.controls,
    lang: props.lang,
    defaultPlaybackRate: props.defaultPlaybackRate,
    playbackRate: props.playbackRates,
    volume: clampVolume(props.volume),
    videoInit: true,
    videoAttributes: {
      'playsinline': props.playsinline,
      'webkit-playsinline': props.playsinline ? 'true' : undefined,
      'x5-playsinline': props.playsinline ? 'true' : undefined,
      'x5-video-player-type': 'h5-page',
      ...customVideoAttributes,
    },
  }
}

function bindPlayerEvents(player: InstanceType<typeof XGPlayer>) {
  player.on('ready', () => {
    emit('ready', player)
  })

  player.on('play', () => {
    emit('play', player)
  })

  player.on('pause', () => {
    emit('pause', player)
  })

  player.on('ended', () => {
    emit('ended', player)
  })

  player.on('error', (error: unknown) => {
    emit('error', player, error)
  })

  player.on('timeupdate', () => {
    emit('timeupdate', {
      currentTime: Number(player.currentTime) || 0,
      duration: Number(player.duration) || 0,
      player,
    })
  })
}

function syncRuntimeState() {
  if (!playerRef.value) { return }
  playerRef.value.muted = props.muted
  playerRef.value.volume = clampVolume(props.volume)
  playerRef.value.loop = props.loop
  playerRef.value.autoplay = props.autoplay
  playerRef.value.playbackRate = props.defaultPlaybackRate
}

function destroyPlayer() {
  playerRef.value?.destroy()
  playerRef.value = null
  if (playerMountRef.value) {
    playerMountRef.value.innerHTML = ''
  }
}

function createPlayer() {
  const mountEl = playerMountRef.value
  if (!mountEl || !props.url) {
    destroyPlayer()
    return
  }

  destroyPlayer()
  const player = new XGPlayer(buildPlayerOptions(mountEl))
  playerRef.value = player
  bindPlayerEvents(player)
  syncRuntimeState()
}

async function recreate() {
  await nextTick()
  createPlayer()
}

function play() {
  return playerRef.value?.play()
}

function pause() {
  playerRef.value?.pause()
}

function replay() {
  playerRef.value?.replay()
}

defineExpose<BaseVideoPlayerExpose>({
  play,
  pause,
  replay,
  recreate,
  destroy: destroyPlayer,
  getPlayer: () => playerRef.value,
})

watch(() => props.url, () => {
  recreate()
})

watch(() => props.poster, () => {
  recreate()
})

watch(() => props.width, () => {
  recreate()
})

watch(() => props.height, () => {
  recreate()
})

watch(() => props.fluid, () => {
  recreate()
})

watch(() => props.playsinline, () => {
  recreate()
})

watch(() => props.isLive, () => {
  recreate()
})

watch(() => props.controls, () => {
  recreate()
})

watch(() => props.lang, () => {
  recreate()
})

watch(() => props.defaultPlaybackRate, () => {
  syncRuntimeState()
})

watch(() => props.playbackRates, () => {
  recreate()
}, { deep: true })

watch(() => props.options, () => {
  recreate()
}, { deep: true })

watch(() => props.volume, () => {
  syncRuntimeState()
})

watch(() => props.muted, () => {
  syncRuntimeState()
})

watch(() => props.loop, () => {
  syncRuntimeState()
})

watch(() => props.autoplay, () => {
  syncRuntimeState()
})

onMounted(() => {
  createPlayer()
})

onBeforeUnmount(() => {
  destroyPlayer()
})
</script>

<template>
  <div class="base-video-player" :class="props.className">
    <div v-if="props.url" ref="playerMountRef" class="base-video-player__host" />
    <div v-else class="base-video-player__empty">
      <ElEmpty description="请传入视频地址" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-video-player {
  width: 100%;

  &__host {
    min-height: 240px;

    :deep(.xgplayer) {
      overflow: hidden;
      border: 1px solid var(--el-border-color-light);
      border-radius: 12px;
      background: var(--el-fill-color-dark);
    }
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 240px;
    border: 1px dashed var(--el-border-color);
    border-radius: 12px;
    background: var(--el-fill-color-lighter);
  }
}
</style>
