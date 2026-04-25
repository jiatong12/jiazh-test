<script setup lang="ts">
import axios from 'axios'
import { onBeforeMount, onBeforeUnmount, reactive, ref } from 'vue'
import { HOME_URL } from '@/config'
import router from '@/router'
import { useAuthStore } from '@/store/modules/auth'

// 初始化数据
const step1FormData: any = reactive({
  dbType: '',
  driverReady: false,
  driverEditAble: false,
  importData: true,
  JDBCURL: '',
  JNDIName: 'jdbc/zcms',
  autoCreate: true,
  hasData: true,
  isJNDIPool: false,
  isJDBCURL: false,
  isLatin1Charset: false,
  time: new Date().getTime(),
  serverType: 'DerbyEmbedded',
})

const step2FormData: any = reactive({
  address: '',
  port: '3306',
  DBName: '',
  userName: '',
  password: '',
})

// 表单验证规则
function checkJNDI(_rule: any, value: string, callback: (error?: Error) => void) {
  if (step1FormData.isJNDIPool && value.trim().length === 0) {
    return callback(new Error('不能为空'))
  }
  else {
    callback()
  }
}

function checkJDBCURL(_rule: any, value: string, callback: (error?: Error) => void) {
  if (step1FormData.isJDBCURL && value.trim().length === 0) {
    return callback(new Error('不能为空'))
  }
  else {
    callback()
  }
}

function checkAddressAndPort(_rule: any, value: string, callback: (error?: Error) => void) {
  if (!step1FormData.isJDBCURL && step1FormData.serverType !== 'DerbyEmbedded' && (`${value}`).trim().length === 0) {
    return callback(new Error('不能为空'))
  }
  else {
    callback()
  }
}

function notNull(_rule: any, value: string, callback: (error?: Error) => void) {
  if (!value || (`${value}`).trim().length === 0) {
    return callback(new Error('不能为空'))
  }
  else {
    callback()
  }
}

const step1FormRules = {
  serverType: [{
    required: true,
    validator: notNull,
    trigger: 'blur,change',
  }],
  JNDIName: [{
    required: true,
    validator: checkJNDI,
    trigger: 'blur,change',
  }],
  JDBCURL: [{
    required: true,
    validator: checkJDBCURL,
    trigger: 'blur,change',
  }],
}

const step2FormRules = {
  address: [{
    required: true,
    validator: checkAddressAndPort,
    trigger: 'blur,change',
  }],
  port: [{
    required: true,
    validator: checkAddressAndPort,
    trigger: 'blur,change',
  }],
  DBName: [{
    required: true,
    validator: checkAddressAndPort,
    trigger: 'blur,change',
  }],
  userName: [{
    required: true,
    validator: notNull,
    trigger: 'blur,change',
  }],
  password: [{
    required: true,
    validator: notNull,
    trigger: 'blur,change',
  }],
}

// 其他响应式数据
const containShow = ref(true)
const appCode = ref('ZCMS')
const dbTypes = ref<string[]>([])
const dbInfoMap = ref<Record<string, any>>({})
const activeTab = ref('step1')
const step3Title = ref('正在进行初始化！')
const progressTxt = ref('正在初始化ZCArticle')
const installBtn = ref('开始初始化')
const cancelBtn = ref('取消安装')
const taskID = ref(0) // 任务ID
const progressPercent = ref(0) // 进度百分比
const stopTask = ref(false) // 是否已经停止任务
const progressPollTimer = ref<number | null>(null)
const stopInstallTimer = ref<number | null>(null)

// 响应式引用
const step1Form = useTemplateRef('step1Form')
const step2Form = useTemplateRef('step2Form')

// 方法定义
function downloadSQL(type: string) {
  window.location.href = `./ui/install/sql?type=${type}`
}

