/**
 * True when the main window shows native macOS traffic lights over the app header.
 * Mirrors 'resolveFaMainWindowChromeOptions' (darwin gets 'titleBarStyle: hidden'); Storybook and SPA builds keep 'GlobalWindowButtons'.
 */
export function resolveFaMacNativeTitleBar (isMac: boolean, mode: string | undefined): boolean {
  return isMac && mode === 'electron'
}
