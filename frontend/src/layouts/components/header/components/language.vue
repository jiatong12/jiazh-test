<script setup lang="ts">
import type { LanguageType } from '@/store/modules/global'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/store/modules/global'

const i18n = useI18n()
const globalStore = useGlobalStore()
const language = computed(() => globalStore.language)

const languageList = [
  { label: '简体中文', value: 'zh' },
  { label: 'English', value: 'en' },
]

function changeLanguage(lang: string) {
  i18n.locale.value = lang
  globalStore.language = lang as LanguageType
}
</script>

<template>
  <ElDropdown trigger="click" @command="changeLanguage">
    <BaseIcon name="i-lucide:languages" class="iconfont" />
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="item in languageList"
          :key="item.value"
          :command="item.value"
          :disabled="language === item.value"
        >
          {{ item.label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