function onDbTypeChange(val: string) {
  step1FormData.dbType = val
  step1FormData.driverEditAble = false
  step2FormData.port = dbInfoMap.value[val].defaultPort
  step1FormData.driverClass = dbInfoMap.value[val].driverClass
  step1FormData.driverReady = dbInfoMap.value[val].driverReady
  if (!step1FormData.driverReady) {
    step1FormData.isJDBCURL = true
    step1FormData.driverMessage = '未找到驱动类，请确认是否添加了对应的jdbc驱动包文件，如果设置其他驱动类请在下方设置填写驱动类名！'
  }
  else {
    step1FormData.isJDBCURL = false
    step1FormData.driverMessage = null
  }
  if (val === 'MYSQL' && !step1FormData.charset) {
    step1FormData.charset = 'utf8'
  }
}

function onJNDIPoolClick(val) {
  if (val) {
    if (step1FormData.isJDBCURL === true) {
      step1FormData.isJDBCURL = false
    }
  }
}

function onJDBCURLClick(val) {
  if (val) {
    if (step1FormData.isJNDIPool === true) {
      step1FormData.isJNDIPool = false
    }
  }
}

function onDriverClassChange(val: string) {
  if (val !== dbInfoMap.value[step1FormData.dbType].driverClass) {
    checkDriverClass()
  }
  else {
    step1FormData.driverReady = true
    step1FormData.driverMessage = null
    step1FormData.time = new Date().getTime()
  }
}

function checkDriverClass() {
  step1FormData.driverReady = false
  clearTimeout((checkDriverClass as any).running)
  ;(checkDriverClass as any).running = setTimeout(async () => {
    try {
      const res = await axios.get(`ui/dbtype/driverCheck/${step1FormData.driverClass}`)
      if (res.data && res.data.status === 1) {
        step1FormData.driverReady = true
        step1FormData.driverMessage = null
      }
      else {
        step1FormData.driverReady = false
        step1FormData.driverMessage = res.data.message
      }
      step1FormData.time = new Date().getTime()
    }
    catch (error) {
      console.error('Driver check failed:', error)
    }
  }, 600)
}

function enableDriverClassEdit() {
  step1FormData.driverEditAble = true
}

function nextStep() {
  step1Form.value?.validate()
    .then(() => {
      activeTab.value = 'step2'
    })
}

function lastStep() {
  activeTab.value = 'step1'
}

// 安装完成后主动刷新安装状态缓存，避免继续沿用“未安装”的旧值。
async function refreshSystemInstallationStatus() {
  await useAuthStore().checkSystemInstallationStatus(false)
}

function clearProgressPollTimer() {
  if (progressPollTimer.value !== null) {
    window.clearTimeout(progressPollTimer.value)
    progressPollTimer.value = null
  }
}

function clearStopInstallTimer() {
  if (stopInstallTimer.value !== null) {
    window.clearTimeout(stopInstallTimer.value)
    stopInstallTimer.value = null
  }
}

function scheduleProgressPoll() {
  clearProgressPollTimer()
  // 防回归：改用串行轮询，避免 async setInterval 导致多个进度请求重叠。
  progressPollTimer.value = window.setTimeout(() => {
    void pollInstallProgress()
  }, 1000)
}

function scheduleStopInstallPoll() {
  clearStopInstallTimer()
  // 停止安装同样保持串行请求，避免重复提交停止指令。
  stopInstallTimer.value = window.setTimeout(() => {
    void pollStopInstall()
  }, 1000)
}

async function pollInstallProgress() {
  if (!taskID.value || stopTask.value) {
    clearProgressPollTimer()
    return
  }

  try {
    const progress = await axios.get(`/ui/framework/longtimetasks/${taskID.value}`)
    if (stopTask.value) {
      clearProgressPollTimer()
      return
    }
    if (progress.data.data.errorFlag) {
      clearProgressPollTimer()
      let info = `总计${progress.data.data.errors.length}个错误:<br>`

      progress.data.data.errors.forEach((name: string, index: number) => {
        info += `${index + 1}. ${name}<br>`
      })
      ElMessageBox.alert(info.toString(), '提示', {
        type: 'error',
        dangerouslyUseHTMLString: true,
      })
      return
    }
    if (progress.data.data.completeFlag) {
      progressPercent.value = 100
      activeTab.value = 'step4'
      await refreshSystemInstallationStatus()
      clearProgressPollTimer()
      return
    }

    progressPercent.value = progress.data.data.percent
    progressTxt.value = progress.data.data.currentInfo || progressTxt.value
    scheduleProgressPoll()
  }
  catch (error) {
    console.error('Get progress failed:', error)
    if (!stopTask.value) {
      scheduleProgressPoll()
    }
  }
}

