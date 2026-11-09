"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Float,
  Sparkles,
  Html,
} from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";

type MarkerType = "bonfire" | "npc" | "exit";

type Marker = {
  id: string;
  name: string;
  type: MarkerType;
  position: [number, number, number];
  description: string;
};

const markers: Marker[] = [
  {
    id: "bonfire",
    name: "Firelink Bonfire",
    type: "bonfire",
    position: [0, 2.1, 0],
    description:
      "Bonfire مرکزی Firelink Shrine و یکی از مهم‌ترین نقاط استراحت Lordran.",
  },
  {
    id: "crestfallen",
    name: "Crestfallen Warrior",
    type: "npc",
    position: [-3.8, 2.1, 1.2],
    description:
      "یکی از NPCهای اولیه Firelink Shrine که درباره مسیرهای Lordran اطلاعات می‌دهد.",
  },
  {
    id: "undead-burg",
    name: "Path to Undead Burg",
    type: "exit",
    position: [5.2, 2.4, -1],
    description:
      "مسیر اصلی حرکت از Firelink Shrine به سمت Undead Burg.",
  },
];

export default function FirelinkPage() {
  const [selected, setSelected] = useState<Marker | null>(markers[0]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020202] text-white">
      {/* 3D WORLD */}

      <div className="absolute inset-0">
        <Canvas
          shadows
          dpr={[1, 1.7]}
          camera={{
            position: [9, 7, 11],
            fov: 42,
          }}
          gl={{
            antialias: true,
          }}
        >
          <Suspense fallback={null}>
            <color attach="background" args={["#030303"]} />

            <fog attach="fog" args={["#030303", 12, 34]} />

            {/* LIGHTING */}

            <ambientLight intensity={0.22} />

            <directionalLight
              position={[-8, 12, 6]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-left={-15}
              shadow-camera-right={15}
              shadow-camera-top={15}
              shadow-camera-bottom={-15}
            />

            <Environment preset="night" />

            {/* ATMOSPHERE */}

            <Sparkles
              count={90}
              scale={[18, 8, 18]}
              size={1.2}
              speed={0.25}
              opacity={0.22}
            />

            {/* WORLD */}

            <FirelinkWorld
              onSelect={(marker) => setSelected(marker)}
            />

            {/* CAMERA */}

            <OrbitControls
              enableDamping
              dampingFactor={0.06}
              enablePan
              enableZoom
              minDistance={5}
              maxDistance={24}
              minPolarAngle={0.45}
              maxPolarAngle={Math.PI / 2.05}
              target={[0, 1.5, 0]}
              rotateSpeed={0.55}
              zoomSpeed={0.7}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* TOP BAR */}

      <header className="pointer-events-none absolute left-0 right-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-start justify-between px-6 py-6">
          <div>
            <p className="text-[8px] tracking-[0.5em] text-[#c8a15b]">
              DARK SOULS I
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-[0.15em]">
              FIRELINK SHRINE
            </h1>

            <p className="mt-2 text-[9px] tracking-[0.25em] text-white/25">
              THE HEART OF LORDRAN
            </p>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-[8px] tracking-[0.3em] text-white/20">
              SOULS GATE
            </p>

            <p className="mt-2 text-xs font-bold text-[#c8a15b]">
              WORLD EXPLORER
            </p>
          </div>
        </div>
      </header>

      {/* INFO PANEL */}

      <aside className="absolute bottom-6 left-6 z-30 w-[min(360px,calc(100%-48px))]">
        <div className="border border-white/10 bg-black/65 p-5 shadow-2xl backdrop-blur-xl">
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[8px] tracking-[0.3em] text-[#c8a15b]">
                    {selected.type.toUpperCase()}
                  </p>

                  <h2 className="mt-2 text-lg font-black tracking-wide">
                    {selected.name}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-white/20 transition hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="mt-4 h-px bg-white/10" />

              <p className="mt-4 text-xs leading-7 text-white/45">
                {selected.description}
              </p>
            </>
          ) : (
            <p className="text-xs text-white/30">
              یک نقطه از Firelink را انتخاب کن.
            </p>
          )}
        </div>
      </aside>

      {/* CONTROLS */}

      <div className="absolute bottom-6 right-6 z-30 hidden sm:block">
        <div className="border border-white/10 bg-black/55 px-5 py-3 text-[8px] tracking-[0.18em] text-white/30 backdrop-blur-xl">
          DRAG
          <span className="mx-2 text-[#c8a15b]">ROTATE</span>
          •
          <span className="mx-2 text-[#c8a15b]">SCROLL</span>
          ZOOM
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   WORLD
========================================================= */

