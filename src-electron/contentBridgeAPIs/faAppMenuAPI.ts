import { ipcRenderer } from 'electron'

import { FA_APP_MENU_IPC } from 'app/src-electron/electron-ipc-bridge'
import { isFaAppMenuActionId } from 'app/src-electron/shared/faAppMenuActionIds'
import type { I_faAppMenuAPI } from 'app/types/I_faElectronRendererBridgeAPIs'

let appMenuListenerInstalled = false

/**
 * Delivers native application menu clicks (macOS) to the renderer; drops payloads outside the action allowlist.
 */
export const faAppMenuAPI: I_faAppMenuAPI = {
  installActionListener (onAction) {
    if (appMenuListenerInstalled) {
      return
    }
    appMenuListenerInstalled = true
    ipcRenderer.on(FA_APP_MENU_IPC.runActionToRenderer, (_event, payload: unknown) => {
      if (typeof payload !== 'object' || payload === null) {
        return
      }
      const actionId = (payload as { actionId?: unknown }).actionId
      if (!isFaAppMenuActionId(actionId)) {
        return
      }
      onAction(actionId)
    })
  }
}
