import { forwardRef, useImperativeHandle, useMemo } from "react";
import * as THREE from "three";
import { BRAND_STROKE_WIDTH } from "@/lib/brand-mark";

const TUBULAR_SEGMENTS = 384;
const RADIAL_SEGMENTS = 8;

export type TrailPathHandle = { setReveal: (fraction: number) => void };

type TrailPathProps = { curves: readonly THREE.Curve<THREE.Vector3>[] };
type GeometryPair = { core: THREE.TubeGeometry; halo: THREE.TubeGeometry; length: number };

function tube(curve: THREE.Curve<THREE.Vector3>, radius: number) {
  const geometry = new THREE.TubeGeometry(curve, TUBULAR_SEGMENTS, radius, RADIAL_SEGMENTS, false);
  geometry.setDrawRange(0, 0);
  return geometry;
}

export const TrailPath = forwardRef<TrailPathHandle, TrailPathProps>(
  function TrailPath({ curves }, ref) {
    const pairs = useMemo<GeometryPair[]>(
      () => curves.map((curve) => ({ core: tube(curve, BRAND_STROKE_WIDTH * 0.026 / 2), halo: tube(curve, 0.08), length: curve.getLength() })),
      [curves]
    );
    const totalLength = useMemo(() => pairs.reduce((sum, pair) => sum + pair.length, 0), [pairs]);

    useImperativeHandle(ref, () => ({
      setReveal(fraction: number) {
        let remaining = THREE.MathUtils.clamp(fraction, 0, 1) * totalLength;
        pairs.forEach((pair) => {
          const local = THREE.MathUtils.clamp(remaining / pair.length, 0, 1);
          const count = Math.floor(local * TUBULAR_SEGMENTS) * RADIAL_SEGMENTS * 6;
          pair.core.setDrawRange(0, count);
          pair.halo.setDrawRange(0, count);
          remaining -= pair.length;
        });
      },
    }), [pairs, totalLength]);

    return (
      <group>
        {pairs.map((pair, index) => (
          <group key={index}>
            <mesh geometry={pair.halo}>
              <meshBasicMaterial color="#d9a566" transparent opacity={0.12} depthWrite={false} />
            </mesh>
            <mesh geometry={pair.core}>
              <meshStandardMaterial color="#e7bd83" emissive="#9f6d36" emissiveIntensity={0.42} roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }
);
