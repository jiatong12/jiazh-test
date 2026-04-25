<script setup lang="ts">
import axios from 'axios'
import { onMounted, reactive, ref } from 'vue'
import BaseCard from '@/components/base-card/src/BaseCard.vue'
import BaseDialog from '@/components/base-dialog/src/BaseDialog.vue'
import { HOME_URL } from '@/config'
import router from '@/router'
import { openExternal } from '@/utils/openExternal'
import { PasswordCrypto } from '@/utils/passwordCrypto'
import util from '@/utils/util'

// 响应式数据
const productData = ref({
  appCode: '',
  appName: '',
  appVersion: '',
  endDate: '',
  requestCode: '',
})

const licenseForm = reactive({
  license: '',
  password: '',
  verifyCode: '',
})

const attentionDialogVisible = ref(false)
const dataLoading = ref(true)
const submitLoading = ref(false)
const exportLoading = ref(false)
const authCodeURL = ref(`${axios.defaults.baseURL}/ui/authCode.png?t=${Date.now()}`)
const type = ref('')

// 表单验证规则
const formRules = {
  license: [
    { required: true, message: '请输入许可证码', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入管理员密码', trigger: 'blur' },
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
  ],
}

// 模板引用
const licenseFormRef = useTemplateRef('licenseFormRef')
const passwordRef = useTemplateRef('passwordRef')

// 页面初始化，从后端加载数据
async function init() {
  dataLoading.value = true
  axios.get('/ui/license').then((res) => {
    productData.value = res.data.data
  }).catch((e) => {
    ElMessageBox({
      title: '提示',
      type: 'error',
      message: e.message || '请求失败！',
    })
  }).finally(() => {
    dataLoading.value = false
  })
}

// 更新服务端的license
async function saveLicense() {
  licenseFormRef.value?.validate().then(() => {
    submitLoading.value = true
    const formData = {
      ...licenseForm,
      password: PasswordCrypto.encrypt(
        licenseForm.password,
        licenseForm.verifyCode,
        false,
        type.value,
      ),
    }

    axios.put('/ui/license', formData).then(() => {
      // 跳转到登录
      router.replace(HOME_URL)
    }).finally(() => {
      submitLoading.value = false
    })
  })
}

// 刷新验证码
function refreshAuthCode() {
  const url = authCodeURL.value.includes('?')
    ? authCodeURL.value.split('?')[0]
    : authCodeURL.value
  authCodeURL.value = `${url}?${new Date().getTime()}`
}

// 导出license
async function exportLicense() {
  if (licenseForm.password.trim() === '') {
    util.showMessage('请填写管理员密码', 'error')
    passwordRef.value?.focus()
    return
  }

  // 有可能注意事项Dialog是打开状态
  attentionDialogVisible.value = false

  exportLoading.value = true
  // 导出前检查管理员密码，如果正确则返回文件名
  axios.post('/ui/license/check_export', { password: licenseForm.password }).then((res) => {
    const resData = res.data
    if (resData.fileName) {
      openExternal(`./ui/license/download?fileName=${encodeURIComponent(resData.fileName)}`)
    }
  }).finally(() => {
    exportLoading.value = false
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="flex-column-layout page-wrap">
    <div class="page-title">
      更新产品许可证
    </div>

    <BaseCard class="card">
      <template #title>
        <div>
          产品信息
        </div>
      </template>
      <div v-loading="dataLoading" class="content">
        <ElRow>
          <ElCol :span="12" :xs="24">
            <span class="txt-label">产品代码：</span>
            <span class="txt-value">{{ productData.appCode }}</span>
          </ElCol>
          <ElCol :span="12" :xs="24">
            <span class="txt-label">产品名称：</span>
            <span class="txt-value">{{ productData.appName }}</span>
          </ElCol>
          <ElCol :span="12" :xs="24">
            <span class="txt-label">产品版本：</span>
            <span class="txt-value">{{ productData.appVersion }}</span>
          </ElCol>
          <ElCol :span="12" :xs="24">
            <span class="txt-label">有效期至：</span>
            <span class="txt-value">{{ productData.endDate }}</span>
          </ElCol>
        </ElRow>
      </div>
    </BaseCard>

    <BaseCard class="card">
      <template #title>
        <div>
          许可证信息
        </div>
      </template>
      <div v-loading="dataLoading" class="content">
        <ElForm ref="licenseFormRef" :model="licenseForm" :rules="formRules" label-width="140px">
          <ElFormItem label="许可证请求码：">
            <ElInput v-model="productData.requestCode" type="textarea" :disabled="true" />
          </ElFormItem>
          <ElFormItem prop="license" label="许可证码：">
            <ElInput v-model="licenseForm.license" type="textarea" :rows="8" />
          </ElFormItem>
          <ElFormItem prop="password" label="管理员密码：">
            <ElInput ref="passwordRef" v-model="licenseForm.password" type="password" />
          </ElFormItem>
          <ElFormItem prop="verifyCode" label="验证码：">
            <div class="el-input el-input-group el-input-group--prepend">
              <div class="el-input-group__prepend" title="验证码">
                <span class="prepend">
                  <img :src="authCodeURL" height="28" alt="验证码" @click="refreshAuthCode">
                </span>
              </div>
              <ElInput v-model="licenseForm.verifyCode" />
            </div>
          </ElFormItem>
          <ElFormItem label-width="0" style="text-align:center;">
            <ElButton type="primary" :loading="submitLoading" style="width:150px" @click="saveLicense">
              保存许可证
            </ElButton>
            <ElButton :loading="exportLoading" @click="exportLicense">
              导出许可证码
            </ElButton>
          </ElFormItem>
        </ElForm>
      </div>
    </BaseCard>

    <div style="text-align:center;">
      <BasePrimaryButton @click="attentionDialogVisible = true">
        注意事项
      </BasePrimaryButton>
    </div>

    <BaseDialog v-model="attentionDialogVisible" title="注意事项" width="500px">
      <ol class="attention-list">
        <li>许可证请求码申请适用于项目完结并且付完全款后，申请终身授权使用。通用授权不需要申请许可证请求码。</li>
        <li>系统运行环境的系统服务器前端动态应用服务器，均需要许可证授权码。申请前端动态应用服务器许可证的方式同系统服务器许可证申请方式，发送许可证请求码时请标明系统服务器与前端动态应用服务器。</li>
        <li>
          在更换新的许可证码前，请及时
          <ElButton type="text" style="padding:0;color:var(--el-color-primary)" @click="exportLicense">
            备份老的许可证码
          </ElButton>，以防止新的授权出现问题时，可以及时恢复，以免影响系统的再次启动。
        </li>
      </ol>
      <template #footer>
        <span class="dialog-footer">
          <ElButton @click="attentionDialogVisible = false">关 闭</ElButton>
        </span>
      </template>
    </BaseDialog>
  </div>
</template>

<style scoped>
.page-wrap {
  max-width: 1000px;
  padding: 10px;
  margin: 0 auto;
}

.page-title {
  color: var(--el-text-color-primary);
  font-size: 24px;
  font-weight: bold;
  line-height: 50px;
  text-align: center;
}

.txt-label {
  color: var(--el-text-color-secondary);
}
.txt-phone-number {
  display: block;
  font-size: 18px;
  color: var(--el-color-success);
  font-weight: bold;
}
.attention-list {
  padding-left: 20px;
}
.attention-list li {
  margin-bottom: 10px;
}
</style>
