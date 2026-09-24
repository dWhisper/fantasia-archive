import type { I_faTitleBarOverlayColors } from 'app/types/I_faElectronRendererBridgeAPIs'

const FA_HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i
const FA_RGB_COLOR_PATTERN = /^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})(?:[\s,/]+([\d.]+)%?)?\s*\)$/i

function channelToHex (channel: string): string {
  return Math.min(255, Number(channel)).toString(16).padStart(2, '0')
}

/**
 * Converts a computed CSS color ('#rrggbb', 'rgb()', 'rgba()') to lowercase '#rrggbb'.
 * Returns null for unsupported syntax or fully transparent colors (overlay needs an opaque fill).
 */
export function parseFaCssColorToHex (value: string): string | null {
  const trimmed = value.trim()
  if (FA_HEX_COLOR_PATTERN.test(trimmed)) {
    return trimmed.toLowerCase()
  }
  const match = FA_RGB_COLOR_PATTERN.exec(trimmed)
  if (match === null) {
    return null
  }
  if (match[4] !== undefined && Number(match[4]) === 0) {
    return null
  }
  return `#${channelToHex(match[1]!)}${channelToHex(match[2]!)}${channelToHex(match[3]!)}`
}

/**
 * Builds caption overlay colors from the header's computed background and text colors.
 */
export function resolveFaTitleBarOverlayColors (
  backgroundColor: string,
  textColor: string
): I_faTitleBarOverlayColors | null {
  const color = parseFaCssColorToHex(backgroundColor)
  const symbolColor = parseFaCssColorToHex(textColor)
  if (color === null || symbolColor === null) {
    return null
  }
  return {
    color,
    symbolColor
  }
}
