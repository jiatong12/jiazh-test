export type Num = 1 | 2 | 3 | 4 | 6 | 8 | 12 | 24
export interface Cols {
  xs?: Num
  sm?: Num
  md?: Num
  lg?: Num
  xl?: Num
}

export interface BaseRowProps {
  // 栅格间隔，数值时为水平间隔，数组时为 [水平间隔,垂直间隔]
  gutter?: number | [number, number]
  // 列的数量
  col?: Num
  // 列的数量，优先级高于 span
  cols?: Cols
}