function FirelinkWorld({
  onSelect,
}: {
  onSelect: (marker: Marker) => void;
}) {
  return (
    <group>
      {/* TERRAIN */}

      <Terrain />

      {/* LOWER TERRACE */}

      <StonePlatform
        position={[0, 0.45, 0]}
        radius={6}
        height={0.7}
      />

      {/* UPPER TERRACE */}

      <StonePlatform
        position={[0, 1.8, -4.2]}
        radius={4.5}
        height={0.65}
      />

      {/* STAIRS */}

      <StoneStairs />

      {/* RUINS */}

      <Ruins />

      {/* VEGETATION */}

      <Vegetation />

      {/* BONFIRE */}

      <Bonfire
        position={[0, 1.15, 0]}
        marker={markers[0]}
        onSelect={onSelect}
      />

      {/* NPC */}

      <NpcMarker
        marker={markers[1]}
        onSelect={onSelect}
      />

      {/* EXIT */}

      <ExitMarker
        marker={markers[2]}
        onSelect={onSelect}
      />

      {/* DISTANT ROCKS */}

      <Rocks />
    </group>
  );
}

/* =========================================================
   TERRAIN
========================================================= */

function Terrain() {
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[19, 64]} />

        <meshStandardMaterial
          color="#0d0d0b"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[0, -0.25, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[15, 64]} />

        <meshStandardMaterial
          color="#161512"
          roughness={1}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   STONE PLATFORM
========================================================= */

function StonePlatform({
  position,
  radius,
  height,
}: {
  position: [number, number, number];
  radius: number;
  height: number;
}) {
  return (
    <mesh
      position={position}
      castShadow
      receiveShadow
    >
      <cylinderGeometry
        args={[radius, radius * 1.08, height, 48]}
      />

      <meshStandardMaterial
        color="#25221d"
        roughness={1}
      />
    </mesh>
  );
}

/* =========================================================
   STAIRS
========================================================= */

