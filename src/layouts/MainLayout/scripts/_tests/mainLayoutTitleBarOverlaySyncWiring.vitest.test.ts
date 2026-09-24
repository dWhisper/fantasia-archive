import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { useMainLayoutTitleBarOverlaySync } from '../mainLayoutTitleBarOverlaySyncWiring'

const platformMocks = vi.hoisted(() => ({
  isFaMacNativeTitleBar: vi.fn(() => false),
  isFaNativeWindowControls: vi.fn(() => true)
}))

vi.mock('app/src/scripts/appInternals/appInternals_manager', () => platformMocks)

const setTitleBarOverlayColors = vi.fn(async () => undefined)
const originalBridge = window.faContentBridgeAPIs

function mountSync (headerStyle: string | null, routeClass = ref<Record<string, boolean>>({ welcome: true })) {
  const Host = defineComponent({
    setup () {
      useMainLayoutTitleBarOverlaySync(routeClass)
      return { headerStyle }
    },
    template: '<div><div v-if="headerStyle !== null" class="appHeader" :style="headerStyle" /></div>'
  })
  return {
    routeClass,
    wrapper: mount(Host, { attachTo: document.body })
  }
}

beforeEach(() => {
  platformMocks.isFaMacNativeTitleBar.mockReturnValue(false)
  platformMocks.isFaNativeWindowControls.mockReturnValue(true)
  setTitleBarOverlayColors.mockClear()
  window.faContentBridgeAPIs = {
    ...originalBridge,
    faWindowControl: { setTitleBarOverlayColors }
  } as unknown as typeof window.faContentBridgeAPIs
})

afterEach(() => {
  window.faContentBridgeAPIs = originalBridge
  document.body.className = ''
})

/**
 * useMainLayoutTitleBarOverlaySync
 * Sends header colors on mount and again only when they change.
 */
test('Test that overlay sync sends header colors on mount and skips unchanged pairs', async () => {
  const { routeClass, wrapper } = mountSync('background-color: rgb(24, 62, 77); color: rgb(245, 245, 245);')
  expect(setTitleBarOverlayColors).toHaveBeenCalledTimes(1)
  expect(setTitleBarOverlayColors).toHaveBeenCalledWith({
    color: '#183e4d',
    symbolColor: '#f5f5f5'
  })

  routeClass.value = { workspace: true }
  await nextTick()
  await nextTick()
  expect(setTitleBarOverlayColors).toHaveBeenCalledTimes(1)

  const header = wrapper.element.querySelector('.appHeader') as HTMLElement
  header.style.backgroundColor = 'rgb(27, 51, 62)'
  document.body.className = 'fa-appTheme--flat'
  await vi.waitFor(() => {
    expect(setTitleBarOverlayColors).toHaveBeenCalledTimes(2)
  })
  expect(setTitleBarOverlayColors).toHaveBeenLastCalledWith({
    color: '#1b333e',
    symbolColor: '#f5f5f5'
  })

  wrapper.unmount()
})

/**
 * useMainLayoutTitleBarOverlaySync
 * Missing header or unreadable colors never reach the bridge.
 */
test('Test that overlay sync ignores a missing header and unparseable colors', () => {
  mountSync(null).wrapper.unmount()
  mountSync('background-color: transparent; color: rgb(245, 245, 245);').wrapper.unmount()

  expect(setTitleBarOverlayColors).not.toHaveBeenCalled()
})

/**
 * useMainLayoutTitleBarOverlaySync
 * No-op outside Electron, on macOS (traffic lights, no overlay), or without the window-control bridge.
 */
test('Test that overlay sync is inactive outside Windows / Linux Electron with a bridge', () => {
  const style = 'background-color: rgb(24, 62, 77); color: rgb(245, 245, 245);'

  platformMocks.isFaNativeWindowControls.mockReturnValue(false)
  mountSync(style).wrapper.unmount()

  platformMocks.isFaNativeWindowControls.mockReturnValue(true)
  platformMocks.isFaMacNativeTitleBar.mockReturnValue(true)
  mountSync(style).wrapper.unmount()

  platformMocks.isFaMacNativeTitleBar.mockReturnValue(false)
  window.faContentBridgeAPIs = {} as unknown as typeof window.faContentBridgeAPIs
  mountSync(style).wrapper.unmount()

  expect(setTitleBarOverlayColors).not.toHaveBeenCalled()
})
