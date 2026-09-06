export type BrandPoint = readonly [number, number];

export type BrandCurve = {
  from: BrandPoint;
  control1: BrandPoint;
  control2: BrandPoint;
  to: BrandPoint;
};

/** YからKまでペンを離さずに描く、共通の筆記体ベジェ曲線。 */
export const BRAND_CURVES: readonly BrandCurve[] = [
  { from: [7, 17], control1: [14, 25], control2: [24, 40], to: [31, 48] },
  { from: [31, 48], control1: [39, 38], control2: [46, 24], to: [53, 14] },
  { from: [53, 14], control1: [45, 38], control2: [34, 68], to: [27, 86] },
  { from: [27, 86], control1: [38, 81], control2: [50, 84], to: [61, 86] },
  { from: [61, 86], control1: [59, 64], control2: [60, 35], to: [61, 14] },
  { from: [61, 14], control1: [62, 31], control2: [62, 44], to: [61, 52] },
  { from: [61, 52], control1: [72, 39], control2: [82, 25], to: [92, 14] },
  { from: [92, 14], control1: [82, 30], control2: [71, 44], to: [61, 52] },
  { from: [61, 52], control1: [72, 62], control2: [84, 76], to: [95, 86] },
] as const;

export function brandPath() {
  const [first, ...rest] = BRAND_CURVES;
  return [
    `M${first.from[0]} ${first.from[1]}`,
    `C${first.control1[0]} ${first.control1[1]} ${first.control2[0]} ${first.control2[1]} ${first.to[0]} ${first.to[1]}`,
    ...rest.map(({ control1, control2, to }) =>
      `C${control1[0]} ${control1[1]} ${control2[0]} ${control2[1]} ${to[0]} ${to[1]}`
    ),
  ].join(" ");
}
