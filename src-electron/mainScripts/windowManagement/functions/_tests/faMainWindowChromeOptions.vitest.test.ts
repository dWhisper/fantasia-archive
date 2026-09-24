import { expect, test } from 'vitest'

import {
  FA_MAC_TRAFFIC_LIGHT_POSITION,
  resolveFaMainWindowChromeOptions
} from '../faMainWindowChromeOptions'

/**
 * resolveFaMainWindowChromeOptions
 * macOS keeps native traffic lights with a hidden title bar instead of a frameless window.
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
  expect(options.frame).toBeUndefined()
})

/**
 * resolveFaMainWindowChromeOptions
 * Returned position is a copy so callers cannot mutate the shared constant.
 */
test('Test that resolveFaMainWindowChromeOptions returns a fresh traffic light position object', () => {
  const options = resolveFaMainWindowChromeOptions('darwin')

  expect(options.trafficLightPosition).not.toBe(FA_MAC_TRAFFIC_LIGHT_POSITION)
})

/**
 * resolveFaMainWindowChromeOptions
 * Windows and Linux stay frameless so the renderer draws its own window buttons.
 */
test.each(['win32', 'linux'])('Test that resolveFaMainWindowChromeOptions stays frameless on %s', (platform) => {
  expect(resolveFaMainWindowChromeOptions(platform)).toEqual({ frame: false })
})
