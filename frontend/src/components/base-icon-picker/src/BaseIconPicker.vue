<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type {
  IconPickerGroup,
  IconPickerNormalizedGroup,
  IconPickerNormalizedItem,
} from './types'
import { formContextKey, formItemContextKey } from 'element-plus'
import { defEmitProp, defProp } from '@/components/utils'
import { getDefaultIconPickerGroups } from './defaultGroups'

const props = defineProps({
  modelValue: defProp([String], ''),
  groups: defProp<IconPickerGroup[]>(() => getDefaultIconPickerGroups()),
  placeholder: defProp([String], '请选择图标'),
  searchPlaceholder: defProp([String], '搜索图标名称或标签'),
  emptyText: defProp([String], '暂无匹配图标'),
  searchable: defProp([Boolean], true),
  clearable: defProp([Boolean], true),
  disabled: defProp([Boolean], false),
  readonly: defProp([Boolean], false),
  enableIconColor: defProp([Boolean], true),
  closeOnSelect: defProp([Boolean], true),
  popoverWidth: defProp([Number], 520),
  maxHeight: defProp([Number], 360),
  showGroupIndex: defProp([Boolean], true),
  onChange: defEmitProp<[value: string, item: IconPickerNormalizedItem | undefined]>(),
  onSyncColor: defEmitProp<[color: string, item: IconPickerNormalizedItem | undefined]>(),
})

const emits = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string, item: IconPickerNormalizedItem | undefined]
}>()

const popoverVisible = ref(false)
const searchKeyword = ref('')
const activeGroupKey = ref('')

const scrollbarRef = ref<{ wrapRef?: HTMLElement }>()
const groupRefMap = new Map<string, HTMLElement>()

const formContext = inject(formContextKey, void 0)
const formItemContext = inject(formItemContextKey, void 0)

const mergedDisabled = computed(() => props.disabled || !!formContext?.disabled)
const canOpen = computed(() => !mergedDisabled.value && !props.readonly)

const normalizedGroups = computed<IconPickerNormalizedGroup[]>(() => {
  return props.groups.map((group, groupIndex) => {
    const groupKey = group.key !== void 0 ? String(group.key) : `${groupIndex}`
    const groupColor = group.color ?? ''

    const icons = group.icons
      .map((icon, iconIndex): IconPickerNormalizedItem | null => {
        if (typeof icon === 'string') {
          return {
            key: `${groupKey}-${icon}-${iconIndex}`,
            name: icon,
            label: icon,
            color: groupColor,
            groupKey,
            groupTitle: group.title,
          }
        }

        if (!icon.name) {
          return null
        }

        return {
          key: `${groupKey}-${icon.name}-${iconIndex}`,
          name: icon.name,
          label: icon.label || icon.name,
          color: icon.color || groupColor,
          groupKey,
          groupTitle: group.title,
        }
      })
      .filter((item): item is IconPickerNormalizedItem => !!item)

    return {
      key: groupKey,
      title: group.title,
      color: groupColor,
      icons,
    }
  }).filter(group => group.icons.length > 0)
})

const selectedIconItem = computed<IconPickerNormalizedItem | undefined>(() => {
  if (!props.modelValue) {
    return void 0
  }

  return normalizedGroups.value
    .flatMap(group => group.icons)
    .find(item => item.name === props.modelValue)
})

const filteredGroups = computed<IconPickerNormalizedGroup[]>(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) {
    return normalizedGroups.value
  }

  return normalizedGroups.value
    .map((group) => {
      const matchGroup = group.title.toLowerCase().includes(keyword)
      const icons = matchGroup
        ? group.icons
        : group.icons.filter((icon) => {
            return icon.name.toLowerCase().includes(keyword)
              || icon.label.toLowerCase().includes(keyword)
          })

      return {
        ...group,
        icons,
      }
    })
    .filter(group => group.icons.length > 0)
})

const showGroupIndexBar = computed(() => {
  return props.showGroupIndex && filteredGroups.value.length > 1
})

function resolveItemColor(item: IconPickerNormalizedItem | undefined) {
  if (!props.enableIconColor) {
    return ''
  }
  return item?.color || ''
}

watch(filteredGroups, (groups) => {
  if (!groups.length) {
    activeGroupKey.value = ''
    return
  }

  const hasCurrent = groups.some(group => group.key === activeGroupKey.value)
  if (!hasCurrent) {
    activeGroupKey.value = groups[0]?.key || ''
  }
}, { immediate: true })

