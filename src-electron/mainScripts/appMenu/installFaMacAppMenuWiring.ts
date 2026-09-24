import { BrowserWindow, Menu } from 'electron'
import type { MenuItemConstructorOptions } from 'electron'

import packageJSON from '../../../package.json' with { type: 'json' }

import { FA_APP_MENU_IPC } from 'app/src-electron/electron-ipc-bridge'
import type { T_faAppMenuActionId } from 'app/types/I_faElectronRendererBridgeAPIs'

import { buildFaMacAppMenuTemplate } from './functions/buildFaMacAppMenuTemplate'

function sendFaAppMenuActionToRenderer (actionId: T_faAppMenuActionId): void {
  const target = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
  target?.webContents.send(FA_APP_MENU_IPC.runActionToRenderer, { actionId })
}

/**
 * Installs the native macOS application menu (standard roles keep Cmd+C / V / Z / Q / H / M working).
 * Other platforms keep the in-app menus only, so this is a no-op there ('tweakMenuRemover' already cleared the menu).
 */
export function installFaMacAppMenu (platform: string): void {
  if (platform !== 'darwin') {
    return
  }
  const template = buildFaMacAppMenuTemplate({
    productName: packageJSON.productName,
    runAction: sendFaAppMenuActionToRenderer
  })
  // Pure template uses a structural subset of 'MenuItemConstructorOptions' (role typed as string).
  Menu.setApplicationMenu(Menu.buildFromTemplate(template as MenuItemConstructorOptions[]))
}
