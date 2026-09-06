import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";

const TUBULAR_SEGMENTS = 300;
const RADIAL_SEGMENTS = 8;
const CORE_RADIUS = 0.032;
const HALO_RADIUS = 0.075;

export type TrailPathHandle = {
  /** 0〜1。通過済み区間（=軌跡として見せてよい割合）を反映する */
  setReveal: (fraction: number) => void;
};

type TrailPathProps = {
  curve: THREE.Curve<THREE.Vector3>;
};

function buildTubeGeometry(curve: THREE.Curve<THREE.Vector3>, radius: number) {
  const geometry = new THREE.TubeGeometry(
    curve,
    TUBULAR_SEGMENTS,
    radius,
    RADIAL_SEGMENTS,
    false
  );
  geometry.setDrawRange(0, 0);
  return geometry;
}

/**
 * 立方体が通過した区間だけを描画する軌跡。ジオメトリは一度だけ生成し、
 * 毎フレーム geometry.setDrawRange() で表示範囲を更新するだけにすることで
 * 再生成コストをゼロにする。
 *
 * 「中心が明るく外側が弱いグローを持つ、薄い立体的なライン」を、カスタム
 * シェーダーを書かずに表現するため、細く明るいコア用チューブと、太く
 * 不透明度の低いハロー用チューブを重ねている。外側の柔らかい光は
 * BloomEffect が追加で担う。
 */
export const TrailPath = forwardRef<TrailPathHandle, TrailPathProps>(
  function TrailPath({ curve }, ref) {
    const coreGeometry = useMemo(() => buildTubeGeometry(curve, CORE_RADIUS), [curve]);
    const haloGeometry = useMemo(() => buildTubeGeometry(curve, HALO_RADIUS), [curve]);
    const segmentIndexCountRef = useRef(1);

    useMemo(() => {
      const totalIndexCount = coreGeometry.index?.count ?? 0;
      segmentIndexCountRef.current = Math.max(
        1,
        Math.round(totalIndexCount / TUBULAR_SEGMENTS)
      );
    }, [coreGeometry]);

    useImperativeHandle(
      ref,
      () => ({
        setReveal(fraction: number) {
          const clamped = THREE.MathUtils.clamp(fraction, 0, 1);
          const segments = Math.floor(clamped * TUBULAR_SEGMENTS);
          const indexCount = segments * segmentIndexCountRef.current;
          coreGeometry.setDrawRange(0, indexCount);
          haloGeometry.setDrawRange(0, indexCount);
        },
      }),
      [coreGeometry, haloGeometry]
    );

    return (
      <group>
        <mesh geometry={haloGeometry}>
          <meshBasicMaterial
            color="#d9a566"
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </mesh>
        <mesh geometry={coreGeometry}>
          <meshBasicMaterial color="#ffe0aa" transparent opacity={0.98} />
        </mesh>
      </group>
    );
  }
);
