import * as THREE from "three";
import { BRAND_STROKES, type BrandPoint } from "@/lib/brand-mark";

export const CUBE_SIZE = 0.58;

type MotionSegment = {
  from: readonly [number, number, number];
  to: readonly [number, number, number];
  draw: boolean;
  strokeIndex?: number;
};

function worldPoint([x, y]: BrandPoint, z = 0): readonly [number, number, number] {
  return [(x - 50) * 0.026, (50 - y) * 0.026, z];
}

function samePoint(a: readonly number[], b: readonly number[]) {
  return a.every((value, index) => value === b[index]);
}

function buildMotionSegments(): MotionSegment[] {
  const first = worldPoint(BRAND_STROKES[0][0]);
  const segments: MotionSegment[] = [
    { from: [-2.7, 0.72, -8], to: [-2.2, 0.55, -4.6], draw: false },
    { from: [-2.2, 0.55, -4.6], to: [-1.65, 0.82, -1.35], draw: false },
    { from: [-1.65, 0.82, -1.35], to: first, draw: false },
  ];
  let current = first;

  BRAND_STROKES.forEach((stroke, strokeIndex) => {
    const start = worldPoint(stroke[0]);
    if (!samePoint(current, start)) {
      const liftFrom = [current[0], current[1], 0.44] as const;
      const liftTo = [start[0], start[1], 0.44] as const;
      segments.push(
        { from: current, to: liftFrom, draw: false },
        { from: liftFrom, to: liftTo, draw: false },
        { from: liftTo, to: start, draw: false }
      );
      current = start;
    }
    for (let index = 1; index < stroke.length; index += 1) {
      const end = worldPoint(stroke[index]);
      segments.push({ from: current, to: end, draw: true, strokeIndex });
      current = end;
    }
  });
  return segments;
}

const motionSegments = buildMotionSegments();
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
const totalDrawLength = motionSegments.reduce((sum, segment, index) => sum + (segment.draw ? lengths[index] : 0), 0);

function fractionAfter(predicate: (segment: MotionSegment) => boolean) {
  let last = 0;
  motionSegments.forEach((segment, index) => { if (predicate(segment)) last = index; });
  return lengths.slice(0, last + 1).reduce((sum, length) => sum + length, 0) / totalLength;
}

export function getCurveLandmarks() {
  return {
    entryEnd: lengths.slice(0, 3).reduce((sum, length) => sum + length, 0) / totalLength,
    yEnd: fractionAfter((segment) => segment.strokeIndex === 2),
    kStemEnd: fractionAfter((segment) => segment.strokeIndex === 3),
    final: 1,
  };
}

export function getTrailFractionAt(u: number) {
  const distance = THREE.MathUtils.clamp(u, 0, 1) * totalLength;
  let traversed = 0;
  let drawn = 0;
  for (let index = 0; index < motionSegments.length; index += 1) {
    const within = THREE.MathUtils.clamp(distance - traversed, 0, lengths[index]);
    if (motionSegments[index].draw) drawn += within;
    traversed += lengths[index];
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