function StoneStairs() {
  const steps = Array.from({ length: 9 });

  return (
    <group position={[0, 0, -2.4]}>
      {steps.map((_, index) => {
        const y = 0.7 + index * 0.14;
        const z = -index * 0.45;

        return (
          <mesh
            key={index}
            position={[0, y, z]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[2.5, 0.25, 0.7]} />

            <meshStandardMaterial
              color={index % 2 ? "#302c25" : "#27241f"}
              roughness={1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* =========================================================
   RUINS
========================================================= */

function Ruins() {
  const columns = [
    [-4.8, 2, -1],
    [4.8, 1.8, -1.5],
    [-4.5, 2.5, -5],
    [4.2, 2.2, -5.2],
    [-2.8, 3.2, -6],
    [2.7, 2.8, -6],
  ];

  return (
    <group>
      {columns.map(([x, height, z], index) => (
        <group
          key={index}
          position={[x, height / 2, z]}
        >
          <mesh castShadow receiveShadow>
            <cylinderGeometry
              args={[0.45, 0.55, height, 8]}
            />

            <meshStandardMaterial
              color="#302d27"
              roughness={1}
            />
          </mesh>

          <mesh
            position={[0, height / 2 + 0.2, 0]}
            castShadow
          >
            <boxGeometry args={[1.2, 0.35, 1.2]} />

            <meshStandardMaterial
              color="#38342d"
              roughness={1}
            />
          </mesh>
        </group>
      ))}

      {/* BROKEN WALL */}

      <mesh
        position={[-3.4, 2.2, -5.8]}
        rotation={[0, 0.05, -0.04]}
        castShadow
      >
        <boxGeometry args={[4.5, 4, 0.6]} />

        <meshStandardMaterial
          color="#24211d"
          roughness={1}
        />
      </mesh>

      {/* ARCH */}

      <mesh
        position={[0, 3.7, -6]}
        rotation={[0, 0, 0]}
        castShadow
      >
        <torusGeometry
          args={[2, 0.3, 12, 32, Math.PI]}
        />

        <meshStandardMaterial
          color="#36322b"
          roughness={1}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   VEGETATION
========================================================= */

function Vegetation() {
  const plants = [
    [-5.5, 0, 2.5],
    [-4.5, 0, 4],
    [4.5, 0, 3.5],
    [5.8, 0, 1.5],
    [-6, 0, -3],
    [6, 0, -4],
  ];

  return (
    <group>
      {plants.map(([x, y, z], index) => (
        <group
          key={index}
          position={[x, y, z]}
        >
          <mesh
            position={[0, 1, 0]}
            castShadow
          >
            <cylinderGeometry
              args={[0.12, 0.18, 2, 7]}
            />

            <meshStandardMaterial
              color="#211f1a"
              roughness={1}
            />
          </mesh>

          <mesh
            position={[0, 2.1, 0]}
            scale={[1, 1.3, 1]}
          >
            <sphereGeometry args={[0.9, 8, 6]} />

            <meshStandardMaterial
              color="#182019"
              roughness={1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* =========================================================
   BONFIRE
========================================================= */

function Bonfire({
  position,
  marker,
  onSelect,
}: {
  position: [number, number, number];
  marker: Marker;
  onSelect: (marker: Marker) => void;
}) {
  const flame = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!flame.current) return;

    const time = clock.getElapsedTime();

    flame.current.scale.x =
      0.9 + Math.sin(time * 8) * 0.12;

    flame.current.scale.z =
      0.9 + Math.cos(time * 7) * 0.1;

    flame.current.scale.y =
      1 + Math.sin(time * 9) * 0.12;
  });

  return (
    <group position={position}>
      {/* STONES */}

      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (index / 8) * Math.PI * 2;

        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * 0.7,
              0.15,
              Math.sin(angle) * 0.7,
            ]}
            rotation={[0, angle, 0]}
            castShadow
          >
            <dodecahedronGeometry args={[0.35, 0]} />

            <meshStandardMaterial
              color="#37332b"
              roughness={1}
            />
          </mesh>
        );
      })}

      {/* WOOD */}

      <mesh
        position={[0, 0.55, 0]}
        rotation={[0.2, 0.4, 0.6]}
      >
        <cylinderGeometry args={[0.12, 0.16, 1.5, 8]} />

        <meshStandardMaterial
          color="#3b2617"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[0, 0.55, 0]}
        rotation={[-0.3, -0.5, 1.1]}
      >
        <cylinderGeometry args={[0.12, 0.16, 1.5, 8]} />

        <meshStandardMaterial
          color="#422a18"
          roughness={1}
        />
      </mesh>

      {/* FIRE */}

      <Float
        speed={5}
        rotationIntensity={0.2}
        floatIntensity={0.2}
      >
        <mesh
          ref={flame}
          position={[0, 1.25, 0]}
        >
          <coneGeometry args={[0.45, 1.5, 8]} />

          <meshBasicMaterial color="#ff9b32" />
        </mesh>
      </Float>

      <pointLight
        position={[0, 1.2, 0]}
        intensity={8}
        distance={7}
        decay={2}
        color="#ff8b32"
      />

      {/* CLICKABLE MARKER */}

      <mesh
        position={[0, 2.2, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(marker);
        }}
      >
        <sphereGeometry args={[0.35, 16, 16]} />

        <meshBasicMaterial
          transparent
          opacity={0}
        />
      </mesh>

      <Html
        position={[0, 2.7, 0]}
        center
        distanceFactor={8}
      >
        <button
          type="button"
          onClick={() => onSelect(marker)}
          className="rounded-full border border-orange-400/60 bg-black/70 px-3 py-1 text-[9px] font-bold tracking-[0.15em] text-orange-300 backdrop-blur transition hover:scale-105"
        >
          🔥 BONFIRE
        </button>
      </Html>
    </group>
  );
}

/* =========================================================
   NPC
========================================================= */

function NpcMarker({
  marker,
  onSelect,
}: {
  marker: Marker;
  onSelect: (marker: Marker) => void;
}) {
  return (
    <group position={marker.position}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(marker);
        }}
      >
        <sphereGeometry args={[0.45, 16, 16]} />

        <meshBasicMaterial
          transparent
          opacity={0}
        />
      </mesh>

      <Html
        center
        distanceFactor={8}
      >
        <button
          type="button"
          onClick={() => onSelect(marker)}
          className="whitespace-nowrap rounded-full border border-blue-300/40 bg-black/75 px-3 py-1 text-[8px] font-bold tracking-[0.12em] text-blue-200 backdrop-blur transition hover:scale-105"
        >
          ♙ CRESTFALLEN
        </button>
      </Html>
    </group>
  );
}

/* =========================================================
   EXIT
========================================================= */

function ExitMarker({
  marker,
  onSelect,
}: {
  marker: Marker;
  onSelect: (marker: Marker) => void;
}) {
  return (
    <group position={marker.position}>
      <Float
        speed={2}
        rotationIntensity={0}
        floatIntensity={0.3}
      >
        <mesh
          onClick={(event) => {
            event.stopPropagation();
            onSelect(marker);
          }}
        >
          <torusGeometry args={[0.45, 0.08, 8, 24]} />

          <meshBasicMaterial
            color="#c8a15b"
          />
        </mesh>
      </Float>

      <Html
        position={[0, 0.8, 0]}
        center
        distanceFactor={8}
      >
        <button
          type="button"
          onClick={() => onSelect(marker)}
          className="whitespace-nowrap border border-[#c8a15b]/50 bg-black/75 px-3 py-1 text-[8px] font-bold tracking-[0.12em] text-[#c8a15b] backdrop-blur transition hover:scale-105"
        >
          → UNDEAD BURG
        </button>
      </Html>
    </group>
  );
}

/* =========================================================
   ROCKS
========================================================= */

function Rocks() {
  const rocks = [
    [-8, 0.4, -5],
    [8, 0.5, -2],
    [-8, 0.3, 5],
    [7, 0.4, 6],
    [0, 0.3, 8],
  ];

  return (
    <group>
      {rocks.map(([x, y, z], index) => (
        <mesh
          key={index}
          position={[x, y, z]}
          rotation={[
            index * 0.3,
            index * 0.7,
            index * 0.2,
          ]}
          castShadow
        >
          <dodecahedronGeometry
            args={[0.7 + index * 0.1, 0]}
          />

          <meshStandardMaterial
            color="#24221e"
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}