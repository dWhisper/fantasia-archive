/**
 * Traffic-light origin inside the 36px renderer header ('$mainLayout-appHeader-heightPx').
 * Keep the left reserve in '$mainLayout-appHeader-macTrafficLightsReservePx' wide enough for this x plus three buttons.
 */
export const FA_MAC_TRAFFIC_LIGHT_POSITION = {
  x: 14,
  y: 12
} as const

/**
 * Window chrome per platform: macOS keeps native traffic lights over the custom header ('titleBarStyle: hidden'),
 * Windows and Linux stay frameless and render 'GlobalWindowButtons' instead.
 */
export function resolveFaMainWindowChromeOptions (
  platform: string
): {
    frame?: boolean
    titleBarStyle?: 'hidden'
    trafficLightPosition?: { x: number, y: number }
  } {
  if (platform === 'darwin') {
    return {
      titleBarStyle: 'hidden',
      trafficLightPosition: { ...FA_MAC_TRAFFIC_LIGHT_POSITION }
    }
  }

  return {
    frame: false
  }
}
