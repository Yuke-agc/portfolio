import * as THREE from "three";

/**
 * 立方体が転がる経路の制御点。
 *
 * P0-P2: 出現直後の助走区間（画面奥、まだ軌跡は表示しない）
 * P3-P10: 半径 SHAPE_RADIUS の円をほぼ一周（右側 30°〜150° 相当を飛ばして
 *         「切れ目」を作る＝Gの開口部）
 * P11-P12: 開口部の端から中心へ折れ込む「Gの横棒」。P12 が立方体の最終静止位置
 *
 * u（0〜1）は CatmullRomCurve3.getPointAt が返す弧長ベースのパラメータで、
 * 制御点のインデックスとは非線形の対応になる（→ getCurveLandmarks 参照）。
 */
export const SPLASH_CURVE_POINTS: readonly [number, number, number][] = [
  [0.0, 0.3, -8.0], // P0 spawn
  [0.6, 0.55, -5.2], // P1 助走
  [1.1, 0.35, -2.4], // P2 助走
  [0.0, 1.6, 0.0], // P3 12時（ここから軌跡ON）
  [-0.8, 1.39, 0.05], // P4 10時
  [-1.39, 0.8, 0.1], // P5 8時
  [-1.6, 0.0, 0.1], // P6 9時
  [-1.39, -0.8, 0.05], // P7 7時
  [-0.8, -1.39, 0.0], // P8 5時
  [0.0, -1.6, 0.0], // P9 6時
  [0.8, -1.39, 0.05], // P10 4時（このあと右側の切れ目に入り、円弧を止める）
  [0.55, -0.6, 0.25], // P11 中心へ折れ込み開始
  [0.0, 0.0, 0.35], // P12 中心＝最終静止位置
] as const;

/**
 * 制御点インデックス → 弧長ベースの u (0-1) への対応表。
 *
 * 出現位置(z=-8)から円の描き始め(P3)までの助走区間は、単純な直線距離だけでも
 * 円周部分と同程度の弧長を持ちうるため、「u の何割が助走で何割が形状か」を
 * 決め打ちで見積もると大きくずれる。実際に CatmullRomCurve3 の弧長テーブル
 * (getLengths) から各制御点に対応する u を逆算し、タイムラインの各区間の
 * 目標値として使う。
 */
export type CurveLandmarks = {
  /** P3（円の描き始め）に対応する u。ここから軌跡を見せ始める */
  entryEnd: number;
  /** P6（9時）付近に対応する u */
  arcMid: number;
  /** P10（4時、切れ目の手前）付近に対応する u */
  arcLate: number;
  /** 最終点（中心）= 1 */
  final: number;
};

const ENTRY_END_INDEX = 3;
const ARC_MID_INDEX = 6;
const ARC_LATE_INDEX = 10;

function getUAtControlPoint(
  curve: THREE.CatmullRomCurve3,
  index: number,
  samples = 2000
): number {
  const t = index / (SPLASH_CURVE_POINTS.length - 1);
  const lengths = curve.getLengths(samples);
  const k = Math.round(t * samples);
  return lengths[k] / lengths[samples];
}

export function getCurveLandmarks(curve: THREE.CatmullRomCurve3): CurveLandmarks {
  return {
    entryEnd: getUAtControlPoint(curve, ENTRY_END_INDEX),
    arcMid: getUAtControlPoint(curve, ARC_MID_INDEX),
    arcLate: getUAtControlPoint(curve, ARC_LATE_INDEX),
    final: 1,
  };
}

/** 軌跡が完全に描き切られる位置（=最終点） */
export const TRAIL_END_U = 1;

/** 立方体の一辺の長さ */
export const CUBE_SIZE = 0.62;
/** 転がり運動の回転角を「移動距離 / 半径」で導出するための実効半径 */
export const CUBE_EFFECTIVE_RADIUS = CUBE_SIZE / 2;

/** 奥行きに応じた縮尺のレンジ（z=Z_FAR で最も小さく、z=Z_NEAR で等身大） */
export const DEPTH_SCALE_RANGE = {
  zFar: -8,
  zNear: 0.35,
  scaleFar: 0.22,
  scaleNear: 1,
};

export function createSplashCurve(): THREE.CatmullRomCurve3 {
  const points = SPLASH_CURVE_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z));
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
}

/**
 * TrailPath 専用。P3(円の描き始め)〜P12(中心)だけを繋いだ別カーブを用意する。
 * TubeGeometry の弧長 0 は「このカーブの始点」になるため、setDrawRange(0, …) が
 * 助走区間ではなく必ず P3 から revealed していく（＝立方体が実際に軌跡を
 * 描き始める位置と一致する）。
 */
export function createShapeCurve(): THREE.CatmullRomCurve3 {
  const points = SPLASH_CURVE_POINTS.slice(ENTRY_END_INDEX).map(
    ([x, y, z]) => new THREE.Vector3(x, y, z)
  );
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
}

export function depthScale(z: number): number {
  const { zFar, zNear, scaleFar, scaleNear } = DEPTH_SCALE_RANGE;
  const t = THREE.MathUtils.clamp((z - zFar) / (zNear - zFar), 0, 1);
  return THREE.MathUtils.lerp(scaleFar, scaleNear, t);
}
