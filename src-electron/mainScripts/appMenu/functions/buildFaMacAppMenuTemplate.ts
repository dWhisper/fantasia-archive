import type { I_faAppMenuTemplateItem, T_faAppMenuActionId } from 'app/types/I_faElectronRendererBridgeAPIs'

/**
 * macOS application menu: standard roles (Services, Hide, Quit, Edit, Window) plus app items that dispatch renderer actions.
 * Only 'Settings…' carries an accelerator (Cmd+,, unused by app keybinds); other app shortcuts stay in the renderer keybind
 * system so user-customized chords are never shadowed by the native menu. Labels mirror en-US 'AppControlMenus' strings.
 */
export function buildFaMacAppMenuTemplate (deps: {
  productName: string
  runAction: (actionId: T_faAppMenuActionId) => void
}): I_faAppMenuTemplateItem[] {
  const item = (label: string, actionId: T_faAppMenuActionId, accelerator?: string): I_faAppMenuTemplateItem => ({
    ...(accelerator !== undefined ? { accelerator } : {}),
    click: () => deps.runAction(actionId),
    label
  })
  const separator: I_faAppMenuTemplateItem = { type: 'separator' }

  return [
    {
      label: deps.productName,
      submenu: [
        item(`About ${deps.productName}`, 'openAboutFantasiaArchiveDialog'),
        separator,
        item('Settings…', 'openAppSettingsDialog', 'Cmd+,'),
        item('Keybind Settings…', 'openKeybindSettingsDialog'),
        separator,
        { role: 'services' },
        separator,
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        separator,
        { role: 'quit' }
      ]
    },
    { role: 'editMenu' },
    { role: 'windowMenu' },
    {
      role: 'help',
      submenu: [
        item('Advanced Search Guide', 'openAdvancedSearchGuideDialog'),
        item('Changelog', 'openChangelogDialog')
      ]
    }
  ]
}
