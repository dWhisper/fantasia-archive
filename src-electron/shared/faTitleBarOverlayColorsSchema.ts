import { z } from 'zod'

const faTitleBarOverlayHexColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/)

/**
 * Renderer to main payload for Windows / Linux caption-button overlay colors ('setTitleBarOverlay').
 * Strict '#RRGGBB' only; the renderer converts computed header colors before sending.
 */
export const faTitleBarOverlayColorsSchema = z.object({
  color: faTitleBarOverlayHexColorSchema,
  symbolColor: faTitleBarOverlayHexColorSchema
}).strict()
