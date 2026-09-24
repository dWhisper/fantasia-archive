/**
 * True when the main window uses native OS window controls instead of 'GlobalWindowButtons'.
 * Every Electron build does ('resolveFaMainWindowChromeOptions': macOS traffic lights, Windows / Linux caption overlay);
 * Storybook and SPA builds keep the custom buttons.
 */
export function resolveFaNativeWindowControls (mode: string | undefined): boolean {
  return mode === 'electron'
}

/**
 * True when the main window shows native macOS traffic lights over the app header (left inset needed).
 * Mirrors 'resolveFaMainWindowChromeOptions' darwin branch.
 */
export function resolveFaMacNativeTitleBar (isMac: boolean, mode: string | undefined): boolean {
  return isMac && resolveFaNativeWindowControls(mode)
}
