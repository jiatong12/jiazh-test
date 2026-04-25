<script setup lang="ts">
import { APP_LOGO_URL, LOGIN_BG_URL, LOGIN_ILLUSTRATION_URL } from '@/config/app-assets'
import { useEnv } from '@/env'
import { useAuthStore } from '@/store/modules/auth'
import Forget from './components/forget.vue'
import InlineSvg from './components/InlineSvg.vue'
import Login from './components/login/index.vue'
import Phone from './components/phone.vue'
import QrCode from './components/QrCode.vue'
import Register from './components/register.vue'
import { setupStore } from './context'
import Motion from './utils/motion'

const { currentPage } = setupStore()

const { loginInit } = useAuthStore()
loginInit()

const { APP_TITLE } = useEnv()
</script>

<template>
  <div class="login-page">
    <div class="login-bg">
      <InlineSvg
        class="login-bg-svg"
        :src="LOGIN_BG_URL"
        :show-placeholder="false"
      />
    </div>

    <div class="top-right-controls">
      <!-- 主题 -->
      <DarkModeToggle />
      <!-- 国际化 -->
    </div>
    <div class="login-container">
      <div class="illustration">
        <InlineSvg
          class="illustration-svg"
          :src="LOGIN_ILLUSTRATION_URL"
        />
      </div>
      <div class="login-box">
        <div class="login-form">
          <img class="login-icon" :src="APP_LOGO_URL" alt="">
          <Motion>
            <div class="logo-text">
              <BaseTypeit
                :options="{ strings: [APP_TITLE], cursor: false, speed: 100 }"
              />
            </div>
          </Motion>
          <!-- 账号密码登录 -->
          <Login v-if="currentPage === 'login'" />
          <!-- 手机号登录 -->
          <Phone v-else-if="currentPage === 'phone'" />
          <!-- 二维码登录 -->
          <QrCode v-else-if="currentPage === 'qrcode'" />
          <!-- 注册 -->
          <Register v-else-if="currentPage === 'register'" />
          <!-- 忘记密码 -->
          <Forget v-else-if="currentPage === 'forget'" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  background: rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 使用滤镜创建光晕效果 */
  // filter: blur(40px) opacity(0.6);
  color: var(--zv-primary);
}

.login-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 18rem;
  width: 100vw;
  max-width: 100%;
  min-height: 100vh; // 如果需要最小高度为视口高度
  height: auto; // 允许内容超出时自动扩展
  padding: 0 2rem;
  overflow-y: auto; // 启用垂直滚动
  position: relative;
  z-index: 10;

  .login-form {
    // 毛玻璃效果基础属性
    backdrop-filter: blur(20px) saturate(180%);
    border-radius: 10px;
    padding: 48px 40px;
    background-color: #fff;

    // 多层阴影创造立体感
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.08),
      // 外层亮边框
      0 10px 30px rgba(0, 0, 0, 0.08),
      // 主投影
      0 5px 15px rgba(0, 0, 0, 0.05),
      // 中层投影
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      // 内上高光
      inset 0 -1px 2px rgba(0, 0, 0, 0.1); // 内下阴影

    // 半透明边框
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-top: 1px solid rgba(255, 255, 255, 0.25);
    border-left: 1px solid rgba(255, 255, 255, 0.2);

    width: 100%;
    max-width: 420px; // 稍微扩大
    transition:
      box-shadow 0.3s ease,
      backdrop-filter 0.3s ease,
      border-color 0.3s ease;
    position: relative;

    // 悬停效果
    &:hover {
      box-shadow:
        0 0 0 1px rgba(255, 255, 255, 0.1),
        0 16px 32px rgba(0, 0, 0, 0.1),
        0 8px 18px rgba(0, 0, 0, 0.07),
        inset 0 1px 0 rgba(255, 255, 255, 0.35),
        inset 0 -1px 2px rgba(0, 0, 0, 0.08);

      // 增强毛玻璃效果
      backdrop-filter: blur(24px) saturate(200%);
    }
  }
}
.dark .login-container .login-form {
  background-color: rgba(255, 255, 255, 0.05);
}
.login-bg-svg {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: -1;
  width: 100%;
}

.login-bg :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
}

.illustration {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: var(--zv-primary);
}

.illustration-svg {
  width: 500px;
}

.illustration :deep(img),
.illustration :deep(svg) {
  width: 100%;
}

.login-box {
  display: flex;
  align-items: center;
  // overflow: hidden;
  text-align: center;
}

.login-icon {
  height: 80px;
}

.login-form .logo-text {
  margin: 15px 0;
  font:
    700 200% Consolas,
    Monaco,
    monospace;
  color: var(--zv-gray-600);
  text-transform: uppercase;
  margin-bottom: 50px;
}

@media screen and (width <= 1180px) {
  .login-container {
    grid-gap: 9rem;
  }

  .login-form {
    width: 290px;
  }

  .login-form .logo-text {
    margin: 8px 0;
    font-size: 2rem;
  }

  .illustration-svg {
    width: 360px;
  }

  .login-icon {
    width: 100%;
    height: 80px;
  }
}

@media screen and (width <= 968px) {
  .illustration {
    display: none;
  }

  .login-container {
    grid-template-columns: 1fr;
    background-image: none;
  }

  .login-box {
    justify-content: center;
  }
}

:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

.top-right-controls {
  position: absolute;
  top: 12px;
  right: 20px;
  z-index: 11;
}

.translation {
  :deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}

/* fadeInLeft 动画定义 */
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

/* animate.css 动画基础类 */
.animate__animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

.animate__fadeInLeft {
  animation-name: fadeInLeft;
}

/* 如果需要更快的动画速度，可以添加 fast 类 */
.animate__fast {
  animation-duration: 800ms;
}
</style>
