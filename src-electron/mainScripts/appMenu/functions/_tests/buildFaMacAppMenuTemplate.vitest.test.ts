import { expect, test, vi } from 'vitest'

import type { I_faAppMenuTemplateItem } from 'app/types/I_faElectronRendererBridgeAPIs'

import { buildFaMacAppMenuTemplate } from '../buildFaMacAppMenuTemplate'

function build () {
  const runAction = vi.fn()
  const template = buildFaMacAppMenuTemplate({
    productName: 'Fantasia Archive',
    runAction
  })
  return {
    runAction,
    template
  }
}

function clickLabel (items: I_faAppMenuTemplateItem[], label: string): void {
  const found = items.find((i) => i.label === label)
  expect(found).toBeDefined()
  found!.click!()
}

/**
 * buildFaMacAppMenuTemplate
 * Top level: app menu, standard Edit and Window roles, Help.
 */
test('Test that buildFaMacAppMenuTemplate lays out app, edit, window, and help menus', () => {
  const { template } = build()

  expect(template.map((m) => m.label ?? m.role)).toEqual(['Fantasia Archive', 'editMenu', 'windowMenu', 'help'])
  expect(template[0]!.submenu!.filter((i) => i.role !== undefined).map((i) => i.role)).toEqual([
    'services',
    'hide',
    'hideOthers',
    'unhide',
    'quit'
  ])
})

/**
 * buildFaMacAppMenuTemplate
 * App items dispatch their renderer actions; only Settings has an accelerator.
 */
test('Test that buildFaMacAppMenuTemplate app items dispatch actions with Cmd+, on Settings only', () => {
  const { runAction, template } = build()
  const appSubmenu = template[0]!.submenu!
  const helpSubmenu = template[3]!.submenu!

  clickLabel(appSubmenu, 'About Fantasia Archive')
  clickLabel(appSubmenu, 'Settings…')
  clickLabel(appSubmenu, 'Keybind Settings…')
  clickLabel(helpSubmenu, 'Advanced Search Guide')
  clickLabel(helpSubmenu, 'Changelog')

  expect(runAction.mock.calls.map((c) => c[0]!)).toEqual([
    'openAboutFantasiaArchiveDialog',
    'openAppSettingsDialog',
    'openKeybindSettingsDialog',
    'openAdvancedSearchGuideDialog',
    'openChangelogDialog'
  ])
  const withAccelerators = [...appSubmenu, ...helpSubmenu].filter((i) => i.accelerator !== undefined)
  expect(withAccelerators.map((i) => [i.label, i.accelerator])).toEqual([['Settings…', 'Cmd+,']])
})
