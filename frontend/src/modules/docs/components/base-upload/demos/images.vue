<script setup lang="ts">
import { uploadImageApi } from './data'

const singleCover = ref('/branding/logo.svg')
const singleAvatar = ref('')
const imageList = ref<string[]>(['/branding/login-illustration.svg'])
</script>

<template>
  <div class="base-upload-images-demo">
    <BaseRow :cols="{ xs: 1, md: 3 }">
      <BaseCard title="BaseUploadImage" h-full>
        <BaseUploadImage v-model="singleCover" :api="uploadImageApi">
          <template #tip>
            默认方形，适合封面图和展示图。
          </template>
        </BaseUploadImage>
      </BaseCard>

      <BaseCard title="头像上传" h-full>
        <BaseUploadImage
          v-model="singleAvatar"
          :drag="false"
          border-radius="50%"
          :api="uploadImageApi"
        >
          <template #empty>
            <ElIcon><BaseIcon name="i-ep:avatar" /></ElIcon>
            <span>请上传头像</span>
          </template>
          <template #tip>
            圆形头像，禁止拖拽。
          </template>
        </BaseUploadImage>
      </BaseCard>

      <BaseCard title="BaseUploadImages" h-full>
        <BaseUploadImages
          v-model="imageList"
          :limit="3"
          width="180px"
          :api="uploadImageApi"
        >
          <template #tip>
            最多上传 3 张图片。
          </template>
        </BaseUploadImages>
      </BaseCard>
    </BaseRow>
  </div>
</template>
