<script setup lang="ts">
const numericFormData = reactive({
  memberCount: 12,
  budget: 48.6,
  taxRate: 6.5,
  roi: 18.35,
})
</script>

<template>
  <div class="base-number-form-demo">
    <BaseCard title="在 BaseForm 中作为 widget 使用">
      <BaseForm
        :datasource="numericFormData"
        :immediate="false"
        :enabled-leave-check="false"
        :cols="{ xs: 1, md: 2 }"
        label-width="110px"
        width="100%"
      >
        <BaseFormItem
          label="成员人数"
          prop="memberCount"
          widget="number"
          :widget-props="{ min: 1, max: 200 }"
        />
        <BaseFormItem
          label="项目预算"
          prop="budget"
          widget="decimal"
          :widget-props="{ min: 0, precision: 2, step: 0.5 }"
        />
        <BaseFormItem
          label="税率（%）"
          prop="taxRate"
          widget="decimal"
          :widget-props="{ min: 0, max: 100, precision: 1 }"
        />
        <BaseFormItem
          label="ROI（%）"
          prop="roi"
          widget="number"
          :widget-props="{ min: 0, precision: 2, step: 0.05 }"
        />
      </BaseForm>
    </BaseCard>
  </div>
</template>
