import * as THREE from "three";

/** 一筆書きのYK。先頭3点は奥から近づく助走で、P3以降が発光する軌跡。 */
export const SPLASH_CURVE_POINTS: readonly [number, number, number][] = [
  [-2.8, 0.9, -8],
  [-2.25, 0.65, -4.5],
  [-1.95, 1.15, -1.5],
  [-1.75, 1.35, 0],
  [-1.05, 0.35, 0],
  [-0.35, 1.35, 0],
  [-1.05, 0.35, 0],
  [-1.05, -1.35, 0],
  [-0.35, -1.35, 0.02],
  [-0.35, 1.35, 0],
  [-0.35, 0, 0],
  [0.95, 1.35, 0],
  [-0.35, 0, 0],
  [1.05, -1.35, 0.06],
] as const;

const ENTRY_END_INDEX = 3;
const ARC_MID_INDEX = 7;
const ARC_LATE_INDEX = 11;

export type SplashCurve = THREE.CurvePath<THREE.Vector3>;

function makePolyline(points: readonly [number, number, number][]): SplashCurve {
  const curve = new THREE.CurvePath<THREE.Vector3>();
  const vectors = points.map(([x, y, z]) => new THREE.Vector3(x, y, z));
  for (let index = 1; index < vectors.length; index += 1) {
    curve.add(new THREE.LineCurve3(vectors[index - 1], vectors[index]));
  }
  return curve;
}

function fractionAt(index: number) {
  const lengths = SPLASH_CURVE_POINTS.slice(1).map((point, pointIndex) => {
    const previous = SPLASH_CURVE_POINTS[pointIndex];
    return new THREE.Vector3(...point).distanceTo(new THREE.Vector3(...previous));
  });
  const total = lengths.reduce((sum, length) => sum + length, 0);
  return lengths.slice(0, index).reduce((sum, length) => sum + length, 0) / total;
}

export function getCurveLandmarks() {
  return {
    entryEnd: fractionAt(ENTRY_END_INDEX),
    arcMid: fractionAt(ARC_MID_INDEX),
    arcLate: fractionAt(ARC_LATE_INDEX),
    final: 1,
  };
}

export const TRAIL_END_U = 1;
export const CUBE_SIZE = 0.62;
export const CUBE_EFFECTIVE_RADIUS = CUBE_SIZE / 2;

export const DEPTH_SCALE_RANGE = {
  zFar: -8,
  zNear: 0.35,
  scaleFar: 0.22,
  scaleNear: 1,
};

export function createSplashCurve(): SplashCurve {
  return makePolyline(SPLASH_CURVE_POINTS);
}

export function createShapeCurve(): SplashCurve {
  return makePolyline(SPLASH_CURVE_POINTS.slice(ENTRY_END_INDEX));
}

export function depthScale(z: number): number {
  const { zFar, zNear, scaleFar, scaleNear } = DEPTH_SCALE_RANGE;
  const t = THREE.MathUtils.clamp((z - zFar) / (zNear - zFar), 0, 1);
  return THREE.MathUtils.lerp(scaleFar, scaleNear, t);
}
