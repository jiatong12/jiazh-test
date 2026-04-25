export interface Props {
  width?: string // 可选 string 宽
  height?: string // 可选 string 高
  radius?: number | string // 可选 number | string 传0为方形、传50%或者不传为圆形
  color?: string // 可选 string 闪烁颜色
  scale?: number // 可选 number  闪烁范围，默认2，值越大闪烁范围越大
}
