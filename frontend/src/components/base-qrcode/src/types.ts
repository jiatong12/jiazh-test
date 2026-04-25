import type { DrawType, ErrorCorrectionLevel, Options, ShapeType } from 'qr-code-styling'

export type BaseQrCodePresetName = 'default' | 'login' | 'art'

export interface BaseQrCodeLogoConfig {
  src: string
  size?: number
  margin?: number
  hideBackgroundDots?: boolean
  saveAsBlob?: boolean
  crossOrigin?: string
}

export type BaseQrCodeLogo = false | string | BaseQrCodeLogoConfig

export interface BaseQrCodeThemePalette {
  primary: string
  primaryLight: string
  primaryDark: string
}

export interface BaseQrCodeProps {
  value: string
  size?: number
  width?: number
  height?: number
  type?: DrawType
  shape?: ShapeType
  margin?: number
  errorCorrectionLevel?: ErrorCorrectionLevel
  preset?: BaseQrCodePresetName
  themeAware?: boolean
  logo?: BaseQrCodeLogo
  advancedOptions?: Partial<Options>
  className?: string
}
