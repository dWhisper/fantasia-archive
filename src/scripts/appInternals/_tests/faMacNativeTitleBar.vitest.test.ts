import { afterEach, expect, test, vi } from 'vitest'

import { resolveFaMacNativeTitleBar, resolveFaNativeWindowControls } from '../functions/faMacNativeTitleBar'
import { isFaMacNativeTitleBar, isFaNativeWindowControls } from '../faMacNativeTitleBarWiring'

const quasarPlatformMock = vi.hoisted(() => ({
  Platform: { is: undefined as { mac?: boolean } | undefined }
}))

vi.mock('quasar', () => quasarPlatformMock)

afterEach(() => {
  quasarPlatformMock.Platform.is = undefined
  vi.unstubAllEnvs()
})

/**
 * resolveFaMacNativeTitleBar
 * Only macOS Electron builds use the native traffic lights.
 */
test('Test that resolveFaMacNativeTitleBar is true only for macOS in electron mode', () => {
  expect(resolveFaMacNativeTitleBar(true, 'electron')).toBe(true)
  expect(resolveFaMacNativeTitleBar(true, 'spa')).toBe(false)
  expect(resolveFaMacNativeTitleBar(true, undefined)).toBe(false)
  expect(resolveFaMacNativeTitleBar(false, 'electron')).toBe(false)
})

/**
 * isFaMacNativeTitleBar
 * Wires Quasar platform detection and build mode.
 */
test('Test that isFaMacNativeTitleBar reads Quasar Platform and MODE', () => {
  quasarPlatformMock.Platform.is = { mac: true }
  vi.stubEnv('MODE', 'electron')
  expect(isFaMacNativeTitleBar()).toBe(true)

  vi.stubEnv('MODE', 'spa')
  expect(isFaMacNativeTitleBar()).toBe(false)

  quasarPlatformMock.Platform.is = {}
  vi.stubEnv('MODE', 'electron')
  expect(isFaMacNativeTitleBar()).toBe(false)

  quasarPlatformMock.Platform.is = undefined
  expect(isFaMacNativeTitleBar()).toBe(false)
})

/**
 * resolveFaNativeWindowControls / isFaNativeWindowControls
 * Every Electron build uses native window controls; other modes keep custom buttons.
 */
test('Test that native window controls apply to every electron build only', () => {
  expect(resolveFaNativeWindowControls('electron')).toBe(true)
  expect(resolveFaNativeWindowControls('spa')).toBe(false)
  expect(resolveFaNativeWindowControls(undefined)).toBe(false)

  vi.stubEnv('MODE', 'electron')
  expect(isFaNativeWindowControls()).toBe(true)
  vi.stubEnv('MODE', 'spa')
  expect(isFaNativeWindowControls()).toBe(false)
})
