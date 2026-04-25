export interface IconPickerItem {
  name: string
  label?: string
  color?: string
}

export interface IconPickerGroup {
  key?: string | number
  title: string
  color?: string
  icons: Array<string | IconPickerItem>
}

export interface IconPickerNormalizedItem {
  key: string
  name: string
  label: string
  color: string
  groupKey: string
  groupTitle: string
}

export interface IconPickerNormalizedGroup {
  key: string
  title: string
  color: string
  icons: IconPickerNormalizedItem[]
}
