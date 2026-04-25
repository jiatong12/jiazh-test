<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import axios from 'axios'
import dayjs from 'dayjs'
import { ElMessageBox } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { $$auths } from '@/auths'
import util from '@/utils/util'

interface SmsConfigItem {
  /** 配置项编码。 */
  name: string
  /** 配置项值。 */
  value: any
  /** 配置项显示名称。 */
  memo?: string
  /** 是否必填。 */
  verify?: boolean
  /** 控件类型。 */
  type?: string
  /** 提示说明。 */
  tips?: string
}

interface SmsUserLoginType {
  /** 登录方式编码。 */
  code: string
  /** 登录方式名称。 */
  name: string
}

const props = withDefaults(defineProps<{
  activeName?: string
  requestAction?: {
    get: { url: string, priv?: string }
    save: { url: string, priv?: string }
    enable: { url: string, priv?: string }
    disable: { url: string, priv?: string }
  }
  openTips?: string
  defaultTips?: string
}>(), {
  activeName: 'UI',
  requestAction: () => ({
    get: {
      url: '/ui/sms/config',
    },
    save: {
      url: '/ui/sms/config',
      priv: 'Platform.AccountSecurity.Save',
    },
    enable: {
      url: '/ui/sms/open',
      priv: 'Platform.AccountSecurity.SMSEnable',
    },
    disable: {
      url: '/ui/sms/close',
      priv: 'Platform.AccountSecurity.SMSEnable',
    },
  }),
  openTips: '开启后，可配置对应的发送短信的具体配置项，配置后启用短信验证服务。',
  defaultTips: '您还未开启【登录验证模板】，',
})

const router = useRouter()
const formRef = ref<FormInstance>()
const confirmLoading = ref(false)
const dataLoading = ref(false)
const hasLoadData = ref(false)
const isUsable = ref(false)
const hasTwoFactorAuth = ref(false)
const oldSmsOpen = ref(false)

const saveData = reactive({
  smsConfigData: [] as SmsConfigItem[],
  smsPlatConfigData: [] as any[],
  ptValue: '',
  validateValue: '',
  smsOpen: 'N',
})

const lockData = reactive({
  flag: false,
  tips: '',
})

const dialogFormData = reactive({
  open: false,
  title: '',
  tips: '',
  show: false,
  value: 0,
  minCount: 1,
  maxCount: 1,
})

const allUserLoginTypes = ref<SmsUserLoginType[]>([])
const userLoginTypes = ref<SmsUserLoginType[]>([])
const currentUserLoginTypes = ref<SmsUserLoginType[]>([])

const yesOrNoOptions = [
  { value: 'Y', name: '是' },
  { value: 'N', name: '否' },
]

const loginTypeConfig = computed(() => saveData.smsConfigData.find(item => item.name === 'loginTypeSetting'))
const twoFactorAuthConfig = computed(() => saveData.smsConfigData.find(item => item.name === 'openTwoFactorAuth'))
const smsRuleConfigs = computed(() => {
  return saveData.smsConfigData.filter(item => item.name !== 'loginTypeSetting' && item.name !== 'openTwoFactorAuth')
})

const smsSettingRoutePath = computed(() => {
  const candidate = router
    .getRoutes()
    .map(route => route.path)
    .find((path) => {
      return path.startsWith('/platform/')
        && path !== '/platform/security'
        && /sms/i.test(path)
    })

  if (!candidate) {
    return ''
  }

  return candidate.replace(/:from(\([^)]*\))?/, 'userSms')
})

/** 判断旧短信接口返回是否为业务成功。 */
function isBizSuccess(responseData: any) {
  return Number(responseData?.status) === 1
}

/** 提取请求失败信息，避免页面出现“点击无反应”。 */
function resolveRequestErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallbackMessage
}

/** 兼容旧短信接口的 message 字段，统一生成提示内容。 */
function resolveBizMessage(responseData: any, fallbackMessage: string) {
  const message = String(responseData?.message || '').replace(/\d\. (Error|Warning): /g, '')
  return message || fallbackMessage
}

/** 按旧页面逻辑展示短信接口返回结果。 */
function showSmsResponseMessage(responseData: any, fallbackMessage: string) {
  if (isBizSuccess(responseData)) {
    util.showResponseMessage(responseData)
    return
  }

  util.showMessage(resolveBizMessage(responseData, fallbackMessage), 'error')
}

