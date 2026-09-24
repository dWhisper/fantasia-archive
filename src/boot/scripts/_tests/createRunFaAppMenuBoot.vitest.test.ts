import { expect, test, vi } from 'vitest'

import { createRunFaAppMenuBoot } from '../functions/createRunFaAppMenuBoot'

/**
 * createRunFaAppMenuBoot
 * Electron with a bridge: menu actions run through runFaAction without payload.
 */
test('Test that runFaAppMenuBoot routes menu actions to runFaAction in electron', () => {
  const installActionListener = vi.fn()
  const runFaAction = vi.fn()
  createRunFaAppMenuBoot({
    getAppMenuBridge: () => ({ installActionListener }),
    getMode: () => 'electron',
    runFaAction
  })()

  const onAction = installActionListener.mock.calls[0]![0] as (id: string) => void
  onAction('openChangelogDialog')

  expect(runFaAction).toHaveBeenCalledWith('openChangelogDialog', undefined)
})

/**
 * createRunFaAppMenuBoot
 * Non-electron modes and a missing bridge install nothing.
 */
test('Test that runFaAppMenuBoot skips non-electron modes and missing bridges', () => {
  const installActionListener = vi.fn()
  const getAppMenuBridge = vi.fn(() => ({ installActionListener }))

  createRunFaAppMenuBoot({
    getAppMenuBridge,
    getMode: () => 'spa',
    runFaAction: vi.fn()
  })()
  createRunFaAppMenuBoot({
    getAppMenuBridge: () => undefined,
    getMode: () => 'electron',
    runFaAction: vi.fn()
  })()

  expect(getAppMenuBridge).not.toHaveBeenCalled()
  expect(installActionListener).not.toHaveBeenCalled()
})
