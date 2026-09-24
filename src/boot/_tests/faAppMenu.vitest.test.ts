/** @vitest-environment jsdom */
import { afterEach, expect, test, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  defineBoot: vi.fn((callback: unknown) => callback),
  runFaAction: vi.fn()
}))

vi.mock('#q-app/wrappers', () => ({
  defineBoot: mocks.defineBoot
}))

vi.mock('app/src/scripts/actionManager/faActionManagerRun_manager', () => ({
  runFaAction: mocks.runFaAction
}))

import faAppMenuBoot from '../faAppMenu'

const originalBridge = window.faContentBridgeAPIs

afterEach(() => {
  window.faContentBridgeAPIs = originalBridge
  vi.unstubAllEnvs()
})

/**
 * faAppMenu boot file
 * Wires the preload menu bridge to runFaAction in electron mode.
 */
test('Test that faAppMenu boot installs the bridge listener and runs menu actions', () => {
  const installActionListener = vi.fn()
  window.faContentBridgeAPIs = {
    ...originalBridge,
    faAppMenu: { installActionListener }
  } as typeof window.faContentBridgeAPIs
  vi.stubEnv('MODE', 'electron')

  ;(faAppMenuBoot as unknown as () => void)()
  const onAction = installActionListener.mock.calls[0]![0] as (id: string) => void
  onAction('openAppSettingsDialog')

  expect(mocks.defineBoot).toHaveBeenCalledTimes(1)
  expect(mocks.runFaAction).toHaveBeenCalledWith('openAppSettingsDialog', undefined)
})
