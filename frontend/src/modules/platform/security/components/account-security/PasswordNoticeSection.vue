<script setup lang="ts">
import type { InputInstance } from 'element-plus'
import type { ChangePwdNoticeConfig, ExpirationNoticeItem, SecurityFormModel } from './accountSecurity.types'
import { reactive, ref } from 'vue'
import { $$auths } from '@/auths'
import AccountSecuritySection from './AccountSecuritySection.vue'

const props = defineProps<{
  /** 账户安全表单模型。 */
  model: SecurityFormModel
  /** 是否显示密码过期提醒的扩展配置。 */
  showNoticeTip: boolean
  /** 可选的过期提醒日期列表。 */
  expirationNoticeItems: ExpirationNoticeItem[]
  /** 当前所选短信模板名称。 */
  smsTemplateName: string
  /** 打开短信模板选择弹窗。 */
  onOpenSmsTemplateDialog: () => void
  /** 普通字段变更处理函数。 */
  onFieldChange: (
    field: keyof SecurityFormModel,
    value: unknown,
  ) => void
  /** 密码过期通知嵌套字段变更处理函数。 */
  onChangePwdNoticeFieldChange: (
    channel: keyof ChangePwdNoticeConfig,
    field: string,
    value: unknown,
  ) => void
  /** 数值字段变更处理函数。 */
  onInputNumberChange: (
    field: 'expiration',
    value: string | number | null | undefined,
    fallbackValue: number,
  ) => void
}>()

const noticeTimeSelectConfig = {
  start: '00:00',
  step: '1:00',
  end: '23:00',
}

const editorConfig = reactive({
  UEDITOR_HOME_URL: '/static/UEditorPlus/',
  UEDITOR_CORS_URL: '/static/UEditorPlus/',
  // 邮件模板场景不依赖上传、抓取远程资源等后端能力，这里关闭服务端配置拉取，
  // 避免编辑器继续请求内置 demo 接口并把 HTML 错误页当成 JSON 解析。
  loadConfigFromServer: false,
  minFrameHeight: 220,
  initialFrameHeight: 320,
  zIndex: 10,
  focus: false,
  // 邮件模板更接近最终发送效果，固定使用浅色编辑区更稳定。
  initialStyle: 'body{line-height:1.7;color:#303133;background:#ffffff;}p{line-height:1.7em;}',
  iframeCssStylesAddition: [
    `
      html, body {
        background: #ffffff;
        color: #303133;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.7;
      }

      body p,
      body li,
      body td,
      body th {
        color: #606266;
      }

      a {
        color: #409eff;
      }

      blockquote {
        color: #909399;
        border-left-color: #dcdfe6;
        background: #f5f7fa;
      }

      pre {
        color: #303133;
        border: 1px solid #dcdfe6;
        background: #f5f7fa;
      }

      .edui-quick-operate,
      .edui-quick-operate-menu {
        background: #ffffff;
        border-color: #dcdfe6;
        box-shadow: 0 8px 24px -18px rgb(0 0 0 / 18%);
      }

      .edui-quick-operate-menu .item {
        color: #606266;
      }

      .edui-quick-operate-menu .item:hover {
        background: #f5f7fa;
      }
    `,
  ],
  // 账户安全中的邮件模板只需要基础富文本能力，这里显式关闭 AI 相关入口。
  ai: false,
  aiFunctions: [],
  toolbarShows: {
    ai: false,
  },
  shortcutMenuShows: {
    ai: false,
  },
  toolbars: [
    [
      'source',
      'fontfamily',
      'bold',
      'italic',
      'underline',
      'fontborder',
      'strikethrough',
      'superscript',
      'subscript',
      'blockquote',
      '|',
      'forecolor',
      'backcolor',
      'removeformat',
    ],
  ],
  autoFloatEnabled: false,
  enterTag: 'br',
})

const emailEditorRef = ref<any>()
const msgTemplateRef = ref<InputInstance>()
const expirationDateVariable = '$' + '{ExpDate}'
const emailTemplateVariables = [
  { label: '用户名', value: '$' + '{UserName}', title: '添加用户名变量' },
  { label: '过期时间', value: expirationDateVariable, title: '添加过期时间变量' },
  { label: '应用地址', value: '$' + '{AppURL}', title: '添加应用地址变量' },
]

/** 保存邮件编辑器实例，后续插入变量和同步主题时直接复用。 */
function handleEmailEditorReady(instance: any) {
  emailEditorRef.value = instance
}

