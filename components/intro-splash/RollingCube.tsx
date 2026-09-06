"use client";

import { useEffect, useMemo, type RefObject } from "react";
import { Edges, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { BRAND_STROKES } from "@/lib/brand-mark";
import { CUBE_SIZE } from "./curve";

type RollingCubeProps = {
  meshRef: RefObject<THREE.Mesh | null>;
  materialRef: RefObject<THREE.MeshStandardMaterial | null>;
};

function createFaceTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, "#343136");
    gradient.addColorStop(0.55, "#171619");
    gradient.addColorStop(1, "#09090a");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);
    context.strokeStyle = "rgba(217,165,102,.28)";
    context.lineWidth = 5;
    context.strokeRect(25, 25, 462, 462);
    context.strokeStyle = "#e7b978";
    context.lineWidth = 28;
    context.lineCap = "square";
    context.lineJoin = "miter";
    BRAND_STROKES.forEach((stroke) => {
      context.beginPath();
      stroke.forEach(([x, y], index) => {
        const px = 46 + x * 4.2;
        const py = 46 + y * 4.2;
        if (index === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      });
      context.stroke();
    });
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/** 面取り、金属感、各面のYK刻印を持つゲーム機風の立方体。 */
export function RollingCube({ meshRef, materialRef }: RollingCubeProps) {
  const texture = useMemo(() => createFaceTexture(), []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <RoundedBox ref={meshRef} args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} radius={0.075} smoothness={6} scale={0.001} castShadow>
      <meshStandardMaterial
        ref={materialRef}
        map={texture}
        color="#ffffff"
        emissive="#7a5227"
        emissiveIntensity={0.05}
        roughness={0.3}
        metalness={0.62}
        transparent
        opacity={0}
      />
      <Edges color="#d9a566" threshold={16} />
    </RoundedBox>
  );
}
