import { nextTick, onMounted, onUnmounted, watch } from 'vue'

import { isFaMacNativeTitleBar, isFaNativeWindowControls } from 'app/src/scripts/appInternals/appInternals_manager'
import type { I_ref } from 'app/types/I_vueCompositionShims'

import { resolveFaTitleBarOverlayColors } from './functions/faTitleBarOverlayColors'

/**
 * Keeps the Windows / Linux native caption-button overlay colored like the app header.
 * Re-reads computed header colors on mount, route shell changes (welcome vs workspace), theme body attributes,
 * and head style changes (custom app / project CSS); sends only when the pair changes.
 */
export function useMainLayoutTitleBarOverlaySync (routeClass: I_ref<Record<string, boolean>>): void {
  const windowControl = window.faContentBridgeAPIs?.faWindowControl
  if (!isFaNativeWindowControls() || isFaMacNativeTitleBar() || windowControl === undefined) {
    return
  }

  let lastSentKey = ''
  let observer: MutationObserver | undefined

  const syncOverlayColors = (): void => {
    const header = document.querySelector('.appHeader')
    if (header === null) {
      return
    }
    const style = window.getComputedStyle(header)
    const colors = resolveFaTitleBarOverlayColors(style.backgroundColor, style.color)
    if (colors === null) {
      return
    }
    const key = `${colors.color}|${colors.symbolColor}`
    if (key === lastSentKey) {
      return
    }
    lastSentKey = key
    void windowControl.setTitleBarOverlayColors(colors)
  }

  onMounted(() => {
    syncOverlayColors()
    observer = new MutationObserver(syncOverlayColors)
    observer.observe(document.body, {
      attributeFilter: ['class', 'data-fa-app-theme', 'style'],
      attributes: true
    })
    observer.observe(document.head, {
      characterData: true,
      childList: true,
      subtree: true
    })
  })

  watch(routeClass, () => {
    void nextTick(syncOverlayColors)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
}