/** 向邮件模板插入占位变量。 */
function insertEmailTemplateVariable(variableName: string) {
  emailEditorRef.value?.execCommand?.('insertHtml', variableName)
}

/** 向站内信模板插入占位变量，并尽量保留用户当前光标位置。 */
function insertMessageTemplateVariable(variableName: string) {
  const textarea = msgTemplateRef.value?.textarea
  const currentTemplate = props.model.changePwdNotice.msg.template || ''

  if (!textarea) {
    props.onChangePwdNoticeFieldChange('msg', 'template', `${currentTemplate}${variableName}`)
    return
  }

  const start = textarea.selectionStart || 0
  const end = textarea.selectionEnd || start
  props.onChangePwdNoticeFieldChange(
    'msg',
    'template',
    `${currentTemplate.slice(0, start)}${variableName}${currentTemplate.slice(end)}`,
  )

  requestAnimationFrame(() => {
    textarea.focus()
    const nextPosition = start + variableName.length
    textarea.setSelectionRange(nextPosition, nextPosition)
  })
}
</script>

<template>
  <AccountSecuritySection title="密码变更通知">
    <ElFormItem label="指定密码过期时间：" prop="expiration">
      <ElInputNumber
        :model-value="model.expiration"
        :min="0"
        :precision="0"
        placeholder="指定密码过期时间"
        @update:model-value="onInputNumberChange('expiration', $event, 0)"
        @input="onInputNumberChange('expiration', $event, 0)"
        @change="onInputNumberChange('expiration', $event, 0)"
      />
      <span class="security-unit">单位：（天）</span>
    </ElFormItem>
    <ElFormItem>
      <span class="security-tip">
        注：指定密码时间设置为 0 或空时将不过期
      </span>
    </ElFormItem>

    <div v-show="showNoticeTip" class="password-notice-extra-fields">
      <ElFormItem label="密码过期后策略：" prop="forbiddenPolicy">
        <ElRadioGroup
          :model-value="model.forbiddenPolicy"
          @update:model-value="onFieldChange('forbiddenPolicy', $event)"
        >
          <ElRadio value="Y">
            停用账户
          </ElRadio>
          <ElRadio value="N">
            通过验证过期密码设置新密码
          </ElRadio>
        </ElRadioGroup>
      </ElFormItem>

      <ElFormItem label="密码过期通知方式：" prop="changePwdNotice" />

      <ElFormItem>
        <ElCheckbox
          :model-value="model.changePwdNotice.sms.open"
          value="SMS"
          true-value="Y"
          false-value="N"
          style="width: 70px"
          @update:model-value="onChangePwdNoticeFieldChange('sms', 'open', $event)"
        >
          手机短信
        </ElCheckbox>
        <template v-if="model.changePwdNotice.sms.open === 'Y'">
          <ElInput
            :model-value="smsTemplateName"
            readonly
            style="width: 50%"
            class="sms-template-input"
          />
          <ElButton
            type="primary"
            link
            :disabled="!$$auths.hasPriv('Platform.SMSSetting.TemplateAdd')"
            @click="onOpenSmsTemplateDialog"
          >
            <i class="fa fa-plus" />
            选择短信模板
          </ElButton>
          <ElCheckbox
            :model-value="model.changePwdNotice.sms.ExpDate"
            true-value="Y"
            false-value="N"
            @update:model-value="onChangePwdNoticeFieldChange('sms', 'ExpDate', $event)"
          >
            包含过期时间
          </ElCheckbox>
        </template>
      </ElFormItem>

      <ElFormItem>
        <ElCheckbox
          :model-value="model.changePwdNotice.email.open"
          value="Email"
          true-value="Y"
          false-value="N"
          style="width: 82px"
          @update:model-value="onChangePwdNoticeFieldChange('email', 'open', $event)"
        >
          邮件
        </ElCheckbox>
        <div v-show="model.changePwdNotice.email.open === 'Y'" class="email-template-panel">
          <div class="email-template-panel__main">
            <div class="email-template-panel__header">
              <div>
                <div class="email-template-panel__title">
                  邮件模板内容
                </div>
                <div class="email-template-panel__desc">
                  支持富文本排版，可在右侧快速插入用户名、过期时间和应用地址等变量。
                </div>
              </div>
            </div>
            <div class="email-template-panel__editor">
              <VueUeditorWrap
                :model-value="model.changePwdNotice.email.template"
                editor-id="account-security-email-template"
                :config="editorConfig"
                :editor-dependencies="['ueditor.config.js', 'ueditor.all.js']"
                @update:model-value="onChangePwdNoticeFieldChange('email', 'template', $event)"
                @ready="handleEmailEditorReady"
              />
            </div>
          </div>

          <aside class="email-template-panel__aside">
            <div class="email-template-panel__aside-title">
              可用变量
            </div>
            <div class="email-template-panel__aside-desc">
              点击后会插入到当前光标位置。
            </div>
            <div class="email-template-panel__variable-list">
              <button
                v-for="item in emailTemplateVariables"
                :key="item.value"
                type="button"
                class="email-template-variable"
                :title="item.title"
                @click="insertEmailTemplateVariable(item.value)"
              >
                <span class="email-template-variable__label">{{ item.label }}</span>
                <span class="email-template-variable__value">{{ item.value }}</span>
              </button>
            </div>
          </aside>
        </div>
      </ElFormItem>

      <ElFormItem>
        <ElCheckbox
          :model-value="model.changePwdNotice.msg.open"
          value="Message"
          true-value="Y"
          false-value="N"
          style="width: 82px"
          @update:model-value="onChangePwdNoticeFieldChange('msg', 'open', $event)"
        >
          站内信
        </ElCheckbox>
        <template v-if="model.changePwdNotice.msg.open === 'Y'">
          <ElRow :gutter="12" class="security-editor-row">
            <ElCol :span="18">
              <ElInput
                ref="msgTemplateRef"
                :model-value="model.changePwdNotice.msg.template"
                type="textarea"
                :rows="3"
                :placeholder="`请输入站内信模板，${expirationDateVariable} 占位符表示过期时间`"
                @update:model-value="onChangePwdNoticeFieldChange('msg', 'template', $event)"
              />
            </ElCol>
            <ElCol :span="6" class="tag-btn-group">
              <a class="tag-btn" title="添加过期时间变量" @click="insertMessageTemplateVariable(expirationDateVariable)">过期时间</a>
            </ElCol>
          </ElRow>
        </template>
      </ElFormItem>

      <ElFormItem>
        <span class="security-tip">
          注：设置密码过期提醒时，需要勾选通知方式并配置对应模板
        </span>
      </ElFormItem>

      <ElFormItem label="发送通知的日期：">
        <ElCheckboxGroup
          v-if="expirationNoticeItems.length > 0"
          :model-value="model.expirationDate"
          @update:model-value="onFieldChange('expirationDate', $event)"
        >
          <ElCheckbox
            v-for="item in expirationNoticeItems"
            :key="item.key"
            :value="item.key"
          >
            {{ item.value }}
          </ElCheckbox>
        </ElCheckboxGroup>
      </ElFormItem>

      <ElFormItem>
        <span class="security-tip">
          注：选中后系统将在过期前的指定日期发送通知
        </span>
      </ElFormItem>

      <ElFormItem label="发送通知的时刻：">
        <ElTimeSelect
          :model-value="model.sendNoticeTime"
          format="HH:mm"
          :start="noticeTimeSelectConfig.start"
          :step="noticeTimeSelectConfig.step"
          :end="noticeTimeSelectConfig.end"
          placeholder="选择发送时间"
          @update:model-value="onFieldChange('sendNoticeTime', $event)"
        />
      </ElFormItem>

      <ElFormItem>
        <span class="security-tip">
          注：设置提醒日消息的发送时刻，默认为上午 10:00
        </span>
      </ElFormItem>
    </div>
  </AccountSecuritySection>
