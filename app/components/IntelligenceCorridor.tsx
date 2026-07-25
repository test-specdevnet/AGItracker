"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const NODE_COUNT = 6;
const NODE_SPACING = 30;

type IntelligenceCorridorProps = {
  progress: number;
  activeIndex: number;
};

function seededRandom(seed: number) {
  const value = Math.sin(seed * 9187.13) * 43758.5453;
  return value - Math.floor(value);
}

export function IntelligenceCorridor({
  progress,
  activeIndex,
}: IntelligenceCorridorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  const activeRef = useRef(activeIndex);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02070d, 0.025);

    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      260,
    );
    camera.position.set(0, 4.8, 11);

    const world = new THREE.Group();
    scene.add(world);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 220),
      new THREE.MeshBasicMaterial({
        color: 0x041421,
        transparent: true,
        opacity: 0.58,
        side: THREE.DoubleSide,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.08, -73);
    world.add(floor);

    const gridPositions: number[] = [];
    for (let x = -34; x <= 34; x += 2) {
      gridPositions.push(x, 0, 22, x, 0, -182);
    }
    for (let z = 22; z >= -182; z -= 4) {
      gridPositions.push(-34, 0, z, 34, 0, z);
    }
    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(gridPositions, 3),
    );
    const grid = new THREE.LineSegments(
      gridGeometry,
      new THREE.LineBasicMaterial({
        color: 0x13bff2,
        transparent: true,
        opacity: 0.21,
        blending: THREE.AdditiveBlending,
      }),
    );
    world.add(grid);

    const railMaterial = new THREE.MeshBasicMaterial({
      color: 0x4bdcff,
      transparent: true,
      opacity: 0.86,
      blending: THREE.AdditiveBlending,
    });
    [-5.2, -4.9, 4.9, 5.2].forEach((x) => {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 0.026, 210),
        railMaterial,
      );
      rail.position.set(x, 0.025, -78);
      world.add(rail);
    });

    const amberMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6b2c,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
    });
    [-8.6, 8.6].forEach((x) => {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.045, 0.035, 210),
        amberMaterial,
      );
      rail.position.set(x, 0.035, -78);
      world.add(rail);
    });

    const buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
    const buildingMaterial = new THREE.MeshBasicMaterial({ color: 0x06131d });
    const buildings = new THREE.InstancedMesh(
      buildingGeometry,
      buildingMaterial,
      92,
    );
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 92; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (9 + seededRandom(i + 2) * 19);
      const z = 18 - seededRandom(i + 31) * 198;
      const height = 2.5 + seededRandom(i + 71) * 17;
      const width = 0.8 + seededRandom(i + 101) * 3;
      const depth = 0.8 + seededRandom(i + 151) * 4;
      dummy.position.set(x, height / 2, z);
      dummy.scale.set(width, height, depth);
      dummy.rotation.y = (seededRandom(i + 201) - 0.5) * 0.18;
      dummy.updateMatrix();
      buildings.setMatrixAt(i, dummy.matrix);
    }
    world.add(buildings);

    const lightBars = new THREE.Group();
    for (let i = 0; i < 54; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (9.2 + seededRandom(i + 12) * 18);
      const z = 16 - seededRandom(i + 62) * 195;
      const height = 1.5 + seededRandom(i + 92) * 10;
      const light = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, height, 0.035),
        i % 7 === 0 ? amberMaterial : railMaterial,
      );
      light.position.set(x, height / 2 + 0.6, z);
      lightBars.add(light);
    }
    world.add(lightBars);

    const nodeGroups: THREE.Group[] = [];
    for (let i = 0; i < NODE_COUNT; i += 1) {
      const group = new THREE.Group();
      group.position.set(0, 1.55, -i * NODE_SPACING);

      const isForecast = i === NODE_COUNT - 1;
      const color = isForecast ? 0xff7138 : 0x5ce8ff;
      const ringMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.82,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.65, 0.025, 8, 96),
        ringMaterial,
      );
      group.add(ring);

      const halo = new THREE.Mesh(
        new THREE.TorusGeometry(1.72, 0.018, 8, 72),
        ringMaterial.clone(),
      );
      halo.rotation.x = Math.PI / 2;
      group.add(halo);

      const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.62, 1),
        new THREE.MeshBasicMaterial({
          color,
          wireframe: true,
          transparent: true,
          opacity: 0.9,
        }),
      );
      group.add(core);

      const vertical = new THREE.Mesh(
        new THREE.BoxGeometry(0.025, 8, 0.025),
        ringMaterial,
      );
      vertical.position.y = 3.4;
      group.add(vertical);

      nodeGroups.push(group);
      world.add(group);
    }

    for (let i = 0; i < NODE_COUNT - 1; i += 1) {
      const gate = new THREE.Mesh(
        new THREE.TorusGeometry(7.4, 0.022, 8, 120),
        new THREE.MeshBasicMaterial({
          color: 0x2fcdf6,
          transparent: true,
          opacity: 0.16,
          blending: THREE.AdditiveBlending,
        }),
      );
      gate.position.set(0, 3.4, -(i * NODE_SPACING + NODE_SPACING / 2));
      world.add(gate);
    }

    const particleCount = 900;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      particlePositions[i * 3] = (seededRandom(i + 14) - 0.5) * 70;
      particlePositions[i * 3 + 1] = seededRandom(i + 44) * 18;
      particlePositions[i * 3 + 2] = 25 - seededRandom(i + 84) * 215;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3),
    );
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0x7eeaff,
        size: 0.055,
        transparent: true,
        opacity: 0.62,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    world.add(particles);

    const pointer = { x: 0, y: 0 };
    const handlePointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();
    const lookTarget = new THREE.Vector3();
    let frame = 0;
    const animate = () => {
      frame = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const travel = progressRef.current * (NODE_COUNT - 1) * NODE_SPACING;
      const targetZ = 11 - travel;
      const driftX = reduceMotion ? 0 : pointer.x * 1.15;
      const driftY = reduceMotion ? 0 : -pointer.y * 0.42;

      camera.position.x += (driftX - camera.position.x) * 0.045;
      camera.position.y += (4.8 + driftY - camera.position.y) * 0.045;
      camera.position.z += (targetZ - camera.position.z) * 0.075;
      lookTarget.set(driftX * 0.35, 1.35 + driftY * 0.2, camera.position.z - 18);
      camera.lookAt(lookTarget);

      nodeGroups.forEach((group, index) => {
        const selected = index === activeRef.current;
        const targetScale = selected ? 1.2 : 0.74;
        group.scale.lerp(
          new THREE.Vector3(targetScale, targetScale, targetScale),
          reduceMotion ? 1 : 0.075,
        );
        if (!reduceMotion) {
          group.rotation.z = elapsed * (selected ? 0.13 : 0.045) * (index % 2 ? -1 : 1);
          group.children[1].rotation.y = elapsed * 0.22;
          group.children[2].rotation.x = elapsed * 0.18;
          group.children[2].rotation.y = elapsed * 0.24;
        }
      });

      if (!reduceMotion) {
        particles.position.z = (elapsed * 0.75) % 4;
        lightBars.position.z = (elapsed * 0.14) % 2;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("resize", handleResize);
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Line ||
          object instanceof THREE.Points
        ) {
          object.geometry?.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="corridor" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="corridor__haze" />
      <div className="corridor__scan" />
      <div className="corridor__vignette" />
    </div>
  );
}