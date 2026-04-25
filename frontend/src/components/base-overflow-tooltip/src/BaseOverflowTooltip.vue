/**
 * BaseOverflowTooltip
 * 仅在文本溢出时显示完整提示。
 * 说明: 文案来源统一使用默认插槽，避免与 `content` 重复传值。
 * 说明: 支持通过 `lineClamp` 开启指定行截断
 */
<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  placement?: string
  showAfter?: number
  effect?: 'dark' | 'light'
  disabled?: boolean
  tag?: string
  lineClamp?: number
}>(), {
  placement: 'top',
  showAfter: 300,
  effect: 'dark',
  disabled: false,
  tag: 'span',
  lineClamp: 0,
})

const attrs = useAttrs()
const textRef = ref<HTMLElement>()
const isOverflow = ref(false)
const tooltipContent = ref('')

let resizeObserver: ResizeObserver | null = null
let contentObserver: MutationObserver | null = null

function updateOverflow() {
  const el = textRef.value
  if (!el) {
    isOverflow.value = false
    tooltipContent.value = ''
    return
  }
  tooltipContent.value = (el.textContent || '').trim()
  isOverflow.value = el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight
}

const tooltipDisabled = computed(() => props.disabled || !tooltipContent.value || !isOverflow.value)
const normalizedLineClamp = computed(() => Number(props.lineClamp ?? 0))
const isLineClampEnabled = computed(() => Number.isFinite(normalizedLineClamp.value) && normalizedLineClamp.value > 0)
const triggerStyle = computed(() => {
  if (!isLineClampEnabled.value) {
    return undefined
  }
  if (normalizedLineClamp.value === 1) {
    return {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    } as Record<string, string>
  }
  return {
    'display': '-webkit-box',
    'overflow': 'hidden',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': `${normalizedLineClamp.value}`,
    'line-clamp': `${normalizedLineClamp.value}`,
  } as Record<string, string>
})
const triggerAttrs = computed(() => ({
  ...attrs,
  style: [attrs.style as any, triggerStyle.value],
}))

onMounted(() => {
  nextTick(updateOverflow)
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => updateOverflow())
    if (textRef.value) {
      resizeObserver.observe(textRef.value)
    }
  }
  if (typeof MutationObserver !== 'undefined' && textRef.value) {
    contentObserver = new MutationObserver(() => updateOverflow())
    contentObserver.observe(textRef.value, {
      childList: true,
      subtree: true,
      characterData: true,
    })
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  contentObserver?.disconnect()
  contentObserver = null
})

watch(() => props.lineClamp, () => {
  nextTick(updateOverflow)
})

defineExpose({
  updateOverflow,
})
</script>

<template>
  <ElTooltip
    :content="tooltipContent"
    :placement="placement"
    :show-after="showAfter"
    :effect="effect"
    :disabled="tooltipDisabled"
  >
    <component
      :is="tag"
      ref="textRef"
      v-bind="triggerAttrs"
      @mouseenter="updateOverflow"
    >
      <slot />
    </component>
  </ElTooltip>
</template>
