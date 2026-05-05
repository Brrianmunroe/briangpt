/** 16×16 SVG viewBox — matches Figma icon frame. */
export const ICON_FRAME_SIZE = 16;

/**
 * Places path geometry (tight bbox in path space) into a centered rectangle of
 * `displayWidth` × `displayHeight` inside the 16×16 frame.
 */
export function iconFitToDisplayRect(
  viewBoxX: number,
  viewBoxY: number,
  viewBoxWidth: number,
  viewBoxHeight: number,
  displayWidth: number,
  displayHeight: number
): string {
  const sx = displayWidth / viewBoxWidth;
  const sy = displayHeight / viewBoxHeight;
  const tx = (ICON_FRAME_SIZE - displayWidth) / 2;
  const ty = (ICON_FRAME_SIZE - displayHeight) / 2;
  return `translate(${tx} ${ty}) scale(${sx} ${sy}) translate(${-viewBoxX} ${-viewBoxY})`;
}