// 颜色同步口径: 始终与当前 modelValue 对应的图标颜色保持一致。
watch(
  [selectedIconItem, () => props.enableIconColor],
  ([item]) => {
    props.onSyncColor?.(resolveItemColor(item), item)
  },
  { immediate: true },
)

function setGroupRef(groupKey: string, el: Element | ComponentPublicInstance | null) {
  if (el instanceof HTMLElement) {
    groupRefMap.set(groupKey, el)
    return
  }
  groupRefMap.delete(groupKey)
}

async function jumpToGroup(groupKey: string) {
  activeGroupKey.value = groupKey

  await nextTick()
  const wrapRef = scrollbarRef.value?.wrapRef
  const groupRef = groupRefMap.get(groupKey)
  if (!wrapRef || !groupRef) {
    return
  }

  const targetTop = Math.max(groupRef.offsetTop - 4, 0)
  wrapRef.scrollTo({
    top: targetTop,
    behavior: 'smooth',
  })
}

function handleScrollbarScroll(payload: { scrollTop: number }) {
  const groups = filteredGroups.value
  if (!groups.length) {
    activeGroupKey.value = ''
    return
  }

  const currentTop = payload.scrollTop + 8
  let currentGroupKey = groups[0]?.key || ''

  for (const group of groups) {
    const groupRef = groupRefMap.get(group.key)
    if (!groupRef) {
      continue
    }
    if (groupRef.offsetTop <= currentTop) {
      currentGroupKey = group.key
      continue
    }
    break
  }

  activeGroupKey.value = currentGroupKey
}

function updateValue(value: string, item: IconPickerNormalizedItem | undefined) {
  emits('update:modelValue', value)
  emits('change', value, item)
  props.onChange?.(value, item)
  if (formItemContext?.prop) {
    formContext?.validateField([formItemContext.prop as string])
  }
}

function handleSelectIcon(item: IconPickerNormalizedItem) {
  if (!canOpen.value) {
    return
  }

  updateValue(item.name, item)
  if (props.closeOnSelect) {
    popoverVisible.value = false
  }
}

function handleClear() {
  if (!props.clearable || !canOpen.value || !props.modelValue) {
    return
  }
  updateValue('', void 0)
}
</script>

<template>
  <ElPopover
    v-model:visible="popoverVisible"
    :width="props.popoverWidth"
    trigger="click"
    placement="bottom-start"
    :disabled="!canOpen"
  >
    <template #reference>
      <div
        class="base-icon-picker__trigger"
        :class="{
          'is-disabled': mergedDisabled,
          'is-readonly': props.readonly,
          'is-active': popoverVisible,
        }"
      >
        <div class="base-icon-picker__trigger-icon">
          <BaseIcon
            :name="props.modelValue || 'i-mdi:shape-outline'"
            :style="{ color: (props.enableIconColor ? selectedIconItem?.color : '') || '' }"
          />
        </div>
        <div class="base-icon-picker__trigger-text">
          {{ props.modelValue || props.placeholder }}
        </div>
        <div class="base-icon-picker__trigger-actions">
          <BaseIcon
            v-if="props.clearable && props.modelValue && canOpen"
            name="i-ep:circle-close"
            class="base-icon-picker__clear-icon"
            @click.stop="handleClear"
          />
          <BaseIcon name="i-ep:arrow-down" />
        </div>
      </div>
    </template>

    <div class="base-icon-picker__panel">
      <ElInput
        v-if="props.searchable"
        v-model="searchKeyword"
        clearable
        :placeholder="props.searchPlaceholder"
        class="base-icon-picker__search"
      >
        <template #prefix>
          <BaseIcon name="i-ep:search" />
        </template>
      </ElInput>

      <div class="base-icon-picker__content">
        <ElScrollbar ref="scrollbarRef" :max-height="props.maxHeight" class="base-icon-picker__scrollbar" @scroll="handleScrollbarScroll">
          <template v-if="filteredGroups.length">
            <div
              v-for="group in filteredGroups"
              :key="group.key"
              :ref="(el) => setGroupRef(group.key, el)"
              class="base-icon-picker__group"
            >
              <div class="base-icon-picker__group-header">
                <span
                  class="base-icon-picker__group-dot"
                  :style="{ backgroundColor: group.color || 'var(--el-border-color)' }"
                />
                <span>{{ group.title }}</span>
                <span class="base-icon-picker__group-count">{{ group.icons.length }}</span>
              </div>

              <div class="base-icon-picker__icon-grid">
                <button
                  v-for="icon in group.icons"
                  :key="icon.key"
                  type="button"
                  class="base-icon-picker__icon-item"
                  :class="{ 'is-active': icon.name === props.modelValue }"
                  @click="handleSelectIcon(icon)"
                >
                  <BaseIcon :name="icon.name" class="base-icon-picker__icon" :style="{ color: props.enableIconColor ? (icon.color || '') : '' }" />
                  <span class="base-icon-picker__icon-label">{{ icon.label }}</span>
                </button>
              </div>
            </div>
          </template>
          <ElEmpty v-else :description="props.emptyText" :image-size="90" />
        </ElScrollbar>

        <div v-if="showGroupIndexBar" class="base-icon-picker__group-index">
          <button
            v-for="group in filteredGroups"
            :key="`index-${group.key}`"
            type="button"
            class="base-icon-picker__group-index-item"
            :class="{ 'is-active': group.key === activeGroupKey }"
            :title="group.title"
            @click="jumpToGroup(group.key)"
          >
            {{ group.title }}
          </button>
        </div>
      </div>
    </div>
  </ElPopover>
