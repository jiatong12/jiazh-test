async function loadAppConfig() {
  const appConfigUrl = `${import.meta.env.BASE_URL}_app.config.js?_t=${Date.now()}`

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    // 运行时配置必须早于 main.ts 执行，避免 useEnv() 在模块初始化阶段读到旧值。
    script.src = appConfigUrl
    script.async = false
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`load ${appConfigUrl} failed`))
    document.head.appendChild(script)
  })
}

async function bootstrap() {
  try {
    // 开发和生产统一先加载运行时配置，再启动应用。
    await loadAppConfig()
  }
  catch (error) {
    console.warn('加载运行时配置失败，将回退到构建时配置', error)
  }

  await import('./main')
}

void bootstrap()