/** 统一格式化短信服务禁用截止时间。 */
function formatLockEndTime(timestamp: number, lockHours: number) {
  return dayjs(timestamp + lockHours * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss')
}

/** 根据双重认证状态同步当前允许的登录方式。 */
function syncCurrentUserLoginTypes(enabledTwoFactorAuth: boolean) {
  currentUserLoginTypes.value = enabledTwoFactorAuth ? userLoginTypes.value : allUserLoginTypes.value
}

/** 把后端的登录方式字符串初始化成页面可直接编辑的数组。 */
function initLoginTypeSetting(configData: SmsConfigItem[]) {
  const enabledTwoFactorAuth = configData.find(item => item.name === 'openTwoFactorAuth')?.value === 'Y'
  configData.forEach((item) => {
    if (item.name !== 'loginTypeSetting') {
      return
    }

    const valueList = Array.isArray(item.value)
      ? item.value
      : String(item.value || '')
          .split(',')
          .filter(Boolean)

    item.value = enabledTwoFactorAuth
      ? valueList.filter(code => code !== 'UserSMSLogin')
      : valueList
  })
}

/** 提交前把数组结构回写成后端要求的逗号分隔字符串。 */
function buildSubmitSmsData() {
  const payload = JSON.parse(JSON.stringify(saveData))
  payload.smsConfigData.forEach((item: SmsConfigItem) => {
    if (item.name === 'loginTypeSetting') {
      item.value = Array.isArray(item.value) ? item.value.join(',') : item.value || ''
    }
  })
  return payload
}

/** 根据配置项名称定位表单字段路径，保证动态表单校验命中真实数据。 */
function getSmsConfigProp(itemName?: string) {
  if (!itemName) {
    return ''
  }

  const configIndex = saveData.smsConfigData.findIndex(item => item.name === itemName)
  return configIndex > -1 ? `smsConfigData.${configIndex}.value` : ''
}

/** 统一执行保存前校验，校验失败时给出明确反馈。 */
async function validateSaveForm() {
  if (!formRef.value) {
    return true
  }

  try {
    await formRef.value.validate()
    return true
  }
  catch {
    util.showMessage('请先完善短信配置中的必填项', 'warning')
    return false
  }
}

/** 加载系统支持的登录方式列表。 */
async function loadUserTypes() {
  try {
    const response = await axios.get('/ui/sms/user/types', { useBizStatus: true })
    if (!isBizSuccess(response.data)) {
      allUserLoginTypes.value = []
      userLoginTypes.value = []
      currentUserLoginTypes.value = []
      return
    }

    const userTypes = Array.isArray(response.data?.data) ? response.data.data : []
    allUserLoginTypes.value = userTypes
    userLoginTypes.value = userTypes.filter((item: SmsUserLoginType) => item.code !== 'UserSMSLogin')
    currentUserLoginTypes.value = [...allUserLoginTypes.value]
  }
  catch {
    allUserLoginTypes.value = []
    userLoginTypes.value = []
    currentUserLoginTypes.value = []
  }
}

/** 加载短信服务锁定信息，用于页面展示启用和禁用状态。 */
async function loadLockInfo() {
  try {
    const response = await axios.get('/ui/sms/lockInfo', {
      params: { validateType: props.activeName },
      useBizStatus: true,
    })
    if (!isBizSuccess(response.data)) {
      lockData.flag = false
      lockData.tips = ''
      return
    }

    const lockInfo = response.data?.data

    if (!lockInfo) {
      lockData.flag = false
      lockData.tips = ''
      return
    }

    lockData.flag = true
    lockData.tips = `短信服务已被禁用，禁用时间至：${formatLockEndTime(lockInfo[0], lockInfo[1])}`
  }
  catch {
    lockData.flag = false
    lockData.tips = ''
  }
}

/** 加载短信配置，并同步初始化登录方式和双重认证状态。 */
async function initConfig(validateType: string) {
  const response = await axios.get(props.requestAction.get.url, {
    params: { validateType },
    useBizStatus: true,
  })
  if (!isBizSuccess(response.data)) {
    util.showMessage(resolveBizMessage(response.data, '短信配置加载失败'), 'error')
    return
  }

  const configData = Array.isArray(response.data?.ruleData) ? response.data.ruleData : []

  saveData.smsConfigData = configData
  saveData.smsPlatConfigData = response.data?.ptData || []
  saveData.ptValue = response.data?.ptValue || ''
  saveData.validateValue = response.data?.validateValue || ''
  saveData.smsOpen = response.data?.smsOpen || 'N'

  isUsable.value = !!response.data?.isUsable
  oldSmsOpen.value = saveData.smsOpen === 'Y'
  hasTwoFactorAuth.value = configData.some(item => item.name === 'openTwoFactorAuth')

  initLoginTypeSetting(configData)
  syncCurrentUserLoginTypes(twoFactorAuthConfig.value?.value === 'Y')
}

/** 保存短信和登录认证配置。 */
async function handleSave() {
  const isFormValid = await validateSaveForm()
  if (!isFormValid) {
    return
  }

  try {
    await ElMessageBox.confirm('确认修改短信配置？', '确认修改', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  }
  catch {
    return
  }

  try {
    const payload = Object.assign(buildSubmitSmsData(), {
      validateType: props.activeName,
      validateValue: props.activeName,
    })
    const response = await axios.put(props.requestAction.save.url, payload, { useBizStatus: true })
    showSmsResponseMessage(response.data, '短信配置保存失败')

    if (isBizSuccess(response.data)) {
      oldSmsOpen.value = payload.smsOpen === 'Y'
    }
  }
  catch (error) {
    util.showMessage(resolveRequestErrorMessage(error, '短信配置保存失败'), 'error')
  }
}

/** 打开启用或禁用短信服务弹窗。 */
function openDialog(open: boolean) {
  dialogFormData.open = open
  dialogFormData.title = open ? '请输入下次提醒时可用短信数' : '请输入要停止服务的时长（时）'
  dialogFormData.tips = open
    ? '短信服务将被启用，并设置额外的可用短信数（仅当天有效）'
    : '短信服务将被禁用'
  dialogFormData.value = open ? 1000 : 1
  dialogFormData.minCount = 1
  dialogFormData.maxCount = open ? 2147483647 : 24
  dialogFormData.show = true
}

/** 重置启用禁用弹窗状态，避免串用上一次的数据。 */
function resetDialogState() {
  dialogFormData.open = false
  dialogFormData.title = ''
  dialogFormData.tips = ''
  dialogFormData.show = false
  dialogFormData.value = 0
  dialogFormData.minCount = 1
  dialogFormData.maxCount = 1
}

/** 执行短信服务启用或禁用操作，并刷新锁定信息。 */
async function confirmClickHandler() {
  try {
    confirmLoading.value = true
    await ElMessageBox.confirm(`确认${dialogFormData.tips}？`, '确认操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const response = await axios.put(
      dialogFormData.open ? props.requestAction.enable.url : props.requestAction.disable.url,
      {
        validateType: props.activeName,
        data: dialogFormData.value,
      },
      { useBizStatus: true },
    )

    showSmsResponseMessage(response.data, dialogFormData.open ? '短信服务启用失败' : '短信服务禁用失败')
    if (isBizSuccess(response.data)) {
      resetDialogState()
      await loadLockInfo()
    }
  }
  catch (error) {
    util.showMessage(resolveRequestErrorMessage(error, '短信服务状态更新失败'), 'error')
  }
  finally {
    confirmLoading.value = false
  }
}

/** 跳转到短信配置页；如果当前项目还没接路由，则给出明确提示。 */
function goSmsSetting() {
  if (!smsSettingRoutePath.value) {
    util.showMessage('当前项目未接入短信配置页面，请先补充短信模块路由。', 'warning')
    return
  }

  router.push(smsSettingRoutePath.value)
}

/** 处理双重认证开关，确保短信登录和双重认证互斥。 */
async function handleTwoFactorAuthChange(value: string) {
  if (value !== 'Y') {
    syncCurrentUserLoginTypes(false)
    return
  }

  syncCurrentUserLoginTypes(true)
  try {
    await ElMessageBox.confirm('开启双重认证后，短信登录将失效。是否确认继续？', '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    saveData.smsConfigData.forEach((item) => {
      if (item.name === 'loginTypeSetting') {
        const loginTypeSetting = Array.isArray(item.value)
          ? item.value
          : String(item.value || '')
              .split(',')
              .filter(Boolean)
        item.value = loginTypeSetting.filter(code => code !== 'UserSMSLogin')
      }
    })
  }
  catch {
    if (twoFactorAuthConfig.value) {
      twoFactorAuthConfig.value.value = 'N'
    }
    syncCurrentUserLoginTypes(false)
  }
}

/** 按场景重新初始化短信配置。 */
async function initPageData(activeName: string) {
  if (!activeName || activeName === '0') {
    return
  }

  dataLoading.value = true
  try {
    await loadUserTypes()
    await initConfig(activeName)
    await loadLockInfo()
  }
  finally {
    dataLoading.value = false
    hasLoadData.value = true
  }
}

watch(
  () => props.activeName,
  (activeName) => {
    initPageData(activeName)
  },
  { immediate: true },
)
</script>

<template>
  <div v-show="hasLoadData" v-loading="dataLoading">
    <div class="sms-setting-toolbar">
      <BaseButton
        type="primary"
        :icon="$$renderIcon('i-lucide:save')"
        :priv="props.requestAction.save.priv"
        @click="handleSave"
      >
        保存
      </BaseButton>
      <BaseButton
        v-show="lockData.flag && oldSmsOpen && isUsable"
        :priv="props.requestAction.enable.priv"
        @click="openDialog(true)"
      >
        启用
      </BaseButton>
      <BaseButton
        v-show="!lockData.flag && oldSmsOpen && isUsable"
        :priv="props.requestAction.disable.priv"
        @click="openDialog(false)"
      >
        禁用
      </BaseButton>
      <span class="sms-setting-toolbar__tip">{{ lockData.tips }}</span>
    </div>

    <ElForm
      ref="formRef"
      :model="saveData"
      label-position="top"
      class="sms-setting-form"
      @submit.prevent
    >
      <div v-show="!isUsable" class="sms-panel">
        <ElFormItem>
          <span class="sms-panel__warn">{{ props.defaultTips }}</span>
          <span class="sms-panel__warn">可能无法正常使用短信服务。</span>
          <template v-if="smsSettingRoutePath && $$auths.hasPriv('Platform.SMSSetting.TemplateSave')">
            <ElButton type="primary" link @click="goSmsSetting">
              前往短信配置
            </ElButton>
          </template>
          <span v-else class="sms-panel__warn">请先在系统中补齐短信模板和短信平台配置。</span>
        </ElFormItem>
      </div>

      <div v-show="isUsable" class="sms-panel">
        <ElFormItem label="开启短信服务">
          <ElSwitch
            v-model="saveData.smsOpen"
            active-text="开启"
            inactive-text="关闭"
            active-value="Y"
            inactive-value="N"
          />
          <ElTooltip :content="props.openTips" placement="right-start">
            <i class="fa fa-lightbulb-o fa-lg sms-panel__icon" />
          </ElTooltip>
        </ElFormItem>
      </div>

      <div v-show="isUsable && saveData.smsOpen === 'Y'" class="sms-panel">
        <h4 class="sms-panel__title">
          登录认证配置
        </h4>
        <p class="sms-panel__desc">
          保留原有短信验证规则，同时额外控制登录方式和双重认证。
        </p>

        <ElFormItem
          v-if="loginTypeConfig"
          :label="loginTypeConfig.memo"
          :prop="getSmsConfigProp(loginTypeConfig.name)"
          :rules="{
            required: loginTypeConfig.verify,
            message: `${loginTypeConfig.memo}：不能为空`,
            trigger: 'change',
          }"
        >
          <ElSelect v-model="loginTypeConfig.value" placeholder="请选择登录方式" clearable multiple>
            <ElOption
              v-for="type in currentUserLoginTypes"
              :key="type.code"
              :label="type.name"
              :value="type.code"
            />
          </ElSelect>
          <ElTooltip v-if="loginTypeConfig.tips" :content="loginTypeConfig.tips" placement="right-start">
            <i class="fa fa-lightbulb-o fa-lg sms-panel__icon" />
          </ElTooltip>
        </ElFormItem>

        <ElFormItem
          v-if="hasTwoFactorAuth && twoFactorAuthConfig"
          :label="twoFactorAuthConfig.memo"
          :prop="getSmsConfigProp(twoFactorAuthConfig.name)"
          :rules="{
            required: twoFactorAuthConfig.verify,
            message: `${twoFactorAuthConfig.memo}：不能为空`,
            trigger: 'change',
          }"
        >
          <ElSwitch
            v-model="twoFactorAuthConfig.value"
            active-text="开启"
            inactive-text="关闭"
            active-value="Y"
            inactive-value="N"
            @change="handleTwoFactorAuthChange(twoFactorAuthConfig.value)"
          />
          <ElTooltip v-if="twoFactorAuthConfig.tips" :content="twoFactorAuthConfig.tips" placement="right-start">
            <i class="fa fa-lightbulb-o fa-lg sms-panel__icon" />
          </ElTooltip>
        </ElFormItem>
      </div>

      <div v-show="isUsable && saveData.smsOpen === 'Y'" class="sms-panel">
        <h4 class="sms-panel__title">
          短信规则设置
        </h4>

        <template v-for="config in smsRuleConfigs" :key="config.name">
          <ElFormItem
            v-if="config.type === 'select'"
            :prop="getSmsConfigProp(config.name)"
            :label="config.memo"
            :rules="{
              required: config.verify,
              message: `${config.memo}：不能为空`,
              trigger: 'change',
            }"
          >
            <ElSelect v-model="config.value" clearable>
              <ElOption
                v-for="option in yesOrNoOptions"
                :key="option.value"
                :label="option.name"
                :value="option.value"
              />
            </ElSelect>
            <ElTooltip v-if="config.tips" :content="config.tips" placement="right-start">
              <i class="fa fa-lightbulb-o fa-lg sms-panel__icon" />
            </ElTooltip>
          </ElFormItem>

          <ElFormItem
            v-else-if="config.type === 'radio'"
            :prop="getSmsConfigProp(config.name)"
            :label="config.memo"
            :rules="{
              required: config.verify,
              message: `${config.memo}：不能为空`,
              trigger: 'change',
            }"
          >
            <ElRadioGroup v-model="config.value">
              <ElRadio
                v-for="option in yesOrNoOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.name }}
              </ElRadio>
            </ElRadioGroup>
            <ElTooltip v-if="config.tips" :content="config.tips" placement="right-start">
              <i class="fa fa-lightbulb-o fa-lg sms-panel__icon" />
            </ElTooltip>
          </ElFormItem>

          <ElFormItem
            v-else-if="config.type === 'number'"
            :prop="getSmsConfigProp(config.name)"
            :label="config.memo"
            :rules="[
              {
                required: config.verify,
                message: `${config.memo}：不能为空`,
                trigger: 'blur',
              },
              {
                pattern: /^(-1|[1-9][0-9]*)$/,
                message: `${config.memo}：必须为 -1 或正整数`,
                trigger: 'blur',
              },
            ]"
          >
            <ElInput v-model="config.value" />
            <ElTooltip v-if="config.tips" :content="config.tips" placement="right-start">
              <i class="fa fa-lightbulb-o fa-lg sms-panel__icon" />
            </ElTooltip>
          </ElFormItem>

          <ElFormItem
            v-else
            :prop="getSmsConfigProp(config.name)"
            :label="config.memo"
            :rules="{
              required: config.verify,
              message: `${config.memo}：不能为空`,
              trigger: 'blur',
            }"
          >
            <ElInput v-model="config.value" />
            <ElTooltip v-if="config.tips" :content="config.tips" placement="right-start">
              <i class="fa fa-lightbulb-o fa-lg sms-panel__icon" />
            </ElTooltip>
          </ElFormItem>
        </template>
      </div>
    </ElForm>

    <ElDialog v-model="dialogFormData.show" :title="dialogFormData.title" width="600px">
      <ElForm label-position="top" @submit.prevent>
        <ElFormItem :label="`${dialogFormData.title}：`">
          <ElInputNumber
            v-model="dialogFormData.value"
            :min="dialogFormData.minCount"
            :max="dialogFormData.maxCount"
            style="width: 80%"
          />
          <ElTooltip :content="dialogFormData.tips" placement="right-start">
            <i class="fa fa-lightbulb-o fa-lg sms-panel__icon" />
          </ElTooltip>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <BaseButton @click="dialogFormData.show = false">
          取消
        </BaseButton>
        <BaseButton type="primary" :loading="confirmLoading" @click="confirmClickHandler">
          确定
        </BaseButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.sms-setting-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.sms-setting-toolbar__tip {
  color: #d897dc;
}

.sms-setting-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sms-panel {
  padding: 20px 40px;
  border-radius: 10px;
  background-color: var(--el-bg-color);
  box-shadow: 0 1px 1px rgb(99 99 99 / 5%);
}

.sms-panel__title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.sms-panel__desc {
  margin: 0 0 18px;
  line-height: 1.6;
  color: var(--el-text-color-secondary);
}

.sms-panel__warn {
  color: #b38796;
}

.sms-panel__icon {
  margin-left: 6px;
  color: #ffc125;
}

.sms-setting-form :deep(.el-select) {
  width: 320px;
}

.sms-setting-form :deep(.el-input) {
  width: 320px;
}
</style>