</template>

<style scoped lang="scss">
.base-icon-picker__trigger {
  display: flex;
  align-items: center;
  min-height: var(--el-component-size);
  padding: 4px 10px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  transition:
    border-color var(--el-transition-duration),
    box-shadow var(--el-transition-duration);

  &:hover {
    border-color: var(--el-border-color-hover);
  }

  &.is-active {
    border-color: var(--el-color-primary);
    box-shadow: 0 0 0 1px var(--el-color-primary-light-7);
  }

  &.is-disabled,
  &.is-readonly {
    color: var(--el-text-color-placeholder);
    cursor: not-allowed;
    background: var(--el-fill-color-light);
  }
}

.base-icon-picker__trigger-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 8px;
  font-size: 16px;
}

.base-icon-picker__trigger-text {
  flex: 1;
  overflow: hidden;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.base-icon-picker__trigger-actions {
  display: inline-flex;
  align-items: center;
  margin-left: 10px;
  gap: 6px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.base-icon-picker__clear-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  cursor: pointer;

  &:hover {
    color: var(--el-color-danger);
  }
}

.base-icon-picker__panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.base-icon-picker__search {
  margin-bottom: 2px;
}

.base-icon-picker__content {
  display: flex;
  gap: 8px;
  min-width: 0;
}

.base-icon-picker__scrollbar {
  flex: 1;
  min-width: 0;

  :deep(.el-scrollbar__view) {
    box-sizing: border-box;
    padding-right: 10px;
  }
}

.base-icon-picker__group + .base-icon-picker__group {
  margin-top: 14px;
}

.base-icon-picker__group-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.base-icon-picker__group-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.base-icon-picker__group-count {
  margin-left: auto;
  color: var(--el-text-color-placeholder);
}

.base-icon-picker__icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.base-icon-picker__icon-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 46px;
  padding: 4px 8px;
  text-align: left;
  cursor: pointer;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color-dark, var(--el-border-color));
  border-radius: var(--el-border-radius-base);
  transition:
    border-color var(--el-transition-duration),
    box-shadow var(--el-transition-duration),
    background-color var(--el-transition-duration),
    color var(--el-transition-duration);

  &:hover {
    border-color: var(--el-color-primary);
    box-shadow:
      inset 0 0 0 1px var(--el-color-primary),
      0 0 0 1px var(--el-color-primary-light-5);
  }

  &.is-active {
    border-color: var(--el-color-primary);
    box-shadow:
      inset 0 0 0 1px var(--el-color-primary),
      0 0 0 1px var(--el-color-primary-light-5);
  }
}

.base-icon-picker__icon {
  font-size: 30px;
  transition:
    transform var(--el-transition-duration),
    color var(--el-transition-duration);
}

.base-icon-picker__icon-item:hover .base-icon-picker__icon {
  transform: scale(1.12);
}

.base-icon-picker__icon-item.is-active .base-icon-picker__icon {
  transform: scale(1.06);
}

.base-icon-picker__icon-label {
  flex: 1;
  overflow: hidden;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.base-icon-picker__group-index {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.base-icon-picker__group-index-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 68px;
  height: 26px;
  padding: 0 10px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  background: var(--el-fill-color-light);
  border: 1px solid transparent;
  border-radius: 4px;
  transition: all var(--el-transition-duration);

  &:hover {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary-light-5);
    background: var(--el-color-primary-light-9);
  }

  &.is-active {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary-light-5);
    background: var(--el-color-primary-light-8);
  }
}
</style>
