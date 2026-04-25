import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)', // 动画方式
  speed: 360, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 160, // 自动递增间隔
  minimum: 0.08, // 初始化时的最小百分比，避免起步过于突兀
})

export default NProgress
