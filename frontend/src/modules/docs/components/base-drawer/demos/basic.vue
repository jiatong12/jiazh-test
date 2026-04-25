<!-- 演示 BaseDrawer 适合承载分块表单和顶部工具区。 -->
<script setup lang="ts">
const visible = ref(false)
const formData = ref({
  projectName: '客户增长中台升级',
  owner: '张敏',
  department: '交付中心',
  status: 'Y',
  remark: '',
})

function openDrawer() {
  visible.value = true
}
</script>

<template>
  <div class="flex-column-layout">
    <ElAlert
      title="Drawer 更适合字段多、需要分块排版或宽内容区的场景；项目里通常把主要操作按钮放在顶部。"
      type="info"
      :closable="false"
    />

    <BaseButton type="primary" @click="openDrawer">
      打开抽屉
    </BaseButton>

    <BaseDrawer
      v-model="visible"
      title="字段较多时的抽屉写法"
      size="880px"
    >
      <div class="flex-column-layout">
        <div class="mb-4">
          <BaseButton @click="visible = false">
            取消
          </BaseButton>
          <BaseButton type="primary" @click="visible = false">
            保存
          </BaseButton>
        </div>

        <BaseForm
          :datasource="formData"
          :enabled-leave-check="false"
          :col="2"
          label-width="88px"
          width="100%"
        >
          <BaseFormItem label="项目名称" prop="projectName" widget="input" />
          <BaseFormItem label="负责人" prop="owner" widget="input" />
          <BaseFormItem label="所属部门" prop="department" widget="input" />
          <BaseFormItem label="当前状态" prop="status" widget="select" dict="demo1" />
          <BaseCol :col="1">
            <BaseFormItem
              label="备注"
              prop="remark"
              widget="textarea"
              :widget-props="{ rows: 4, placeholder: '这里演示的是“顶部操作区 + 大块表单主体”这种抽屉写法。' }"
            />
          </BaseCol>
        </BaseForm>
      </div>
    </BaseDrawer>
  </div>
</template>