async function pollStopInstall() {
  try {
    const res = await axios.put('/ui/framework/longtimetasks/stoped', {
      taskID: taskID.value,
    })
    if (res.data.status === 1) {
      cancelBtn.value = '任务己取消'
      clearStopInstallTimer()
      return
    }
  }
  catch (error) {
    console.error('Stop task failed:', error)
  }

  scheduleStopInstallPoll()
}

// 数据库初始化
async function install(step1: boolean) {
  try {
    step1
      ? await step1Form.value?.validate()
      : await step2Form.value?.validate()
  }
  catch {
    return
  }
  installBtn.value = '请稍等......'
  let res = {} as any
  try {
    res = await axios.post(
      '/ui/install/execute',
      { ...step1FormData, ...step2FormData },
      { useBizStatus: true, showDefaultError: false },
    ).then(r => r.data)
  }
  catch {
    installBtn.value = '开始初始化'
    return
  }
  if (res.status !== 1) {
    installBtn.value = '开始初始化'
    ElMessage.error(res.message || '初始化任务创建失败')
    return
  }
  activeTab.value = 'step3'
  progressPercent.value = 0
  step3Title.value = '正在进行初始化！'
  progressTxt.value = '开始还原数据库'
  cancelBtn.value = '取消安装'
  taskID.value = Number(res.taskID ?? res.data?.taskID ?? 0)
  stopTask.value = false
  clearStopInstallTimer()
  clearProgressPollTimer()
  if (taskID.value) {
    scheduleProgressPoll()
  }
  else {
    activeTab.value = 'step4'
    await refreshSystemInstallationStatus()
  }
}

async function stopInstall() {
  if (cancelBtn.value === '任务己取消') {
    return
  }
  step3Title.value = '正在取消应用安装操作，请稍后---'
  cancelBtn.value = '正在取消任务...'
  stopTask.value = true
  clearProgressPollTimer()
  clearStopInstallTimer()
  void pollStopInstall()
}

async function getAppInfo() {
  try {
    const res = await axios.get('ui/application/info')
    if (res.data && res.data.status === 1 && res.data.data && res.data.data.appCode) {
      appCode.value = res.data.data.appCode
    }
  }
  catch (error) {
    console.error('Get app info failed:', error)
  }
}

/**
 * 跳转到首页并刷新
 */
function redirectToHomeWithRefresh() {
  router.replace(HOME_URL).then(() => {
    // 重新加载，避免缓存了安装页面
    window.location.reload()
  })
}

// 在组件挂载前执行的逻辑
onBeforeMount(async () => {
  // 获取应用信息
  await getAppInfo()

  try {
    const res = await axios.get('/ui/install/init')
    if (res.data.data.lowMemory) {
      ElMessageBox.alert('特别提示：当前JVM最大内存数较小，建议调整-Xmx参数到256M以上,以避免出现运行一段时间后内存溢出并停止响应的状况', '提示', {
        type: 'warning',
      })
    }
    if (res.data.data.notInstall) {
      containShow.value = true
    }
    else {
      containShow.value = false
      window.setTimeout(() => {
        redirectToHomeWithRefresh()
      }, 3000)
      // 已确认系统已安装时直接结束，避免继续拉取安装页依赖数据。
      return
    }

    const dbTypesRes = await axios.get('/ui/dbtype')
    if (dbTypesRes.data.status === 1) {
      dbTypes.value = dbTypesRes.data.data.dbTypes
      dbInfoMap.value = dbTypesRes.data.data.infoMap
      if (dbTypes.value.includes('MYSQL')) {
        onDbTypeChange('MYSQL')
      }
      else {
        onDbTypeChange(dbTypes.value[0]!)
      }
    }
    else {
      ElMessageBox.alert('数据库类型获取失败！请刷新当前页面', '提示', { type: 'error' })
    }
  }
  catch (error) {
    console.error('Initialization failed:', error)
  }
})

