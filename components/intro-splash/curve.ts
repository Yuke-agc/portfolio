import * as THREE from "three";

export const CUBE_SIZE = 0.58;
export const CUBE_EFFECTIVE_RADIUS = CUBE_SIZE / 2;

type MotionSegment = {
  from: readonly [number, number, number];
  to: readonly [number, number, number];
  draw: boolean;
};

const motionSegments: readonly MotionSegment[] = [
  { from: [-2.8, 0.75, -8], to: [-2.25, 0.55, -4.6], draw: false },
  { from: [-2.25, 0.55, -4.6], to: [-1.8, 0.9, -1.4], draw: false },
  { from: [-1.8, 0.9, -1.4], to: [-1.45, 1.15, 0], draw: false },
  { from: [-1.45, 1.15, 0], to: [-0.85, 0.22, 0], draw: true },
  { from: [-0.85, 0.22, 0], to: [-0.25, 1.15, 0], draw: true },
  { from: [-0.25, 1.15, 0], to: [-0.25, 1.15, 0.42], draw: false },
  { from: [-0.25, 1.15, 0.42], to: [-0.85, 0.22, 0.42], draw: false },
  { from: [-0.85, 0.22, 0.42], to: [-0.85, 0.22, 0], draw: false },
  { from: [-0.85, 0.22, 0], to: [-0.85, -1.15, 0], draw: true },
  { from: [-0.85, -1.15, 0], to: [-0.85, -1.15, 0.48], draw: false },
  { from: [-0.85, -1.15, 0.48], to: [-0.05, 1.15, 0.48], draw: false },
  { from: [-0.05, 1.15, 0.48], to: [-0.05, 1.15, 0], draw: false },
  { from: [-0.05, 1.15, 0], to: [-0.05, -1.15, 0], draw: true },
  { from: [-0.05, -1.15, 0], to: [-0.05, -1.15, 0.42], draw: false },
  { from: [-0.05, -1.15, 0.42], to: [-0.05, 0, 0.42], draw: false },
  { from: [-0.05, 0, 0.42], to: [-0.05, 0, 0], draw: false },
  { from: [-0.05, 0, 0], to: [0.95, 1.15, 0], draw: true },
  { from: [0.95, 1.15, 0], to: [0.95, 1.15, 0.42], draw: false },
  { from: [0.95, 1.15, 0.42], to: [-0.05, 0, 0.42], draw: false },
  { from: [-0.05, 0, 0.42], to: [-0.05, 0, 0], draw: false },
  { from: [-0.05, 0, 0], to: [1, -1.15, 0], draw: true },
] as const;

export type SplashCurve = THREE.CurvePath<THREE.Vector3>;

function line(from: readonly [number, number, number], to: readonly [number, number, number]) {
  return new THREE.LineCurve3(new THREE.Vector3(...from), new THREE.Vector3(...to));
}

export function createSplashCurve(): SplashCurve {
  const curve = new THREE.CurvePath<THREE.Vector3>();
  motionSegments.forEach((segment) => curve.add(line(segment.from, segment.to)));
  return curve;
}

export function createShapeCurves(): THREE.LineCurve3[] {
  return motionSegments.filter((segment) => segment.draw).map((segment) => line(segment.from, segment.to));
}

const lengths = motionSegments.map((segment) => line(segment.from, segment.to).getLength());
const totalLength = lengths.reduce((sum, length) => sum + length, 0);
const totalDrawLength = motionSegments.reduce(
  (sum, segment, index) => sum + (segment.draw ? lengths[index] : 0), 0
);

function fractionAfterSegment(index: number) {
  return lengths.slice(0, index + 1).reduce((sum, length) => sum + length, 0) / totalLength;
}

export function getCurveLandmarks() {
  return {
    entryEnd: fractionAfterSegment(2),
    yEnd: fractionAfterSegment(8),
    kStemEnd: fractionAfterSegment(12),
    final: 1,
  };
}

export function getTrailFractionAt(u: number) {
  const distance = THREE.MathUtils.clamp(u, 0, 1) * totalLength;
  let traversed = 0;
  let drawn = 0;
  for (let index = 0; index < motionSegments.length; index += 1) {
    const segmentLength = lengths[index];
    const within = THREE.MathUtils.clamp(distance - traversed, 0, segmentLength);
    if (motionSegments[index].draw) drawn += within;
    traversed += segmentLength;
    if (distance <= traversed) break;
  }
  return drawn / totalDrawLength;
}

export function isDrawingAt(u: number) {
  const distance = THREE.MathUtils.clamp(u, 0, 1) * totalLength;
  let traversed = 0;
  for (let index = 0; index < motionSegments.length; index += 1) {
    traversed += lengths[index];
    if (distance <= traversed) return motionSegments[index].draw;
  }
  return false;
}

export const DEPTH_SCALE_RANGE = { zFar: -8, zNear: 0.5, scaleFar: 0.2, scaleNear: 1 };

export function depthScale(z: number): number {
  const { zFar, zNear, scaleFar, scaleNear } = DEPTH_SCALE_RANGE;
  const t = THREE.MathUtils.clamp((z - zFar) / (zNear - zFar), 0, 1);
  return THREE.MathUtils.lerp(scaleFar, scaleNear, t);
}
