export type BrandPoint = readonly [number, number];
export const BRAND_STROKE_WIDTH = 4.5;

export type BrandCurve = {
  from: BrandPoint;
  control1: BrandPoint;
  control2: BrandPoint;
  to: BrandPoint;
};

/** YからKまでペンを離さずに描く、共通の筆記体ベジェ曲線。 */
export const BRAND_CURVES: readonly BrandCurve[] = [
  { from: [8, 20], control1: [15, 44], control2: [24, 57], to: [34, 44] },
  { from: [34, 44], control1: [42, 34], control2: [48, 23], to: [53, 14] },
  { from: [53, 14], control1: [45, 40], control2: [35, 73], to: [22, 85] },
  { from: [22, 85], control1: [3, 99], control2: [8, 52], to: [58, 65] },
  { from: [58, 65], control1: [65, 48], control2: [68, 27], to: [72, 14] },
  { from: [72, 14], control1: [70, 36], control2: [62, 66], to: [58, 84] },
  { from: [58, 84], control1: [62, 56], control2: [80, 29], to: [93, 20] },
  { from: [93, 20], control1: [101, 15], control2: [92, 44], to: [65, 53] },
  { from: [65, 53], control1: [71, 65], control2: [82, 83], to: [95, 83] },
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
