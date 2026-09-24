import { expect, test } from 'vitest'

import { faTitleBarOverlayColorsSchema } from '../faTitleBarOverlayColorsSchema'

/**
 * faTitleBarOverlayColorsSchema
 * Accepts two '#RRGGBB' colors.
 */
test('Test that faTitleBarOverlayColorsSchema accepts hex color pairs', () => {
  expect(faTitleBarOverlayColorsSchema.safeParse({
    color: '#183e4d',
    symbolColor: '#F5F5F5'
  }).success).toBe(true)
})

/**
 * faTitleBarOverlayColorsSchema
 * Rejects non-hex strings, missing keys, and extra keys.
 */
test('Test that faTitleBarOverlayColorsSchema rejects malformed payloads', () => {
  expect(faTitleBarOverlayColorsSchema.safeParse({
    color: 'rgb(0, 0, 0)',
    symbolColor: '#ffffff'
  }).success).toBe(false)
  expect(faTitleBarOverlayColorsSchema.safeParse({ color: '#000000' }).success).toBe(false)
  expect(faTitleBarOverlayColorsSchema.safeParse({
    color: '#000000',
    height: 10,
    symbolColor: '#ffffff'
  }).success).toBe(false)
  expect(faTitleBarOverlayColorsSchema.safeParse(null).success).toBe(false)
})
