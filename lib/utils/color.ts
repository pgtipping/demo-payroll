// Convert hex color to RGB values
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Verify if two colors meet WCAG 2.1 contrast requirements
 * @param foreground Foreground color in hex format (e.g., "#000000")
 * @param background Background color in hex format (e.g., "#FFFFFF")
 * @returns boolean indicating if contrast ratio meets WCAG 2.1 requirements
 */
export function verifyContrast(
  foreground: string,
  background: string
): boolean {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) {
    throw new Error("Invalid color format. Use hex colors (e.g., #000000)");
  }

  const fgLuminance = getLuminance(fg.r, fg.g, fg.b);
  const bgLuminance = getLuminance(bg.r, bg.g, bg.b);
  const ratio = getContrastRatio(fgLuminance, bgLuminance);

  // WCAG 2.1 Level AA requirements:
  // 4.5:1 for normal text
  // 3:1 for large text (18pt+) or bold text (14pt+)
  return ratio >= 4.5; // Using stricter requirement for all text
}
