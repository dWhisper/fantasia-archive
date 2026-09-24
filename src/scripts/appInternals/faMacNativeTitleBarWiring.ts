import { Platform } from 'quasar'

import { resolveFaMacNativeTitleBar, resolveFaNativeWindowControls } from './functions/faMacNativeTitleBar'

/**
 * Reads Quasar platform detection and build mode for 'resolveFaMacNativeTitleBar'.
 */
export function isFaMacNativeTitleBar (): boolean {
  // 'Platform.is' is populated when the Quasar plugin installs; treat missing detection as non-mac.
  return resolveFaMacNativeTitleBar(Platform.is?.mac === true, process.env.MODE)
}

/**
 * Reads build mode for 'resolveFaNativeWindowControls'.
 */
export function isFaNativeWindowControls (): boolean {
  return resolveFaNativeWindowControls(process.env.MODE)
}
