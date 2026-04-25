import type { Options } from 'qr-code-styling'
import type { BaseQrCodePresetName, BaseQrCodeThemePalette } from './types'

function linearGradient(startColor: string, endColor: string, rotation: number) {
  return {
    type: 'linear' as const,
    rotation,
    colorStops: [
      { offset: 0, color: startColor },
      { offset: 1, color: endColor },
    ],
  }
}

export function getBaseQrCodePresetOptions(
  preset: BaseQrCodePresetName,
  palette: BaseQrCodeThemePalette,
): Partial<Options> {
  const common: Partial<Options> = {
    type: 'svg',
    shape: 'square',
    margin: 10,
    qrOptions: {
      errorCorrectionLevel: 'H',
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.24,
      margin: 4,
      crossOrigin: 'anonymous',
      saveAsBlob: false,
    },
  }

  if (preset === 'login') {
    return {
      ...common,
      dotsOptions: {
        type: 'rounded',
        gradient: linearGradient(palette.primaryLight, palette.primary, Math.PI / 5),
      },
      cornersSquareOptions: {
        type: 'extra-rounded',
        gradient: linearGradient(palette.primaryDark, palette.primary, Math.PI / 6),
      },
      cornersDotOptions: {
        type: 'dot',
        color: palette.primaryDark,
      },
      backgroundOptions: {
        color: '#ffffff',
      },
    }
  }

  if (preset === 'art') {
    return {
      ...common,
      dotsOptions: {
        type: 'classy-rounded',
        gradient: linearGradient(palette.primaryLight, palette.primary, Math.PI / 4),
      },
      cornersSquareOptions: {
        type: 'classy',
        gradient: linearGradient(palette.primaryDark, palette.primary, Math.PI / 3),
      },
      cornersDotOptions: {
        type: 'dot',
        color: palette.primaryLight,
      },
      backgroundOptions: {
        color: '#ffffff',
      },
    }
  }

  return {
    ...common,
    dotsOptions: {
      type: 'rounded',
      gradient: linearGradient(palette.primaryLight, palette.primary, Math.PI / 4),
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
      color: palette.primary,
    },
    cornersDotOptions: {
      type: 'dot',
      color: palette.primaryDark,
    },
    backgroundOptions: {
      color: '#ffffff',
    },
  }
}
