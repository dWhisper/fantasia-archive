import { beforeEach, expect, test, vi } from 'vitest'

import { FA_APP_MENU_IPC } from 'app/src-electron/electron-ipc-bridge'

const { onMock } = vi.hoisted(() => ({
  onMock: vi.fn()
}))

vi.mock('electron', () => ({
  ipcRenderer: {
    on: onMock
  }
}))

beforeEach(() => {
  vi.resetModules()
  onMock.mockReset()
})

/**
 * faAppMenuAPI.installActionListener
 * Subscribes once and forwards only allowlisted action ids.
 */
test('Test that installActionListener forwards allowlisted menu actions once', async () => {
  const { faAppMenuAPI } = await import('../faAppMenuAPI')
  const onAction = vi.fn()

  faAppMenuAPI.installActionListener(onAction)
  faAppMenuAPI.installActionListener(onAction)
  expect(onMock).toHaveBeenCalledTimes(1)
  expect(onMock.mock.calls[0]![0]).toBe(FA_APP_MENU_IPC.runActionToRenderer)

  const listener = onMock.mock.calls[0]![1] as (event: unknown, payload: unknown) => void
  listener({}, { actionId: 'openAppSettingsDialog' })
  listener({}, { actionId: 'closeApp' })
  listener({}, { actionId: 7 })
  listener({}, null)
  listener({}, 'openAppSettingsDialog')

  expect(onAction.mock.calls).toEqual([['openAppSettingsDialog']])
})
