import { runFaAction } from 'app/src/scripts/actionManager/faActionManagerRun_manager'

import { createRunFaAppMenuBoot } from './functions/createRunFaAppMenuBoot'

export const runFaAppMenuBoot = createRunFaAppMenuBoot({
  getAppMenuBridge: () => window.faContentBridgeAPIs?.faAppMenu,
  getMode: () => process.env.MODE,
  runFaAction: (id, payload) => {
    runFaAction(id, payload)
  }
})
