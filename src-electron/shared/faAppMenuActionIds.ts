import type { T_faAppMenuActionId } from 'app/types/I_faElectronRendererBridgeAPIs'

/**
 * Allowlist for native application menu to renderer action dispatch; preload drops anything else.
 */
export const FA_APP_MENU_ACTION_IDS: readonly T_faAppMenuActionId[] = [
  'openAboutFantasiaArchiveDialog',
  'openAdvancedSearchGuideDialog',
  'openAppSettingsDialog',
  'openChangelogDialog',
  'openKeybindSettingsDialog'
]

export function isFaAppMenuActionId (value: unknown): value is T_faAppMenuActionId {
  return typeof value === 'string' && (FA_APP_MENU_ACTION_IDS as readonly string[]).includes(value)
}
