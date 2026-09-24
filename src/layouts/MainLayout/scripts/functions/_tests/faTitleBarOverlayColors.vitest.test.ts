import { expect, test } from 'vitest'

import { parseFaCssColorToHex, resolveFaTitleBarOverlayColors } from '../faTitleBarOverlayColors'

/**
 * parseFaCssColorToHex
 * Normalizes hex and rgb() / rgba() computed colors to lowercase '#rrggbb'.
 */
test('Test that parseFaCssColorToHex converts supported computed colors', () => {
  expect(parseFaCssColorToHex('#183E4D')).toBe('#183e4d')
  expect(parseFaCssColorToHex('rgb(24, 62, 77)')).toBe('#183e4d')
  expect(parseFaCssColorToHex('rgba(245, 245, 245, 1)')).toBe('#f5f5f5')
  expect(parseFaCssColorToHex('rgb(24 62 77 / 50%)')).toBe('#183e4d')
  expect(parseFaCssColorToHex(' rgb(300, 0, 0) ')).toBe('#ff0000')
})

/**
 * parseFaCssColorToHex
 * Unsupported syntax and fully transparent colors return null.
 */
test('Test that parseFaCssColorToHex rejects unsupported or transparent colors', () => {
  expect(parseFaCssColorToHex('transparent')).toBeNull()
  expect(parseFaCssColorToHex('rgba(0, 0, 0, 0)')).toBeNull()
  expect(parseFaCssColorToHex('hsl(0, 0%, 0%)')).toBeNull()
  expect(parseFaCssColorToHex('#fff')).toBeNull()
})

/**
 * resolveFaTitleBarOverlayColors
 * Returns the pair only when both colors parse.
 */
test('Test that resolveFaTitleBarOverlayColors requires both colors', () => {
  expect(resolveFaTitleBarOverlayColors('rgb(24, 62, 77)', 'rgb(245, 245, 245)')).toEqual({
    color: '#183e4d',
    symbolColor: '#f5f5f5'
  })
  expect(resolveFaTitleBarOverlayColors('transparent', 'rgb(245, 245, 245)')).toBeNull()
  expect(resolveFaTitleBarOverlayColors('rgb(24, 62, 77)', 'inherit')).toBeNull()
})
