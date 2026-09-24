/**
 * Traffic-light origin inside the 36px renderer header ('$mainLayout-appHeader-heightPx').
 * Keep the left reserve in '$mainLayout-appHeader-macTrafficLightsReservePx' wide enough for this x plus three buttons.
 */
export const FA_MAC_TRAFFIC_LIGHT_POSITION = {
  x: 14,
  y: 12
} as const

/**
 * Initial Windows / Linux caption-button overlay: '$dark-middle' header fill with '$accent' glyphs, 36px tall like the header.
 * The renderer re-syncs colors from the live header via 'setTitleBarOverlay' once themes and routes resolve.
 */
export const FA_TITLE_BAR_OVERLAY_DEFAULTS = {
  color: '#183e4d',
  height: 36,
  symbolColor: '#f5f5f5'
} as const

/**
 * Window chrome per platform. All platforms hide the OS title bar so the app header is the drag region.
 * macOS keeps native traffic lights; Windows and Linux use the native Window Controls Overlay caption buttons.
 */
export function resolveFaMainWindowChromeOptions (
  platform: string
): {
    titleBarOverlay?: { color: string, height: number, symbolColor: string }
    titleBarStyle: 'hidden'
    trafficLightPosition?: { x: number, y: number }
  } {
  if (platform === 'darwin') {
    return {
      titleBarStyle: 'hidden',
      trafficLightPosition: { ...FA_MAC_TRAFFIC_LIGHT_POSITION }
    }
  }

  return {
    titleBarOverlay: { ...FA_TITLE_BAR_OVERLAY_DEFAULTS },
    titleBarStyle: 'hidden'
  }
}
