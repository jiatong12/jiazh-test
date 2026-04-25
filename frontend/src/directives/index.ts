import type { App, Directive } from 'vue'
import copy from './modules/copy'
import debounce from './modules/debounce'
import draggable from './modules/draggable'
import longPress from './modules/longPress'
// import priv from './modules/priv'
import ripple from './modules/ripple'
import throttle from './modules/throttle'
import waterMarker from './modules/waterMarker'

const directivesList: { [key: string]: Directive } = {
  copy,
  waterMarker,
  draggable,
  debounce,
  throttle,
  longPress,
  // priv,
  ripple,
}

const directives = {
  install(app: App<Element>) {
    Object.entries(directivesList).forEach(([key, value]) => {
      app.directive(key, value)
    })
  },
}

export default directives