</template>

<style scoped lang="scss">
.password-notice-extra-fields {
  width: 100%;
}

.security-editor-row {
  width: 100%;
}

.email-template-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
  gap: 16px;
  width: 100%;
  padding: 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--el-color-primary) 3%, var(--el-fill-color-blank)),
    var(--el-fill-color-blank)
  );
  box-shadow:
    0 1px 2px rgb(0 0 0 / 4%),
    0 10px 24px -20px rgb(0 0 0 / 16%);
}

.email-template-panel__main {
  min-width: 0;
}

.email-template-panel__header {
  margin-bottom: 12px;
}

.email-template-panel__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.4;
}

.email-template-panel__desc {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--el-text-color-secondary);
}

.email-template-panel__editor {
  --edui-color-border: #dcdfe6;
  --edui-bg-toolbar: #ffffff;
  --edui-color-muted: #909399;
  --edui-color-active-bg: #ecf5ff;
  --editor-surface: #ffffff;
  --editor-surface-soft: #f5f7fa;
  --editor-toolbar-top: #f8fafc;
  --editor-border: #dcdfe6;
  --editor-text: #303133;
  --editor-text-secondary: #606266;
  --editor-text-muted: #909399;
  --editor-hover-bg: #ecf5ff;
  --editor-active-bg: #d9ecff;
  --editor-hover-border: #b3d8ff;
  --editor-active-border: #79bbff;
  position: relative;
  min-height: 320px;
  overflow: hidden;
  border: 1px solid var(--editor-border);
  border-radius: 10px;
  background: var(--editor-surface);
  box-shadow: 0 0 0 1px rgb(220 223 230 / 48%) inset;

  :deep(.vue-ueditor-wrap) {
    background: var(--editor-surface);
  }

  :deep(.edui-editor),
  :deep(.edui-editor-box),
  :deep(.edui-editor-iframeholder) {
    border: 0;
    background: var(--editor-surface);
  }

  :deep(.edui-editor-toolbarbox) {
    border-bottom: 1px solid var(--editor-border);
    background: linear-gradient(180deg, var(--editor-toolbar-top), var(--editor-surface));
  }

  :deep(.edui-toolbar) {
    padding: 6px;
    background: transparent;
  }

  :deep(.edui-toolbar .edui-button .edui-button-body),
  :deep(.edui-toolbar .edui-menubutton .edui-menubutton-body),
  :deep(.edui-toolbar .edui-splitbutton .edui-splitbutton-body) {
    color: var(--editor-text-secondary);
    background: transparent;
    border-color: transparent;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease;
  }

  :deep(.edui-default .edui-toolbar .edui-state-hover .edui-button-body),
  :deep(.edui-default .edui-toolbar .edui-splitbutton .edui-state-hover .edui-splitbutton-body),
  :deep(.edui-default .edui-toolbar .edui-menubutton .edui-state-hover .edui-menubutton-body) {
    background: var(--editor-hover-bg);
    border-color: var(--editor-hover-border);
    color: var(--editor-text);
  }

  :deep(.edui-default .edui-toolbar .edui-state-active .edui-button-body),
  :deep(.edui-default .edui-toolbar .edui-splitbutton .edui-state-active .edui-splitbutton-body),
  :deep(.edui-default .edui-toolbar .edui-menubutton .edui-state-active .edui-menubutton-body),
  :deep(.edui-default .edui-toolbar .edui-splitbutton .edui-state-opened .edui-splitbutton-body),
  :deep(.edui-default .edui-toolbar .edui-menubutton .edui-state-opened .edui-menubutton-body) {
    background: var(--editor-active-bg);
    border-color: var(--editor-active-border);
    box-shadow: 0 0 0 1px rgb(64 158 255 / 10%) inset;
  }

  :deep(.edui-toolbar .edui-icon),
  :deep(.edui-toolbar .edui-label),
  :deep(.edui-toolbar .edui-arrow) {
    color: inherit;
  }

  /* fontfamily 是 combox，不跟普通按钮一套皮肤，单独收口避免后续继续散落补丁。 */
  :deep(.edui-default .edui-toolbar [class*='edui-for-fontfamily']) {
    &,
    .edui-combox-body,
    .edui-button-body,
    .edui-menubutton-body {
      color: var(--editor-text) !important;
      background: var(--editor-surface) !important;
      border-color: var(--editor-border) !important;
      opacity: 1 !important;
    }

    .edui-label,
    .edui-button-label,
    .edui-combox-body .edui-button-label,
    .edui-combox-body .edui-label,
    .edui-button-body *,
    .edui-menubutton-body *,
    .edui-combox-body * {
      color: var(--editor-text) !important;
      -webkit-text-fill-color: var(--editor-text) !important;
      opacity: 1 !important;
      font-weight: 500;
    }

    .edui-arrow,
    .edui-arrow:before {
      color: var(--editor-text-secondary) !important;
      -webkit-text-fill-color: var(--editor-text-secondary) !important;
      opacity: 1 !important;
    }

    .edui-state-hover .edui-combox-body,
    .edui-state-hover .edui-menubutton-body,
    .edui-state-opened .edui-combox-body,
    .edui-state-opened .edui-menubutton-body,
    .edui-state-active .edui-combox-body,
    .edui-state-active .edui-menubutton-body {
      background: var(--editor-hover-bg) !important;
      border-color: var(--editor-hover-border) !important;
    }
  }

  :deep(.edui-default .edui-toolbar .edui-state-disabled .edui-button-body),
  :deep(.edui-default .edui-toolbar .edui-state-disabled .edui-menubutton-body),
  :deep(.edui-default .edui-toolbar .edui-state-disabled .edui-splitbutton-body) {
    color: #c0c4cc;
  }

  :deep(.edui-default .edui-toolbar .edui-separator) {
    background: var(--editor-border);
  }

  :deep(.edui-default .edui-editor-bottomContainer) {
    border-top: 1px solid var(--editor-border);
    background: var(--editor-surface-soft);
  }

  :deep(.edui-default .edui-wordcount),
  :deep(.edui-default .edui-bottombar) {
    color: var(--editor-text-muted);
  }

  :deep(.edui-default .edui-popup),
  :deep(.edui-default .edui-popup-content),
  :deep(.edui-default .edui-shortcutmenu),
  :deep(.edui-default .edui-dialog-shadow),
  :deep(.edui-default .edui-dialog-titlebar),
  :deep(.edui-default .edui-dialog-foot),
  :deep(.edui-default .edui-pastecontainer) {
    background: var(--editor-surface);
    color: var(--editor-text);
  }

  :deep(.edui-default .edui-popup-content),
  :deep(.edui-default .edui-shortcutmenu),
  :deep(.edui-default .edui-dialog-shadow),
  :deep(.edui-default .edui-pastecontainer) {
    border-color: var(--editor-border);
    box-shadow: 0 10px 30px -22px rgb(0 0 0 / 28%);
  }

  :deep(.edui-default .edui-menuitem .edui-label),
  :deep(.edui-default .edui-dialog-caption),
  :deep(.edui-default .edui-pastecontainer .edui-title) {
    color: var(--editor-text);
  }

  :deep(.edui-default .edui-menu-body .edui-state-hover),
  :deep(.edui-default .edui-quick-operate-menu .item:hover),
  :deep(.edui-default .edui-pastecontainer .edui-title) {
    background: var(--editor-hover-bg);
  }

  :deep(.edui-default .edui-dialog-buttons .edui-button .edui-button-body) {
    background: var(--editor-surface-soft);
    border-color: var(--editor-border);
    color: var(--editor-text);
  }

  :deep(.edui-default .edui-dialog-closebutton .edui-button-body .edui-icon),
  :deep(.edui-default .edui-quick-operate-icon:last-child) {
    color: var(--editor-text-muted);
  }

  :deep(.edui-default .edui-quick-operate-icon) {
    color: var(--el-color-primary);
  }

  :deep(iframe) {
    background: var(--editor-surface);
  }
}

