import { expect, test } from 'vitest'

import { FA_APP_MENU_ACTION_IDS, isFaAppMenuActionId } from '../faAppMenuActionIds'

/**
 * isFaAppMenuActionId
 * Accepts every allowlisted id and nothing else.
 */
test('Test that isFaAppMenuActionId accepts only allowlisted menu actions', () => {
  for (const id of FA_APP_MENU_ACTION_IDS) {
    expect(isFaAppMenuActionId(id)).toBe(true)
  }
  expect(isFaAppMenuActionId('closeApp')).toBe(false)
  expect(isFaAppMenuActionId('toggleDeveloperTools')).toBe(false)
  expect(isFaAppMenuActionId(undefined)).toBe(false)
  expect(isFaAppMenuActionId(42)).toBe(false)
})
