import type { I_faAppMenuAPI, T_faAppMenuActionId } from 'app/types/I_faElectronRendererBridgeAPIs'

/**
 * Electron only: routes native application menu clicks (macOS) to the same 'runFaAction' ids the in-app menus use.
 */
export function createRunFaAppMenuBoot (deps: {
  getAppMenuBridge: () => I_faAppMenuAPI | undefined
  getMode: () => string | undefined
  runFaAction: (id: T_faAppMenuActionId, payload: undefined) => void
}): () => void {
  return function runFaAppMenuBoot (): void {
    if (deps.getMode() !== 'electron') {
      return
    }
    const bridge = deps.getAppMenuBridge()
    if (bridge === undefined) {
      return
    }
    bridge.installActionListener((actionId) => {
      deps.runFaAction(actionId, undefined)
    })
  }
}