onBeforeUnmount(() => {
  clearProgressPollTimer()
  clearStopInstallTimer()
})
</script>

<template>
  <div class="install-page">
    <div v-if="containShow" class="install-container">
      <BaseTabs :model-value="activeTab" tab-position="left" class="install-tabs" :lazy="true">
        <!-- 步骤1：数据库配置 -->
        <BaseTabPane label="数据库配置" name="step1">
          <div v-if="activeTab === 'step1'" class="step">
            <div class="stepTitle" style="text-align: left;">
              配置数据库初始化参数，
              <br>数据库初始化完成后将自动建立全文检索并发布全站。
            </div>
            <div class="stepContent">
              <ElForm
                ref="step1Form" :model="step1FormData" :rules="step1FormRules" label-width="120px"
                label-position="left"
              >
                <ElFormItem label="数据库类型" prop="dbType">
                  <div>
                    <div>
                      <ElSelect
                        v-model="step1FormData.dbType" placeholder="请选择数据库类型" style="width:200px;margin-right: 30px;"
                        @change="onDbTypeChange"
                      >
                        <ElOption v-for="item in dbTypes" :key="item" :label="dbInfoMap[item].dbTypeName" :value="item" />
                      </ElSelect>
                      <ElRadioGroup v-model="step1FormData.importData">
                        <ElRadio :value="true">
                          初始化数据库
                        </ElRadio>
                        <ElRadio :value="false">
                          仅配置连接
                        </ElRadio>
                      </ElRadioGroup>
                    </div>
                    <div v-if="step1FormData.dbType === 'DB2'" class="inputDesc inputDesc--danger">
                      <span class="tipTxt">
                        <BaseIcon name="i-mdi:alert-circle-outline" class="tipTxt__icon" />
                        <span class="tipTxt__content">
                          DB2 下默认表空间页大小要求大于等于 16K，否则不能正确创建表结构。
                        </span>
                      </span>
                    </div>
                    <div class="inputDesc">
                      <span class="tipTxt">
                        <BaseIcon name="i-mdi:information-outline" class="tipTxt__icon" />
                        <span class="tipTxt__content">初始化数据库：会初始化所有表中的数据</span>
                      </span>
                    </div>
                    <div class="inputDesc">
                      <span class="tipTxt">
                        <BaseIcon name="i-mdi:information-outline" class="tipTxt__icon" />
                        <span class="tipTxt__content">仅配置连接：则会保留数据库中原有数据</span>
                      </span>
                    </div>
                  </div>
                </ElFormItem>
                <ElFormItem label="JDBC驱动类" prop="driverClass" :time="step1FormData.time">
                  <div>
                    <div v-if="step1FormData.driverMessage" class="inputDesc inputDesc--danger">
                      <span class="tipTxt">
                        <BaseIcon name="i-mdi:alert-circle-outline" class="tipTxt__icon" />
                        <span class="tipTxt__content">{{ step1FormData.driverMessage }}</span>
                      </span>
                    </div>
                    <div>
                      <ElInput
                        v-model="step1FormData.driverClass" autosize
                        :disabled="!((!step1FormData.driverReady) || step1FormData.driverEditAble)"
                        placeholder="jdbc驱动类" @change="onDriverClassChange"
                      >
                        <template #append>
                          <ElButton type="danger" @click="enableDriverClassEdit">
                            修改
                          </ElButton>
                        </template>
                      </ElInput>
                    </div>
                  </div>
                </ElFormItem>
                <ElFormItem label="表结构及数据">
                  <div>
                    <div>
                      <ElCheckbox v-model="step1FormData.autoCreate" :disabled="!step1FormData.importData">
                        自动创建数据库表结构
                      </ElCheckbox>
                      <ElCheckbox
                        v-model="step1FormData.hasData"
                        :disabled="!step1FormData.importData || !step1FormData.autoCreate"
                      >
                        导入内置数据
                      </ElCheckbox>
                    </div>
                    <div class="inputDesc">
                      <span class="tipTxt">
                        <BaseIcon name="i-mdi:information-outline" class="tipTxt__icon" />
                        <span class="tipTxt__content">
                          会自动创建表结构，如果数据库中原来就有同名的表，则会先删除同名表
                        </span>
                      </span>
                    </div>
                    <div v-if="step1FormData.importData && !step1FormData.autoCreate">
                      <p>
                        请下载对应数据库的SQL文件并手动执行。
                      </p>
                      <p>
                        <template v-for="(item, index) in dbTypes" :key="index">
                          <span v-if="index > 0">，</span>
                          <a href="javascript:void(0);" @click="downloadSQL(item)">
                            <strong>{{ dbInfoMap[item].dbTypeName }}</strong>
                          </a>
                        </template>
                      </p>
                    </div>
                  </div>
                </ElFormItem>
                <ElFormItem v-if="step1FormData.dbType === 'MYSQL'" label="字符编码" prop="charset">
                  <div>
                    <ElInput v-model="step1FormData.charset" />
                    <div class="inputDesc">
                      <span class="tipTxt">
                        <BaseIcon name="i-mdi:information-outline" class="tipTxt__icon" />
                        <span class="tipTxt__content">数据库表使用的字符编码</span>
                      </span>
                    </div>
                  </div>
                </ElFormItem>
                <ElFormItem label="连接池" prop="JNDIName">
                  <div>
                    <ElCheckbox v-model="step1FormData.isJNDIPool" @change="onJNDIPoolClick">
                      使用JNDI连接池
                    </ElCheckbox>
                    <div class="inputDesc">
                      <span class="tipTxt">
                        <BaseIcon name="i-mdi:information-outline" class="tipTxt__icon" />
                        <span class="tipTxt__content">使用 JNDI 连接池：会从中间件获取数据连接</span>
                      </span>
                    </div>
                    <div v-if="step1FormData.isJNDIPool" class="inputDesc">
                      <i>JNDI名称：</i>
                      <ElInput v-model="step1FormData.JNDIName" />
                      <span class="tipTxt">
                        <BaseIcon name="i-mdi:information-outline" class="tipTxt__icon" />
                        <span class="tipTxt__content">
                          请注意 JNDI 名称是否有前缀 &quot;<strong>jdbc/</strong>&quot;
                        </span>
                      </span>
                    </div>
                  </div>
                </ElFormItem>
                <ElFormItem label="JDBCURL" prop="JDBCURL">
                  <div>
                    <div>
                      <ElCheckbox v-model="step1FormData.isJDBCURL" @change="onJDBCURLClick">
                        使用JDBCURL
                      </ElCheckbox>
                    </div>
                    <div class="inputDesc">
                      <span class="tipTxt">
                        <BaseIcon name="i-mdi:information-outline" class="tipTxt__icon" />
                        <span class="tipTxt__content">使用 JDBCURL</span>
                      </span>
                    </div>
                    <div v-if="step1FormData.isJDBCURL" class="inputDesc">
                      <ElInput
                        v-model="step1FormData.JDBCURL" type="textarea" autosize
                        placeholder="数据库JDBCURL地址"
                      />
                    </div>
                  </div>
                </ElFormItem>
                <ElFormItem v-if="step1FormData.dbType === 'ORACLE'" label="Oracle附加选项">
                  <div>
                    <ElCheckbox v-model="step1FormData.isLatin1Charset">
                      数据字符集为US7ASCII
                    </ElCheckbox>
                    <div class="inputDesc">
                      <span class="tipTxt">
                        <BaseIcon name="i-mdi:information-outline" class="tipTxt__icon" />
                        <span class="tipTxt__content">
                          如果 Oracle 字符集为 US7ASCII，则必须勾选此选项，否则可能会出现乱码。
                        </span>
                      </span>
                    </div>
                  </div>
                </ElFormItem>
                <ElFormItem label=" ">
                  <BasePrimaryButton
                    v-if="!step1FormData.isJNDIPool"
                    :disabled="!(step1FormData.dbType && step1FormData.driverReady)"
                    @click="nextStep"
                  >
                    下一步 &gt;
                  </BasePrimaryButton>
                  <BasePrimaryButton v-else @click="install(true)">
                    开始初始化
                  </BasePrimaryButton>
                </ElFormItem>
              </ElForm>
            </div>
          </div>
        </BaseTabPane>

        <!-- 步骤2：初始化 -->
        <BaseTabPane label="初始化" name="step2">
          <div v-if="activeTab === 'step2'" class="step ">
            <div class="stepTitle" style="text-align: left;">
              配置数据库初始化参数，
              <br>数据库初始化完成后将自动建立全文检索并发布全站。
            </div>
            <div class="stepContent">
              <ElForm
                ref="step2Form" :model="step2FormData" :rules="step2FormRules" label-width="120px"
                label-position="left"
              >
                <ElFormItem
                  v-show="!step1FormData.isJDBCURL && step1FormData.dbType !== 'DerbyEmbedded'" label="服务器地址"
                  prop="address"
                >
                  <div>
                    <ElInput v-model="step2FormData.address" />
                    <div class="inputDesc">
                      <span class="tipTxt">
                        <BaseIcon name="i-mdi:information-outline" class="tipTxt__icon" />
                        <span class="tipTxt__content">数据库服务器域名或 IP 地址</span>
                      </span>
                    </div>
                  </div>
                </ElFormItem>
                <ElFormItem
                  v-show="!step1FormData.isJDBCURL && step1FormData.dbType !== 'DerbyEmbedded'" label="服务器端口"
                  prop="port"
                >
                  <div>
                    <ElInput v-model="step2FormData.port" />
                    <div class="inputDesc">
                      <span class="tipTxt">
                        <BaseIcon name="i-mdi:information-outline" class="tipTxt__icon" />
                        <span class="tipTxt__content">访问数据库使用的端口</span>
                      </span>
                    </div>
                  </div>
                </ElFormItem>
                <ElFormItem
                  v-show="step1FormData.dbType !== 'DerbyEmbedded'" label="数据库名称"
                  prop="DBName"
                >
                  <div>
                    <ElInput v-model="step2FormData.DBName" />
                    <div class="inputDesc">
                      <span class="tipTxt">
                        <BaseIcon name="i-mdi:information-outline" class="tipTxt__icon" />
                        <span class="tipTxt__content">
                          Oracle 下此处填实例名；MySQL 和 SQLServer 下若数据库不存在，则会自动创建数据库。
                        </span>
                      </span>
                    </div>
                  </div>
                </ElFormItem>
                <ElFormItem label="用户名" prop="userName">
                  <div>
                    <ElInput v-model="step2FormData.userName" />
                    <div class="inputDesc">
                      <span class="tipTxt">
                        <BaseIcon name="i-mdi:information-outline" class="tipTxt__icon" />
                        <span class="tipTxt__content">访问数据库使用的用户名</span>
                      </span>
                    </div>
                  </div>
                </ElFormItem>
                <ElFormItem label="密码" prop="password">
                  <div>
                    <ElInput v-model="step2FormData.password" type="password" />
                    <div class="inputDesc">
                      <span class="tipTxt">
                        <BaseIcon name="i-mdi:information-outline" class="tipTxt__icon" />
                        <span class="tipTxt__content">访问数据库使用的密码</span>
                      </span>
                    </div>
                  </div>
                </ElFormItem>
                <ElFormItem label=" ">
                  <BasePrimaryButton @click="lastStep">
                    返回上一步
                  </BasePrimaryButton>
                  <BasePrimaryButton @click="install(false)">
                    {{ installBtn }}
                  </BasePrimaryButton>
                </ElFormItem>
              </ElForm>
            </div>
          </div>
        </BaseTabPane>

        <!-- 步骤3：安装进度 -->
        <BaseTabPane label="安装进度" name="step3">
          <div v-if="activeTab === 'step3'" class="step">
            <div class="stepTitle">
              <div class="gear">
                <img src="./_images/animatedGear.svg" style="width: 100px; height: 100px;">
              </div>
              <span>{{ step3Title }}</span>
            </div>
            <div class="stepContent">
              <div class="progressWrap">
                <div class="progressTxt">
                  {{ progressTxt }}
                </div>
                <br>
                <ElProgress :text-inside="true" :stroke-width="24" :percentage="progressPercent" status="success" />
                <br>
              </div>
              <div class="optBtn">
                <BasePrimaryButton @click="stopInstall">
                  {{ cancelBtn }}
                </BasePrimaryButton>
              </div>
            </div>
          </div>
        </BaseTabPane>

        <!-- 步骤4：完成 -->
        <BaseTabPane label="安装完成" name="step4">
          <div v-if="activeTab === 'step4'" class="step ">
            <div class="stepTitle">
              <div class="zan">
                <img src="./_images/zan.png" alt="赞">
              </div>恭喜您完成软件初始化！
            </div>
            <div class="stepContent">
              <div class="successDesc">
                快去感受一下{{ appCode }}带来的快捷与便利吧！
              </div>
              <div class="optBtn">
                <a id="btn-login" class="btn" @click="redirectToHomeWithRefresh">登录{{ appCode }}</a>
              </div>
            </div>
          </div>
        </BaseTabPane>
      </BaseTabs>
    </div>
    <div v-else style="text-align: center;">
      <h4>数据库已安装！！</h4>
      <h4>三秒后跳转到登录界面...</h4>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.install-page {
  height: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
.install-container {
  height: 100%;
}

.install-tabs {
  height: 100%;
  display: flex;
}

.install-tabs :deep(.el-tabs__content) {
  margin-left: 50px;
  padding-top: 30px;
  flex: 1;
  overflow-y: auto;
}

:deep(.el-input) {
  width: 300px;
}

.step {
}

.stepTitle {
  font-weight: bold;
  text-align: center;
  color: var(--zv-text-color-primary);
  background: url(./_images/stepSplit.png) left bottom no-repeat;

  font-size: 22px;
  line-height: 28px;
  padding-bottom: 45px;
}

.stepContent {
  margin-top: 20px;
}

.install-page {
  .inputDesc {
    margin-top: 6px;
    font-size: 13px;
    line-height: 20px;
    color: var(--el-text-color-secondary);
  }

  .tipTxt {
    display: inline-flex;
    max-width: min(100%, 560px);
    align-items: flex-start;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 6px;
    color: var(--el-text-color-secondary);
    background: var(--el-fill-color-lighter);
  }

  .tipTxt__icon {
    flex: none;
    width: 14px;
    height: 14px;
    margin-top: 2px;
    color: var(--el-text-color-placeholder);
  }

  .tipTxt__content {
    flex: 1;
    min-width: 0;
  }

  .inputDesc .el-input + .tipTxt,
  .inputDesc .el-textarea + .tipTxt {
    margin-top: 8px;
  }

  .inputDesc--danger .tipTxt {
    color: var(--el-color-danger);
    background: var(--el-color-danger-light-9);
    box-shadow: inset 2px 0 0 var(--el-color-danger-light-5);
  }

  .inputDesc--danger .tipTxt__icon {
    color: var(--el-color-danger);
  }

  .inputDesc--danger {
    margin-bottom: 8px;
  }
}

.progressWrap {
  text-align: center;
  margin: 50px 0;
}

.progressTxt {
  font-size: 16px;
  margin-bottom: 20px;
}

.optBtn {
  text-align: center;
  margin-top: 30px;
}

.successDesc {
  font-size: 18px;
  text-align: center;
  margin: 50px 0;
  color: var(--el-text-color-regular);
}
</style>
