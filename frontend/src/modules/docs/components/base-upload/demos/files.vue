<script setup lang="ts">
import { uploadFileApi } from './data'

const attachmentList = ref([
  {
    id: '1',
    name: '演示文档.pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
])
</script>

<template>
  <div class="base-upload-files-demo">
    <BaseCard title="BaseUploadFiles">
      <BaseUploadFiles
        v-model="attachmentList"
        tip="支持 jpg/png/mp4/doc/docx/pdf，单个文件限制 50M。"
        :api="uploadFileApi"
        :file-type="['.jpg', '.png', '.mp4', '.doc', '.docx', '.pdf']"
        :file-size="50"
        :limit="3"
      />
    </BaseCard>
  </div>
</template>
