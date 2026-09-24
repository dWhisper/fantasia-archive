import { expect, test } from 'vitest'

import {
  FA_MAC_TRAFFIC_LIGHT_POSITION,
  FA_TITLE_BAR_OVERLAY_DEFAULTS,
  resolveFaMainWindowChromeOptions
} from '../faMainWindowChromeOptions'

/**
 * resolveFaMainWindowChromeOptions
 * macOS keeps native traffic lights with a hidden title bar and no caption overlay.
 */
test('Test that resolveFaMainWindowChromeOptions uses hidden title bar with traffic lights on darwin', () => {
  const options = resolveFaMainWindowChromeOptions('darwin')

  expect(options).toEqual({
    titleBarStyle: 'hidden',
    trafficLightPosition: {
      x: FA_MAC_TRAFFIC_LIGHT_POSITION.x,
      y: FA_MAC_TRAFFIC_LIGHT_POSITION.y
    }
  })
  expect(options.titleBarOverlay).toBeUndefined()
})

/**
 * resolveFaMainWindowChromeOptions
 * Returned nested objects are copies so callers cannot mutate the shared constants.
 */
test('Test that resolveFaMainWindowChromeOptions returns fresh nested objects', () => {
  expect(resolveFaMainWindowChromeOptions('darwin').trafficLightPosition).not.toBe(FA_MAC_TRAFFIC_LIGHT_POSITION)
  expect(resolveFaMainWindowChromeOptions('win32').titleBarOverlay).not.toBe(FA_TITLE_BAR_OVERLAY_DEFAULTS)
})

/**
 * resolveFaMainWindowChromeOptions
 * Windows and Linux use the native Window Controls Overlay caption buttons.
 */
test.each(['win32', 'linux'])('Test that resolveFaMainWindowChromeOptions uses the native caption overlay on %s', (platform) => {
  expect(resolveFaMainWindowChromeOptions(platform)).toEqual({
    titleBarOverlay: {
      color: FA_TITLE_BAR_OVERLAY_DEFAULTS.color,
      height: FA_TITLE_BAR_OVERLAY_DEFAULTS.height,
      symbolColor: FA_TITLE_BAR_OVERLAY_DEFAULTS.symbolColor
    },
    titleBarStyle: 'hidden'
  })
})
