import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, RotateCw, ZoomIn, ZoomOut, Check, ChevronRight } from 'lucide-react';

const SPOTS = [
  { id: 'living', name: 'LDK（吹き抜け＆採光）', url: '/assets/saishin/360/living.jpg', desc: '陽光あふれる大空間。エアコン1台で家中快適。' },
  { id: 'dining', name: 'ダイニング＆キッチン', url: '/assets/saishin/360/dining.jpg', desc: 'スムーズな家事動線と落ち着きのある木目調。' },
  { id: 'room1', name: '主寝室（趣味・書斎）', url: '/assets/saishin/360/room1.jpg', desc: '静けさを確保したプライベート空間。' },
  { id: 'room2', name: 'セカンド寝室', url: '/assets/saishin/360/room2.jpg', desc: 'つかず離れずの距離感。引き戸で気配を共有。' },
  { id: 'entrance', name: '玄関・ホール', url: '/assets/saishin/360/entrance.jpg', desc: 'ゆとりあるアプローチと明るい土間。' },
];

export default function VirtualTour360() {
  const containerRef = useRef(null);
  const [currentSpot, setCurrentSpot] = useState(SPOTS[0]);
  const [loading, setLoading] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [fov, setFov] = useState(75);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);
  const textureLoaderRef = useRef(new THREE.TextureLoader());

  const stateRef = useRef({
    lon: 0,
    lat: 0,
    phi: 0,
    theta: 0,
    onPointerDownPointerX: 0,
    onPointerDownPointerY: 0,
    onPointerDownLon: 0,
    onPointerDownLat: 0,
    isUserInteracting: false,
    autoRotateSpeed: 0.05,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);
    cameraRef.current = camera;

    // Sphere Geometry (inverted)
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Load initial texture
    loadTexture(currentSpot.url);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      const state = stateRef.current;
      if (!state.isUserInteracting) {
        state.lon += state.autoRotateSpeed;
      }

      state.lat = Math.max(-85, Math.min(85, state.lat));
      state.phi = THREE.MathUtils.degToRad(90 - state.lat);
      state.theta = THREE.MathUtils.degToRad(state.lon);

      camera.target.x = 500 * Math.sin(state.phi) * Math.cos(state.theta);
      camera.target.y = 500 * Math.cos(state.phi);
      camera.target.z = 500 * Math.sin(state.phi) * Math.sin(state.theta);

      camera.lookAt(camera.target);
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const loadTexture = (url) => {
    setLoading(true);
    textureLoaderRef.current.load(
      url,
      (texture) => {
        if ('encoding' in texture && THREE.sRGBEncoding) {
          texture.encoding = THREE.sRGBEncoding;
        }
        if (meshRef.current) {
          meshRef.current.material.map = texture;
          meshRef.current.material.needsUpdate = true;
        }
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('360 Texture Load Error:', err);
        setLoading(false);
      }
    );
  };

  const switchSpot = (spot) => {
    setCurrentSpot(spot);
    loadTexture(spot.url);
  };

  // Pointer Events
  const handlePointerDown = (e) => {
    const state = stateRef.current;
    state.isUserInteracting = true;
    setIsUserInteracting(true);

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    state.onPointerDownPointerX = clientX;
    state.onPointerDownPointerY = clientY;
    state.onPointerDownLon = state.lon;
    state.onPointerDownLat = state.lat;
  };

  const handlePointerMove = (e) => {
    const state = stateRef.current;
    if (!state.isUserInteracting) return;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    state.lon = (state.onPointerDownPointerX - clientX) * 0.15 + state.onPointerDownLon;
    state.lat = (clientY - state.onPointerDownPointerY) * 0.15 + state.onPointerDownLat;
  };

  const handlePointerUp = () => {
    const state = stateRef.current;
    state.isUserInteracting = false;
    setIsUserInteracting(false);
  };

  const handleZoom = (delta) => {
    if (!cameraRef.current) return;
    const nextFov = Math.max(40, Math.min(100, fov + delta));
    setFov(nextFov);
    cameraRef.current.fov = nextFov;
    cameraRef.current.updateProjectionMatrix();
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-stone-200 bg-stone-900">
      {/* 360 Viewer Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-[420px] md:h-[560px] cursor-grab active:cursor-grabbing relative select-none"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        {loading && (
          <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-medium tracking-wider">360° パノラマ読み込み中...</p>
          </div>
        )}

        {/* Overlay Controls */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs border border-white/10 shadow-lg">
          <Compass className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>ドラッグまたはスワイプで360度見渡せます</span>
        </div>

        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={() => handleZoom(-10)}
            className="p-2 rounded-full bg-stone-900/80 text-white hover:bg-stone-800 backdrop-blur-md border border-white/10 transition shadow-lg"
            title="ズームイン"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(10)}
            className="p-2 rounded-full bg-stone-900/80 text-white hover:bg-stone-800 backdrop-blur-md border border-white/10 transition shadow-lg"
            title="ズームアウト"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Current Spot Description Card */}
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-md z-10 bg-stone-900/90 backdrop-blur-md p-4 rounded-xl text-white border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              現在地
            </span>
            <span className="text-[11px] text-stone-400">24時間セルフ見学中</span>
          </div>
          <h4 className="text-base font-bold text-white mb-1">{currentSpot.name}</h4>
          <p className="text-xs text-stone-300 leading-relaxed">{currentSpot.desc}</p>
        </div>
      </div>

      {/* Spot Selector Tabs */}
      <div className="p-3 md:p-4 bg-stone-950 border-t border-stone-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {SPOTS.map((spot) => {
            const isSelected = spot.id === currentSpot.id;
            return (
              <button
                key={spot.id}
                onClick={() => switchSpot(spot)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-900/40'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                <span>{spot.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
