import { beforeEach, expect, test, vi } from 'vitest'

import { FA_APP_MENU_IPC } from 'app/src-electron/electron-ipc-bridge'
import type { I_faAppMenuTemplateItem } from 'app/types/I_faElectronRendererBridgeAPIs'

const mocks = vi.hoisted(() => ({
  buildFromTemplate: vi.fn((template: unknown) => ({ template })),
  getAllWindows: vi.fn((): unknown[] => []),
  getFocusedWindow: vi.fn((): unknown => null),
  setApplicationMenu: vi.fn()
}))

vi.mock('electron', () => ({
  BrowserWindow: {
    getAllWindows: mocks.getAllWindows,
    getFocusedWindow: mocks.getFocusedWindow
  },
  Menu: {
    buildFromTemplate: mocks.buildFromTemplate,
    setApplicationMenu: mocks.setApplicationMenu
  }
}))

import { installFaMacAppMenu } from '../installFaMacAppMenuWiring'

function installedTemplate (): I_faAppMenuTemplateItem[] {
  return mocks.buildFromTemplate.mock.calls[0]![0] as I_faAppMenuTemplateItem[]
}

function clickSettings (): void {
  installedTemplate()[0]!.submenu!.find((i) => i.label === 'Settings…')!.click!()
}

beforeEach(() => {
  mocks.buildFromTemplate.mockClear()
  mocks.setApplicationMenu.mockClear()
  mocks.getFocusedWindow.mockReset()
  mocks.getFocusedWindow.mockReturnValue(null)
  mocks.getAllWindows.mockReset()
  mocks.getAllWindows.mockReturnValue([])
})

/**
 * installFaMacAppMenu
 * Other platforms keep only the in-app menus.
 */
test('Test that installFaMacAppMenu is a no-op off macOS', () => {
  installFaMacAppMenu('win32')
  installFaMacAppMenu('linux')

  expect(mocks.setApplicationMenu).not.toHaveBeenCalled()
})

/**
 * installFaMacAppMenu
 * macOS installs the built menu titled with the product name.
 */
test('Test that installFaMacAppMenu installs the product-named menu on macOS', () => {
  installFaMacAppMenu('darwin')

  expect(installedTemplate()[0]!.label).toBe('Fantasia Archive')
  expect(mocks.setApplicationMenu).toHaveBeenCalledWith(mocks.buildFromTemplate.mock.results[0]!.value)
})

/**
 * installFaMacAppMenu
 * Menu clicks go to the focused window, else the first window, else nowhere.
 */
test('Test that installFaMacAppMenu sends menu actions to the focused or first window', () => {
  installFaMacAppMenu('darwin')
  const focusedSend = vi.fn()
  const firstSend = vi.fn()

  mocks.getFocusedWindow.mockReturnValue({ webContents: { send: focusedSend } })
  clickSettings()
  expect(focusedSend).toHaveBeenCalledWith(FA_APP_MENU_IPC.runActionToRenderer, { actionId: 'openAppSettingsDialog' })

  mocks.getFocusedWindow.mockReturnValue(null)
  mocks.getAllWindows.mockReturnValue([{ webContents: { send: firstSend } }])
  clickSettings()
  expect(firstSend).toHaveBeenCalledTimes(1)

  mocks.getAllWindows.mockReturnValue([])
  expect(() => clickSettings()).not.toThrow()
})
