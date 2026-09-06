export type BrandPoint = readonly [number, number];

/** スプラッシュ、キューブ面、Heroで共有するYKの線座標。 */
export const BRAND_STROKES: readonly (readonly BrandPoint[])[] = [
  [[6, 12], [28, 44]],
  [[50, 12], [28, 44]],
  [[28, 44], [28, 88]],
  [[62, 12], [62, 88]],
  [[62, 50], [92, 12]],
  [[62, 50], [94, 88]],
] as const;

export function brandStrokePath(points: readonly BrandPoint[]) {
  return points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`).join(" ");
}