.email-template-panel__aside {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  background: color-mix(in srgb, var(--el-fill-color-light) 72%, var(--el-bg-color) 28%);
}

.email-template-panel__aside-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.email-template-panel__aside-desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--el-text-color-secondary);
}

.email-template-panel__variable-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.email-template-variable {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--el-border-color);
  border-radius: 10px;
  background: var(--el-bg-color);
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.email-template-variable:hover {
  border-color: color-mix(in srgb, var(--el-color-primary) 45%, var(--el-border-color));
  background: color-mix(in srgb, var(--el-color-primary) 6%, var(--el-bg-color));
  box-shadow: 0 8px 18px -16px color-mix(in srgb, var(--el-color-primary) 48%, transparent);
  transform: translateY(-1px);
}

.email-template-variable:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--el-color-primary) 45%, transparent);
  outline-offset: 2px;
}

.email-template-variable__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.email-template-variable__value {
  font-family: Consolas, 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: var(--el-color-primary);
  word-break: break-all;
}

.tag-btn-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
}

.tag-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 8px 16px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-btn:hover {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary-light-5);
}

.sms-template-input :deep(.el-input__wrapper) {
  background-color: var(--el-fill-color-light);
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

@media (max-width: 1200px) {
  .email-template-panel {
    grid-template-columns: 1fr;
  }

  .email-template-panel__aside {
    padding: 12px;
  }

  .email-template-panel__variable-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .email-template-panel {
    padding: 12px;
  }

  .email-template-panel__variable-list {
    grid-template-columns: 1fr;
  }
}
</style>
