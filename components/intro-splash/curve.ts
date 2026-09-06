import * as THREE from "three";
import { BRAND_CURVES, type BrandPoint } from "@/lib/brand-mark";

export const CUBE_SIZE = 0.58;
export type SplashCurve = THREE.CurvePath<THREE.Vector3>;

function worldPoint([x, y]: BrandPoint, z = 0) {
  return new THREE.Vector3((x - 50) * 0.026, (50 - y) * 0.026, z);
}

function makeBrandCurve() {
  const curve = new THREE.CurvePath<THREE.Vector3>();
  BRAND_CURVES.forEach(({ from, control1, control2, to }) => {
    curve.add(new THREE.CubicBezierCurve3(
      worldPoint(from),
      worldPoint(control1),
      worldPoint(control2),
      worldPoint(to)
    ));
  });
  return curve;
}

const brandCurve = makeBrandCurve();
const brandLength = brandCurve.getLength();
const firstPoint = worldPoint(BRAND_CURVES[0].from);
const approachPoints = [
  new THREE.Vector3(-2.7, 0.72, -8),
  new THREE.Vector3(-2.2, 0.55, -4.6),
  new THREE.Vector3(-1.65, 0.82, -1.35),
  firstPoint,
];
const approachLengths = approachPoints.slice(1).map((point, index) => point.distanceTo(approachPoints[index]));
const approachLength = approachLengths.reduce((sum, length) => sum + length, 0);
const totalLength = approachLength + brandLength;

export function createSplashCurve(): SplashCurve {
  const curve = new THREE.CurvePath<THREE.Vector3>();
  approachPoints.slice(1).forEach((point, index) => {
    curve.add(new THREE.LineCurve3(approachPoints[index], point));
  });
  BRAND_CURVES.forEach(({ from, control1, control2, to }) => {
    curve.add(new THREE.CubicBezierCurve3(
      worldPoint(from), worldPoint(control1), worldPoint(control2), worldPoint(to)
    ));
  });
  return curve;
}

export function createShapeCurves(): SplashCurve[] {
  return [makeBrandCurve()];
}

function shapeFractionAfter(curveIndex: number) {
  const partial = brandCurve.curves
    .slice(0, curveIndex + 1)
    .reduce((sum, curve) => sum + curve.getLength(), 0);
  return (approachLength + partial) / totalLength;
}

export function getCurveLandmarks() {
  return {
    entryEnd: approachLength / totalLength,
    yEnd: shapeFractionAfter(3),
    kStemEnd: shapeFractionAfter(5),
    final: 1,
  };
}

export function getTrailFractionAt(u: number) {
  return THREE.MathUtils.clamp((u * totalLength - approachLength) / brandLength, 0, 1);
}

export function isDrawingAt(u: number) {
  return u >= approachLength / totalLength;
}

export const DEPTH_SCALE_RANGE = { zFar: -8, zNear: 0.5, scaleFar: 0.2, scaleNear: 1 };

export function depthScale(z: number): number {
  const { zFar, zNear, scaleFar, scaleNear } = DEPTH_SCALE_RANGE;
  const t = THREE.MathUtils.clamp((z - zFar) / (zNear - zFar), 0, 1);
  return THREE.MathUtils.lerp(scaleFar, scaleNear, t);
}
