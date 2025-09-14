'use client'
import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

function createTextSprite(text: string) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const fontSize = 80;
  ctx.font = `${fontSize}px Arial`;
  const textWidth = ctx.measureText(text).width;
  canvas.width = textWidth + 40;
  canvas.height = fontSize + 40;

  ctx.font = `${fontSize}px Arial`;
  ctx.textBaseline = "top";
  ctx.fillStyle = "white";
  ctx.fillText(text, 20, 20);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);

  const scaleFactor = 0.1;
  sprite.scale.set(canvas.width * scaleFactor, canvas.height * scaleFactor, 1);
  sprite.position.set(0, 8, 6);

  return sprite;
}

function SkillTree3D({ data }: any) {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (fgRef.current && size.width && size.height) {
      // camera 初始位置
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 250 });
    }
  }, [size]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {size.width && size.height && (
        <ForceGraph3D
          ref={fgRef}
          width={size.width}
          height={size.height}
          graphData={data}
          nodeAutoColorBy="level"
          nodeThreeObject={(node: any) => {
            const geometry = new THREE.SphereGeometry(5 + node.score, 16, 16);
            const material = new THREE.MeshStandardMaterial({
              color:
                node.level === 1
                  ? "#007BFF"
                  : node.level === 2
                  ? "#28A745"
                  : node.level === 3
                  ? "#FFC107"
                  : "#66ccff",
              opacity: 0.8 - 0.1 * (5 - node.score),
              transparent: true,
            });
            const sphere = new THREE.Mesh(geometry, material);

            const group = new THREE.Group();
            group.add(sphere);

            const textSprite = createTextSprite(node.name);
            group.add(textSprite);

            return group;
          }}
          linkColor={() => "#999"}
          linkWidth={1}
          linkDirectionalParticles={1}
          linkDirectionalParticleWidth={1}
          backgroundColor="#111"
        />
      )}
    </div>
  );
}

export default function SkillTree({data}:any) {
  

  // 這裡完全不要寫 CSS，交由外面容器控制
  return <SkillTree3D data={data} />;
}
