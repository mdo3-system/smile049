import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  ArrowLeft, BookOpen, Save, FolderOpen, Undo2, Redo2, 
  Camera, Eye, EyeOff, ZoomIn, HelpCircle, Layers, CheckCircle2, AlertCircle,
  Maximize2, Minimize2, Compass, Move, ChevronRight, Sliders, FileText, Check, MessageSquare, Sparkles
} from 'lucide-react';
import ManualModal from '../components/ManualModal';
import ParseRequestModal from '../components/ParseRequestModal';
import ChatRoomModal from '../components/ChatRoomModal';
import { APP_VERSION } from '../version.js';

export default function SimulatorPage({ setCurrentRoute, externalModelData }) {

  const canvasContainerRef = useRef(null);
  const svgRef = useRef(null);
  const fileInputRef = useRef(null);

  // マニュアルモーダル
  const [isManualOpen, setIsManualOpen] = useState(false);
  // パース作成依頼モーダル
  const [isParseRequestOpen, setIsParseRequestOpen] = useState(false);
  // チャットモーダル
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatRoomId, setChatRoomId] = useState(null);

  // 3D全画面表示モード (スマホで3Dモデルを最大化して鑑賞)
  const [is3dFullScreen, setIs3dFullScreen] = useState(false);

  // 表示モード ('3d', 'plan', 'front-elev', 'back-elev', 'left-elev', 'right-elev')
  const [currentView, setCurrentView] = useState('3d');
  const [isSeeThrough, setIsSeeThrough] = useState(false);
  const [svgZoom, setSvgZoom] = useState(1.0);
  const [dimFontScale, setDimFontScale] = useState(1.0);
  const [show3dDimensions, setShow3dDimensions] = useState(true);
  const [dim3dFontScale, setDim3dFontScale] = useState(1.0);

  // スマホ用アクティブタブ ('dims', 'roof', 'openings', 'shelves', 'vehicles', 'calc')
  const [activeMobileTab, setActiveMobileTab] = useState('dims');


  // 定数
  const WALL_OUTER_OFFSET = 100;
  const WALL_INNER_OFFSET = 65;

  // 寸法・形状パラメータ
  const [dimensions, setDimensions] = useState({
    shapeType: 'regular', // 'regular' | 'trapezoid_right_angle_left' | 'trapezoid_right_angle_right' | 'trapezoid_free' | 'l_shaped'
    skewOffset: 0,
    targetAngle: 90,
    cornerCutEnabled: false,
    cornerCutPos: 'back-right',
    cornerCutWidth: 1500,
    cornerCutDepth: 1500,
    wFront: 5400,
    wBack: 5400,
    dLeft: 6000,
    dRight: 6000,
    eaveHeight: 2800,
    foundationHeight: 300,
    roofSlope: 1.5,
    slopeDirection: 'front-to-back',
    ceilingType: 'open'
  });

  // 開口部リスト (gemini-code 完全仕様)
  const [openings, setOpenings] = useState([
    {
      id: 1,
      wall: 'front',
      type: 'shutter',
      width: 2700,
      height: 2400,
      topHeightGL: 2450,
      clearanceLeft: 300,
      openRatio: 0
    },
    {
      id: 2,
      wall: 'right',
      type: 'window',
      width: 1650,
      height: 900,
      topHeightGL: 2100,
      clearanceLeft: 1000,
      openRatio: 0
    }
  ]);

  // 内部棚・間仕切りリスト
  const [shelfUnits, setShelfUnits] = useState([
    {
      id: 1,
      wall: 'back',
      width: 3600,
      depth: 600,
      clearanceLeft: 200,
      levels: [450, 900, 1500]
    }
  ]);

  // 車両配置リスト (SUV / スポーツ / バイク / ★トラクター)
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      type: 'tractor',
      posX: 0,
      posZ: -3200,
      rotDeg: 0,
      color: '#dc2626'
    }
  ]);

  // 見積書転用レベルの詳細計算根拠
  const [calculations, setCalculations] = useState({
    floorFormula: '-',
    floorVal: '- ㎡ (- 坪)',
    foundFormula: '-',
    foundVal: '全周: - m',
    roofFormula: '-',
    roofVal: '- ㎡',
    openingsFormula: '-',
    openingsVal: '- ㎡',
    wallsFormula: '-',
    wallsVal: '- ㎡',
    approxCost: 0
  });

  // バリデーションエラー
  const [validationErrors, setValidationErrors] = useState({});

  // Three.js インスタンス保持用 ref
  const threeRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    buildingGroup: null,
    dimGroup: null,
    reqId: null
  });

  // Undo / Redo
  const historyRef = useRef({
    stack: [],
    index: -1,
    isNavigating: false
  });

  const pushHistory = (newState) => {
    if (historyRef.current.isNavigating) return;
    const json = JSON.stringify(newState);
    const hist = historyRef.current;
    if (hist.index >= 0 && hist.stack[hist.index] === json) return;
    hist.stack = hist.stack.slice(0, hist.index + 1);
    hist.stack.push(json);
    if (hist.stack.length > 30) hist.stack.shift();
    hist.index = hist.stack.length - 1;
  };

  const handleUndo = () => {
    const hist = historyRef.current;
    if (hist.index > 0) {
      hist.isNavigating = true;
      hist.index--;
      const state = JSON.parse(hist.stack[hist.index]);
      restoreState(state);
      hist.isNavigating = false;
    }
  };

  const handleRedo = () => {
    const hist = historyRef.current;
    if (hist.index < hist.stack.length - 1) {
      hist.isNavigating = true;
      hist.index++;
      const state = JSON.parse(hist.stack[hist.index]);
      restoreState(state);
      hist.isNavigating = false;
    }
  };

  const restoreState = (s) => {
    if (s.dimensions) setDimensions(s.dimensions);
    if (s.openings) setOpenings(s.openings);
    if (s.shelfUnits) setShelfUnits(s.shelfUnits);
    if (s.vehicles) setVehicles(s.vehicles);
  };

  useEffect(() => {
    if (externalModelData) {
      restoreState(externalModelData);
      pushHistory(externalModelData);
    }
  }, [externalModelData]);

  // -------------------------------------------------------------
  // Three.js 初期化
  // -------------------------------------------------------------
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9);

    const camera = new THREE.PerspectiveCamera(45, width / height, 100, 50000);
    camera.position.set(6500, 6000, 8500);

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1400, -2800);

    // 照明 (自然で温かみのある光源)
    const ambLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 0.85);
    dirLight.position.set(6000, 12000, 7000);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const grid = new THREE.GridHelper(24000, 48, 0xa0aec0, 0xe2e8f0);
    grid.position.y = 0;
    scene.add(grid);

    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);

    const dimGroup = new THREE.Group();
    scene.add(dimGroup);

    threeRef.current = { scene, camera, renderer, controls, buildingGroup, dimGroup, reqId: null };

    const animate = () => {
      threeRef.current.reqId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 初期履歴
    pushHistory({ dimensions, openings, shelfUnits, vehicles });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (threeRef.current.reqId) cancelAnimationFrame(threeRef.current.reqId);
      renderer.dispose();
    };
  }, []);

  // -------------------------------------------------------------
  // 3Dモデル生成 & 完全建築ロジック (gemini-code 忠実再現)
  // -------------------------------------------------------------
  useEffect(() => {
    updateFullModel();
  }, [dimensions, openings, shelfUnits, vehicles, isSeeThrough, show3dDimensions, dim3dFontScale]);

  useEffect(() => {
    if (currentView !== '3d') {
      renderSvgDrawings();
    }
  }, [currentView, dimensions, openings, shelfUnits, svgZoom, dimFontScale]);

  // 全画面モードやビュー切り替え時にThree.jsキャンバスリサイズを自動再実行
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container || !threeRef.current.renderer || !threeRef.current.camera) return;
    const timer = setTimeout(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        threeRef.current.camera.aspect = w / h;
        threeRef.current.camera.updateProjectionMatrix();
        threeRef.current.renderer.setSize(w, h);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [is3dFullScreen, currentView]);


  // 開口部バリデーション
  const validateAllOpenings = () => {
    const errors = {};
    openings.forEach((op) => {
      const errList = [];
      const span = getWallSpan(op.wall);
      const clearance = parseFloat(op.clearanceLeft) || 0;
      const w = parseFloat(op.width) || 0;

      if (clearance < 100) {
        errList.push(`⚠️ 左柱芯からの逃げは最短100mm以上必要です（現在: ${clearance}mm）`);
      }
      const rightClearance = span - (clearance + w);
      if (rightClearance < 100) {
        errList.push(`⚠️ 右柱芯からの逃げは最短100mm以上必要です（現在: ${rightClearance.toFixed(0)}mm）`);
      }
      if (errList.length > 0) {
        errors[op.id] = errList;
      }
    });
    setValidationErrors(errors);
  };

  const getWallSpan = (wallKey) => {
    if (wallKey === 'front') return dimensions.wFront;
    if (wallKey === 'right') return dimensions.dRight;
    if (wallKey === 'back') return dimensions.wBack;
    if (wallKey === 'left') return dimensions.dLeft;
    return 5400;
  };

  const isFloorLevelOpening = (type) => {
    return type === 'shutter' || type === 'door' || type === 'sliding_door';
  };

  // -------------------------------------------------------------
  // 3Dモデル完全生成関数
  // -------------------------------------------------------------
  const updateFullModel = () => {
    const { buildingGroup, dimGroup, scene } = threeRef.current;
    if (!buildingGroup || !dimGroup) return;

    // クリーンアップ
    while (buildingGroup.children.length > 0) {
      const obj = buildingGroup.children[0];
      buildingGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }
    while (dimGroup.children.length > 0) {
      const obj = dimGroup.children[0];
      dimGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }

    const { wFront: wF, wBack: wB, dLeft: dL, dRight: dR, eaveHeight: eaveH, foundationHeight: foundationH, roofSlope: slope, slopeDirection: slopeDir, ceilingType, shapeType, skewOffset } = dimensions;

    const corePts = getCorePoints(wF, wB, dL, dR, shapeType, skewOffset);
    const outerPts = getOffsetPoints(corePts, WALL_OUTER_OFFSET);
    const innerPts = getOffsetPoints(corePts, -WALL_INNER_OFFSET);

    const bounds = {
      minX: Math.min(...outerPts.map(p => p.x)),
      maxX: Math.max(...outerPts.map(p => p.x)),
      minY: Math.min(...outerPts.map(p => p.y)),
      maxY: Math.max(...outerPts.map(p => p.y))
    };

    const hPts = outerPts.map(p => getGirderHeight(p, bounds, eaveH, slope, slopeDir));
    const hInnerPts = innerPts.map(p => getGirderHeight(p, bounds, eaveH, slope, slopeDir));
    const roofThickness = Math.round(100 + (slope * 2));

    // マテリアル
    const slabMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
    const foundationMat = new THREE.MeshStandardMaterial({ color: 0xc8cbd0, roughness: 0.9 });
    const wallMat = new THREE.MeshStandardMaterial({ 
      color: 0x3d4a58, 
      roughness: 0.45, 
      transparent: isSeeThrough, 
      opacity: isSeeThrough ? 0.35 : 1.0,
      side: THREE.DoubleSide
    });
    const roofMat = new THREE.MeshStandardMaterial({ 
      color: 0x1f2937, 
      roughness: 0.35, 
      transparent: isSeeThrough, 
      opacity: isSeeThrough ? 0.35 : 1.0 
    });
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xeddcc8, roughness: 0.6 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8c6239, roughness: 0.7 });
    const shutterBoxMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5, roughness: 0.5 });
    const shutterMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.4, roughness: 0.6 });
    const edgeLineMat = new THREE.LineBasicMaterial({ color: 0x1e293b, linewidth: 1 });

    // 見積計算式の更新
    updateCalculations(corePts, outerPts, hPts, roofThickness, slope);
    validateAllOpenings();

    // 1. 内部土間コンクリート床 (GL+50)
    const slabVerts = [
      innerPts[0].x, 50, innerPts[0].y,
      innerPts[1].x, 50, innerPts[1].y,
      innerPts[2].x, 50, innerPts[2].y,
      innerPts[0].x, 50, innerPts[0].y,
      innerPts[2].x, 50, innerPts[2].y,
      innerPts[3].x, 50, innerPts[3].y
    ];
    const slabGeo = new THREE.BufferGeometry();
    slabGeo.setAttribute('position', new THREE.Float32BufferAttribute(slabVerts, 3));
    slabGeo.computeVertexNormals();
    buildingGroup.add(new THREE.Mesh(slabGeo, slabMat));

    // 2. 基礎立ち上がり (開口部切り欠きロジック完全復元)
    const wallKeys = ['front', 'right', 'back', 'left'];
    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;
      const pA = outerPts[i];
      const pB = outerPts[next];
      const pACore = corePts[i];
      const wKey = wallKeys[i];
      const vWall = new THREE.Vector2().subVectors(pB, pA);
      const wallLen = vWall.length();
      const wallDir = vWall.clone().normalize();

      const floorLevelOps = openings
        .filter(op => op.wall === wKey && isFloorLevelOpening(op.type))
        .map(op => {
          const pStart = new THREE.Vector2().addVectors(pACore, wallDir.clone().multiplyScalar(op.clearanceLeft));
          const pEnd = new THREE.Vector2().addVectors(pACore, wallDir.clone().multiplyScalar(op.clearanceLeft + op.width));
          const distStart = new THREE.Vector2().subVectors(pStart, pA).dot(wallDir);
          const distEnd = new THREE.Vector2().subVectors(pEnd, pA).dot(wallDir);
          return { start: Math.max(0, distStart), end: Math.min(wallLen, distEnd) };
        })
        .sort((a, b) => a.start - b.start);

      let curX = 0;
      floorLevelOps.forEach(fOp => {
        if (fOp.start > curX) {
          const pt1 = new THREE.Vector2().addVectors(pA, wallDir.clone().multiplyScalar(curX));
          const pt2 = new THREE.Vector2().addVectors(pA, wallDir.clone().multiplyScalar(fOp.start));
          buildingGroup.add(createQuadMesh(
            new THREE.Vector3(pt1.x, 0, pt1.y),
            new THREE.Vector3(pt2.x, 0, pt2.y),
            new THREE.Vector3(pt2.x, foundationH, pt2.y),
            new THREE.Vector3(pt1.x, foundationH, pt1.y),
            foundationMat
          ));
        }
        curX = fOp.end;
      });
      if (curX < wallLen) {
        const pt1 = new THREE.Vector2().addVectors(pA, wallDir.clone().multiplyScalar(curX));
        buildingGroup.add(createQuadMesh(
          new THREE.Vector3(pt1.x, 0, pt1.y),
          new THREE.Vector3(pB.x, 0, pB.y),
          new THREE.Vector3(pB.x, foundationH, pB.y),
          new THREE.Vector3(pt1.x, foundationH, pt1.y),
          foundationMat
        ));
      }
    }

    // 3. 外壁・内付け抱き面 (2段納まり完全復元)
    const insideOffset = 100;
    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;
      const pA = outerPts[i];
      const pB = outerPts[next];
      const pACore = corePts[i];
      const hA = hPts[i];
      const hB = hPts[next];
      const wKey = wallKeys[i];

      const vWall = new THREE.Vector2().subVectors(pB, pA);
      const wallLen = vWall.length();
      const wallDir = vWall.clone().normalize();
      const inNorm = new THREE.Vector2(wallDir.y, -wallDir.x).normalize();

      const wallOps = openings
        .filter(op => op.wall === wKey)
        .map(op => {
          const pStart = new THREE.Vector2().addVectors(pACore, wallDir.clone().multiplyScalar(op.clearanceLeft));
          const pEnd = new THREE.Vector2().addVectors(pACore, wallDir.clone().multiplyScalar(op.clearanceLeft + op.width));
          const distStart = new THREE.Vector2().subVectors(pStart, pA).dot(wallDir);
          const distEnd = new THREE.Vector2().subVectors(pEnd, pA).dot(wallDir);
          const bottomY = isFloorLevelOpening(op.type) ? 50 : Math.max(op.topHeightGL - op.height, 50);
          return {
            start: Math.max(0, distStart),
            end: Math.min(wallLen, distEnd),
            topGL: op.topHeightGL,
            bottomGL: bottomY,
            op: op
          };
        })
        .sort((a, b) => a.start - b.start);

      let curX = 0;
      wallOps.forEach(wOp => {
        if (wOp.start > curX) {
          const t1 = curX / wallLen, t2 = wOp.start / wallLen;
          const ptA1 = new THREE.Vector2().addVectors(pA, wallDir.clone().multiplyScalar(curX));
          const ptA2 = new THREE.Vector2().addVectors(pA, wallDir.clone().multiplyScalar(wOp.start));
          const h1 = hA + (hB - hA) * t1;
          const h2 = hA + (hB - hA) * t2;

          buildingGroup.add(createQuadMesh(
            new THREE.Vector3(ptA1.x, foundationH, ptA1.y),
            new THREE.Vector3(ptA2.x, foundationH, ptA2.y),
            new THREE.Vector3(ptA2.x, h2, ptA2.y),
            new THREE.Vector3(ptA1.x, h1, ptA1.y),
            wallMat
          ));
        }

        const tS = wOp.start / wallLen, tE = wOp.end / wallLen;
        const ptS = new THREE.Vector2().addVectors(pA, wallDir.clone().multiplyScalar(wOp.start));
        const ptE = new THREE.Vector2().addVectors(pA, wallDir.clone().multiplyScalar(wOp.end));
        const hS = hA + (hB - hA) * tS;
        const hE = hA + (hB - hA) * tE;

        // 窓下腰壁
        if (wOp.bottomGL > foundationH) {
          buildingGroup.add(createQuadMesh(
            new THREE.Vector3(ptS.x, foundationH, ptS.y),
            new THREE.Vector3(ptE.x, foundationH, ptE.y),
            new THREE.Vector3(ptE.x, wOp.bottomGL, ptE.y),
            new THREE.Vector3(ptS.x, wOp.bottomGL, ptS.y),
            wallMat
          ));
        }

        // 窓上・開口部上壁
        if (Math.min(hS, hE) > wOp.topGL) {
          buildingGroup.add(createQuadMesh(
            new THREE.Vector3(ptS.x, wOp.topGL, ptS.y),
            new THREE.Vector3(ptE.x, wOp.topGL, ptE.y),
            new THREE.Vector3(ptE.x, hE, ptE.y),
            new THREE.Vector3(ptS.x, hS, ptS.y),
            wallMat
          ));
        }

        // シャッター内付け 2段抱き面（GL 0〜300コンクリート、300以上外壁仕上）
        if (wOp.op.type === 'shutter') {
          const totalInDepth = WALL_OUTER_OFFSET + insideOffset;
          const ptS_in = ptS.clone().add(inNorm.clone().multiplyScalar(totalInDepth));
          const ptE_in = ptE.clone().add(inNorm.clone().multiplyScalar(totalInDepth));

          // 左抱き面
          buildingGroup.add(createQuadMesh(
            new THREE.Vector3(ptS.x, 0, ptS.y),
            new THREE.Vector3(ptS_in.x, 0, ptS_in.y),
            new THREE.Vector3(ptS_in.x, foundationH, ptS_in.y),
            new THREE.Vector3(ptS.x, foundationH, ptS.y),
            foundationMat
          ));
          buildingGroup.add(createQuadMesh(
            new THREE.Vector3(ptS.x, foundationH, ptS.y),
            new THREE.Vector3(ptS_in.x, foundationH, ptS_in.y),
            new THREE.Vector3(ptS_in.x, wOp.topGL, ptS_in.y),
            new THREE.Vector3(ptS.x, wOp.topGL, ptS.y),
            wallMat
          ));

          // 右抱き面
          buildingGroup.add(createQuadMesh(
            new THREE.Vector3(ptE_in.x, 0, ptE_in.y),
            new THREE.Vector3(ptE.x, 0, ptE.y),
            new THREE.Vector3(ptE.x, foundationH, ptE.y),
            new THREE.Vector3(ptE_in.x, foundationH, ptE_in.y),
            foundationMat
          ));
          buildingGroup.add(createQuadMesh(
            new THREE.Vector3(ptE_in.x, foundationH, ptE_in.y),
            new THREE.Vector3(ptE.x, foundationH, ptE.y),
            new THREE.Vector3(ptE.x, wOp.topGL, ptE.y),
            new THREE.Vector3(ptE_in.x, wOp.topGL, ptE_in.y),
            wallMat
          ));
        }

        curX = wOp.end;
      });

      if (curX < wallLen) {
        const t1 = curX / wallLen;
        const ptA1 = new THREE.Vector2().addVectors(pA, wallDir.clone().multiplyScalar(curX));
        const h1 = hA + (hB - hA) * t1;

        buildingGroup.add(createQuadMesh(
          new THREE.Vector3(ptA1.x, foundationH, ptA1.y),
          new THREE.Vector3(pB.x, foundationH, pB.y),
          new THREE.Vector3(pB.x, hB, pB.y),
          new THREE.Vector3(ptA1.x, h1, ptA1.y),
          wallMat
        ));
      }
    }

    // 4. 屋根 (壁と隙間ゼロで完全に面一結合)
    const roofVertices = [];
    for (let i = 0; i < 4; i++) roofVertices.push(outerPts[i].x, hPts[i], outerPts[i].y);
    for (let i = 0; i < 4; i++) roofVertices.push(outerPts[i].x, hPts[i] + roofThickness, outerPts[i].y);
    const roofIndices = [
      4, 5, 6, 4, 6, 7,  0, 2, 1, 0, 3, 2,
      0, 1, 5, 0, 5, 4,  1, 2, 6, 1, 6, 5,
      2, 3, 7, 2, 7, 6,  3, 0, 4, 3, 4, 7
    ];
    const roofGeo = new THREE.BufferGeometry();
    roofGeo.setAttribute('position', new THREE.Float32BufferAttribute(roofVertices, 3));
    roofGeo.setIndex(roofIndices);
    roofGeo.computeVertexNormals();
    buildingGroup.add(new THREE.Mesh(roofGeo, roofMat));
    buildingGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(roofGeo), edgeLineMat));

    // 5. 天井 (フラット / 勾配)
    if (ceilingType === 'flat') {
      const ceilH = eaveH - 320;
      const cVerts = [
        innerPts[0].x, ceilH, innerPts[0].y,
        innerPts[1].x, ceilH, innerPts[1].y,
        innerPts[2].x, ceilH, innerPts[2].y,
        innerPts[0].x, ceilH, innerPts[0].y,
        innerPts[2].x, ceilH, innerPts[2].y,
        innerPts[3].x, ceilH, innerPts[3].y
      ];
      const cGeo = new THREE.BufferGeometry();
      cGeo.setAttribute('position', new THREE.Float32BufferAttribute(cVerts, 3));
      cGeo.computeVertexNormals();
      buildingGroup.add(new THREE.Mesh(cGeo, ceilingMat));
    } else if (ceilingType === 'sloped') {
      const cVerts = [];
      for (let i = 0; i < 4; i++) cVerts.push(innerPts[i].x, hInnerPts[i] - 10, innerPts[i].y);
      for (let i = 0; i < 4; i++) cVerts.push(innerPts[i].x, hInnerPts[i] - 19.5, innerPts[i].y);
      const cGeo = new THREE.BufferGeometry();
      cGeo.setAttribute('position', new THREE.Float32BufferAttribute(cVerts, 3));
      cGeo.setIndex(roofIndices);
      cGeo.computeVertexNormals();
      buildingGroup.add(new THREE.Mesh(cGeo, ceilingMat));
    }

    // 6. 開口部 (シャッター内付け、引き違い窓、FIX窓、ドア)
    openings.forEach(op => {
      let pLeftCore, pRightCore;
      if (op.wall === 'front') { pLeftCore = corePts[0]; pRightCore = corePts[1]; }
      else if (op.wall === 'right') { pLeftCore = corePts[1]; pRightCore = corePts[2]; }
      else if (op.wall === 'back') { pLeftCore = corePts[2]; pRightCore = corePts[3]; }
      else if (op.wall === 'left') { pLeftCore = corePts[3]; pRightCore = corePts[0]; }
      
      const vWall = new THREE.Vector2().subVectors(pRightCore, pLeftCore);
      const wallDir = vWall.clone().normalize();
      const inNorm = new THREE.Vector2(wallDir.y, -wallDir.x).normalize();
      const outNorm = inNorm.clone().negate();

      const corePos = new THREE.Vector2().addVectors(pLeftCore, wallDir.clone().multiplyScalar(op.clearanceLeft + op.width / 2));
      const angle = -Math.atan2(wallDir.y, wallDir.x);
      const bottomY = isFloorLevelOpening(op.type) ? 50 : Math.max(op.topHeightGL - op.height, 50);
      const fullH = op.topHeightGL - bottomY;

      if (op.type === 'shutter') {
        const shutterPos = corePos.clone().add(inNorm.clone().multiplyScalar(insideOffset));
        const ratio = op.openRatio !== undefined ? op.openRatio : 0;
        const currentH = fullH * (1 - ratio);
        const currentCenterY = op.topHeightGL - currentH / 2;

        const boxGeo = new THREE.BoxGeometry(op.width, 240, 240);
        const boxMesh = new THREE.Mesh(boxGeo, shutterBoxMat);
        boxMesh.position.set(shutterPos.x, op.topHeightGL - 120, shutterPos.y);
        boxMesh.rotation.y = angle;
        buildingGroup.add(boxMesh);

        [-1, 1].forEach(side => {
          const railPos = shutterPos.clone().add(wallDir.clone().multiplyScalar(side * (op.width / 2 - 15)));
          const railGeo = new THREE.BoxGeometry(30, fullH, 40);
          const railMesh = new THREE.Mesh(railGeo, shutterBoxMat);
          railMesh.position.set(railPos.x, bottomY + fullH / 2, railPos.y);
          railMesh.rotation.y = angle;
          buildingGroup.add(railMesh);
        });

        if (currentH > 20) {
          const sGeo = new THREE.BoxGeometry(op.width - 20, currentH, 20);
          const sMesh = new THREE.Mesh(sGeo, shutterMat);
          sMesh.position.set(shutterPos.x, currentCenterY, shutterPos.y);
          sMesh.rotation.y = angle;
          sMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(sGeo), edgeLineMat));
          buildingGroup.add(sMesh);
        }
      } else {
        const semiOuterPos = corePos.clone().add(outNorm.clone().multiplyScalar(WALL_OUTER_OFFSET + 10));

        if (op.type === 'window') {
          const winMesh = createSlidingWindowMesh(op.width, fullH);
          winMesh.position.set(semiOuterPos.x, bottomY + fullH / 2, semiOuterPos.y);
          winMesh.rotation.y = angle;
          buildingGroup.add(winMesh);
        } else if (op.type === 'fix') {
          const fixMesh = createFixWindowMesh(op.width, fullH);
          fixMesh.position.set(semiOuterPos.x, bottomY + fullH / 2, semiOuterPos.y);
          fixMesh.rotation.y = angle;
          buildingGroup.add(fixMesh);
        } else {
          // ドア / 片引き戸 (土間付け・半外付け)
          const doorGeo = new THREE.BoxGeometry(op.width, fullH, 40);
          const doorMesh = new THREE.Mesh(doorGeo, new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.5 }));
          doorMesh.position.set(semiOuterPos.x, bottomY + fullH / 2, semiOuterPos.y);
          doorMesh.rotation.y = angle;
          doorMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(doorGeo), edgeLineMat));
          buildingGroup.add(doorMesh);
        }
      }
    });

    // 7. 内部棚・間仕切りユニット
    shelfUnits.forEach(unit => {
      let pLeftCore, pRightCore;
      if (unit.wall === 'front') { pLeftCore = corePts[0]; pRightCore = corePts[1]; }
      else if (unit.wall === 'right') { pLeftCore = corePts[1]; pRightCore = corePts[2]; }
      else if (unit.wall === 'back') { pLeftCore = corePts[2]; pRightCore = corePts[3]; }
      else if (unit.wall === 'left') { pLeftCore = corePts[3]; pRightCore = corePts[0]; }

      const vWall = new THREE.Vector2().subVectors(pRightCore, pLeftCore);
      const wallDir = vWall.clone().normalize();
      const inNorm = new THREE.Vector2(wallDir.y, -wallDir.x).normalize();
      const shelfAngle = -Math.atan2(wallDir.y, wallDir.x);

      const pInnerStart = pLeftCore.clone().add(inNorm.clone().multiplyScalar(WALL_INNER_OFFSET));
      const shelfCenterLinePos = pInnerStart.clone().add(wallDir.clone().multiplyScalar(unit.clearanceLeft + unit.width / 2));
      const shelfPos = shelfCenterLinePos.clone().add(inNorm.clone().multiplyScalar(unit.depth / 2));

      const partitionThickness = unit.depth <= 600 ? 60 : 90;
      const shelfThickness = 30;
      const maxLevel = Math.max(...unit.levels, 0);
      const partitionH = (maxLevel + 100) - 50;
      const partitionCenterY = 50 + partitionH / 2;

      const numDivisions = Math.ceil(unit.width / 2000);
      const span = unit.width / numDivisions;

      for (let i = 0; i <= numDivisions; i++) {
        const pPart = shelfPos.clone().add(wallDir.clone().multiplyScalar(-unit.width / 2 + i * span));
        const pGeo = new THREE.BoxGeometry(partitionThickness, partitionH, unit.depth);
        const pMesh = new THREE.Mesh(pGeo, woodMat);
        pMesh.position.set(pPart.x, partitionCenterY, pPart.y);
        pMesh.rotation.y = shelfAngle;
        pMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(pGeo), edgeLineMat));
        buildingGroup.add(pMesh);
      }

      unit.levels.forEach(levelGL => {
        const boardCenterY = levelGL - shelfThickness / 2;
        const bGeo = new THREE.BoxGeometry(unit.width, shelfThickness, unit.depth);
        const bMesh = new THREE.Mesh(bGeo, woodMat);
        bMesh.position.set(shelfPos.x, boardCenterY, shelfPos.y);
        bMesh.rotation.y = shelfAngle;
        bMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(bGeo), edgeLineMat));
        buildingGroup.add(bMesh);
      });
    });

    // 8. 車両・スケールモデル (SUV / スポーツ / バイク / ★トラクター)
    vehicles.forEach(veh => {
      const vMesh = createVehicleMesh(veh.type, veh.color);
      vMesh.position.set(veh.posX, 0, veh.posZ);
      vMesh.rotation.y = (veh.rotDeg || 0) * (Math.PI / 180);
      buildingGroup.add(vMesh);
    });

    // 8.5 敷地障害物・隅欠き（凸凹）ゾーンの可視化
    if (dimensions.cornerCutEnabled) {
      const cutW = dimensions.cornerCutWidth || 1500;
      const cutD = dimensions.cornerCutDepth || 1500;
      const pos = dimensions.cornerCutPos || 'back-right';
      
      let cornerX = 0, cornerZ = 0;
      if (pos === 'back-right') {
        cornerX = corePts[2].x - cutW / 2;
        cornerZ = corePts[2].y + cutD / 2;
      } else if (pos === 'back-left') {
        cornerX = corePts[3].x + cutW / 2;
        cornerZ = corePts[3].y + cutD / 2;
      } else if (pos === 'front-right') {
        cornerX = corePts[1].x - cutW / 2;
        cornerZ = corePts[1].y - cutD / 2;
      } else if (pos === 'front-left') {
        cornerX = corePts[0].x + cutW / 2;
        cornerZ = corePts[0].y - cutD / 2;
      }

      const cutGeo = new THREE.BoxGeometry(cutW, 2400, cutD);
      const cutMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.35,
        roughness: 0.7
      });
      const cutMesh = new THREE.Mesh(cutGeo, cutMat);
      cutMesh.position.set(cornerX, 1200, cornerZ);
      cutMesh.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(cutGeo),
        new THREE.LineBasicMaterial({ color: 0xd97706, linewidth: 2 })
      ));
      buildingGroup.add(cutMesh);

      // 電柱・障害物シンボルポール
      const poleGeo = new THREE.CylinderGeometry(100, 100, 3500, 16);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
      const poleMesh = new THREE.Mesh(poleGeo, poleMat);
      poleMesh.position.set(cornerX, 1750, cornerZ);
      buildingGroup.add(poleMesh);
    }

    // 9. 3D寸法線・文字スプライト (gemini-code 完全復元)
    if (show3dDimensions) {
      const pFrontL = new THREE.Vector3(corePts[0].x, 20, corePts[0].y);
      const pFrontR = new THREE.Vector3(corePts[1].x, 20, corePts[1].y);
      addDimensionSegment(pFrontL, pFrontR, `正面芯: ${wF}mm (外寸:${wF + 200})`, new THREE.Vector3(0, 0, 700), dim3dFontScale);

      const pLeftB = new THREE.Vector3(corePts[3].x, 20, corePts[3].y);
      addDimensionSegment(pLeftB, pFrontL, `左奥行芯: ${dL}mm`, new THREE.Vector3(-700, 0, 0), dim3dFontScale);

      const pRightB = new THREE.Vector3(corePts[2].x, 20, corePts[2].y);
      addDimensionSegment(pFrontR, pRightB, `右奥行芯: ${dR}mm`, new THREE.Vector3(700, 0, 0), dim3dFontScale);
      addDimensionSegment(pLeftB, pRightB, `背面芯: ${wB}mm`, new THREE.Vector3(0, 0, -700), dim3dFontScale);

      const minH = Math.min(...hPts);
      const minIdx = hPts.indexOf(minH);
      const pMin = outerPts[minIdx];

      const maxH = Math.max(...hPts);
      const maxIdx = hPts.indexOf(maxH);
      const pMax = outerPts[maxIdx];

      const offsetLow = new THREE.Vector3(-1200, 0, 0);
      const pGL = new THREE.Vector3(pMin.x, 0, pMin.y);
      const pFound = new THREE.Vector3(pMin.x, foundationH, pMin.y);
      addDimensionSegment(pGL, pFound, `基礎高: ${foundationH}mm`, offsetLow, dim3dFontScale);

      const pGirderLow = new THREE.Vector3(pMin.x, minH, pMin.y);
      addDimensionSegment(pGL, pGirderLow, `軒高: ${eaveH}mm`, new THREE.Vector3(-2200, 0, 0), dim3dFontScale);

      const pRoofLowTop = new THREE.Vector3(pMin.x, minH + roofThickness, pMin.y);
      addDimensionSegment(pGirderLow, pRoofLowTop, `屋根厚: ${roofThickness}mm`, offsetLow, dim3dFontScale);

      const maxHeightVal = Math.round(maxH + roofThickness);
      const pGLHigh = new THREE.Vector3(pMax.x, 0, pMax.y);
      const pRoofHighTop = new THREE.Vector3(pMax.x, maxHeightVal, pMax.y);
      addDimensionSegment(pGLHigh, pRoofHighTop, `最高高: ${maxHeightVal}mm`, new THREE.Vector3(1400, 0, 0), dim3dFontScale);
    }
  };


  // -------------------------------------------------------------
  // 建具・車両メッシュビルダー (gemini-code 完全移植)
  // -------------------------------------------------------------
  const createQuadMesh = (p1, p2, p3, p4, mat) => {
    const geo = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      p1.x, p1.y, p1.z,  p2.x, p2.y, p2.z,  p3.x, p3.y, p3.z,
      p1.x, p1.y, p1.z,  p3.x, p3.y, p3.z,  p4.x, p4.y, p4.z
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0x1e293b })));
    return mesh;
  };

  const createSlidingWindowMesh = (width, height) => {
    const group = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.5 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.65 });

    const outerFrameGeo = new THREE.BoxGeometry(width, height, 60);
    group.add(new THREE.Mesh(outerFrameGeo, frameMat));

    const sW = (width - 60) / 2;
    const sH = height - 60;
    const pane1 = new THREE.Mesh(new THREE.BoxGeometry(sW, sH, 20), glassMat);
    pane1.position.set(-sW / 2 + 10, 0, -10);
    const pane2 = new THREE.Mesh(new THREE.BoxGeometry(sW, sH, 20), glassMat);
    pane2.position.set(sW / 2 - 10, 0, 10);

    group.add(pane1, pane2);
    return group;
  };

  const createFixWindowMesh = (width, height) => {
    const group = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.5 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.65 });

    group.add(new THREE.Mesh(new THREE.BoxGeometry(width, height, 60), frameMat));
    group.add(new THREE.Mesh(new THREE.BoxGeometry(width - 60, height - 60, 20), glassMat));
    return group;
  };

  const createVehicleMesh = (type, bodyColorHex) => {
    const group = new THREE.Group();
    const bodyColor = new THREE.Color(bodyColorHex || '#dc2626');
    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.3, metalness: 0.3 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.8, roughness: 0.2 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.1, transparent: true, opacity: 0.7 });

    if (type === 'tractor') {
      // 🚜 ★農業用トラクター (ControlNet Depth/Canny完全認識仕様)
      // 巨大ラグ後輪
      const rearTireGeo = new THREE.CylinderGeometry(650, 650, 420, 24);
      rearTireGeo.rotateZ(Math.PI / 2);
      const rlTire = new THREE.Mesh(rearTireGeo, tireMat); rlTire.position.set(-850, 650, -800);
      const rrTire = rlTire.clone(); rrTire.position.x = 850;
      group.add(rlTire, rrTire);

      // ホイールハブ
      const rearHubGeo = new THREE.CylinderGeometry(320, 320, 430, 16);
      rearHubGeo.rotateZ(Math.PI / 2);
      const rlHub = new THREE.Mesh(rearHubGeo, metalMat); rlHub.position.copy(rlTire.position);
      const rrHub = rlHub.clone(); rrHub.position.copy(rrTire.position);
      group.add(rlHub, rrHub);

      // 小型前輪
      const frontTireGeo = new THREE.CylinderGeometry(400, 400, 260, 20);
      frontTireGeo.rotateZ(Math.PI / 2);
      const flTire = new THREE.Mesh(frontTireGeo, tireMat); flTire.position.set(-680, 400, 1100);
      const frTire = flTire.clone(); frTire.position.x = 680;
      group.add(flTire, frTire);

      // ボンネット・フード
      const hood = new THREE.Mesh(new THREE.BoxGeometry(860, 750, 1600), bodyMat);
      hood.position.set(0, 850, 750);
      group.add(hood);

      // フロントグリル
      const grill = new THREE.Mesh(new THREE.BoxGeometry(800, 600, 40), new THREE.MeshStandardMaterial({ color: 0x111827 }));
      grill.position.set(0, 820, 1555);
      group.add(grill);

      // 排気マフラー
      const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(35, 35, 1100, 12), new THREE.MeshStandardMaterial({ color: 0x374151 }));
      exhaust.position.set(400, 1500, 900);
      group.add(exhaust);

      // 運転席デッキ・シート
      const deck = new THREE.Mesh(new THREE.BoxGeometry(1300, 160, 1200), new THREE.MeshStandardMaterial({ color: 0x374151 }));
      deck.position.set(0, 700, -500);
      const seat = new THREE.Mesh(new THREE.BoxGeometry(550, 650, 500), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      seat.position.set(0, 1050, -500);
      group.add(deck, seat);

      // ROPS 安全フレーム・キャノピー
      const ropsPillarGeo = new THREE.CylinderGeometry(40, 40, 1600, 8);
      const ropsLeft = new THREE.Mesh(ropsPillarGeo, new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      ropsLeft.position.set(-580, 1750, -750);
      const ropsRight = ropsLeft.clone(); ropsRight.position.x = 580;
      const roofCap = new THREE.Mesh(new THREE.BoxGeometry(1300, 50, 1400), bodyMat);
      roofCap.position.set(0, 2600, -350);
      group.add(ropsLeft, ropsRight, roofCap);

    } else if (type === 'car_suv') {
      const body = new THREE.Mesh(new THREE.BoxGeometry(1850, 750, 4600), bodyMat);
      body.position.y = 750;
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1650, 750, 2800), glassMat);
      cabin.position.set(0, 1450, -200);

      const tireGeo = new THREE.CylinderGeometry(360, 360, 240, 16);
      tireGeo.rotateZ(Math.PI / 2);
      const fl = new THREE.Mesh(tireGeo, tireMat); fl.position.set(-900, 360, 1400);
      const fr = fl.clone(); fr.position.x = 900;
      const rl = fl.clone(); rl.position.z = -1400;
      const rr = fr.clone(); rr.position.z = -1400;
      group.add(body, cabin, fl, fr, rl, rr);

    } else if (type === 'car_sport') {
      const body = new THREE.Mesh(new THREE.BoxGeometry(1800, 450, 4400), bodyMat);
      body.position.y = 450;
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1500, 550, 2200), glassMat);
      cabin.position.set(0, 950, -300);

      const tireGeo = new THREE.CylinderGeometry(320, 320, 240, 16);
      tireGeo.rotateZ(Math.PI / 2);
      const fl = new THREE.Mesh(tireGeo, tireMat); fl.position.set(-880, 320, 1300);
      const fr = fl.clone(); fr.position.x = 880;
      const rl = fl.clone(); rl.position.z = -1300;
      const rr = fr.clone(); rr.position.z = -1300;
      group.add(body, cabin, fl, fr, rl, rr);

    } else if (type === 'bike') {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(380, 600, 1600), bodyMat);
      frame.position.y = 650;
      const tireGeo = new THREE.CylinderGeometry(320, 320, 160, 16);
      tireGeo.rotateZ(Math.PI / 2);
      const fTire = new THREE.Mesh(tireGeo, tireMat); fTire.position.set(0, 320, 800);
      const rTire = fTire.clone(); rTire.position.z = -800;
      const steer = new THREE.Mesh(new THREE.BoxGeometry(750, 50, 60), metalMat);
      steer.position.set(0, 1050, 600);
      group.add(frame, fTire, rTire, steer);
    }

    return group;
  };

  // -------------------------------------------------------------
  // 3D寸法線・スプライト描画 (gemini-code 完全復元)
  // -------------------------------------------------------------
  const makeTextSprite = (message, scaleFactor = 1.0) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 256;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    if (ctx.roundRect) {
      ctx.roundRect(16, 16, 992, 224, 28);
    } else {
      ctx.rect(16, 16, 992, 224);
    }
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.font = 'bold 84px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, 512, 128);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false }));
    sprite.scale.set(1800 * scaleFactor, 450 * scaleFactor, 1);
    return sprite;
  };

  const addDimensionSegment = (pA, pB, labelText, offsetVec, scaleFactor = 1.0) => {
    const { dimGroup } = threeRef.current;
    if (!dimGroup) return;

    const dimLineMat = new THREE.LineBasicMaterial({ color: 0x0284c7, linewidth: 2 });
    const start = pA.clone().add(offsetVec);
    const end = pB.clone().add(offsetVec);

    // 主寸法線と引き出し線
    dimGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([start, end]), dimLineMat));
    dimGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([pA, start]), dimLineMat));
    dimGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([pB, end]), dimLineMat));

    // 両端ティック
    const dir = new THREE.Vector3().subVectors(end, start).normalize();
    let tickNormal = new THREE.Vector3(0, 1, 0);
    if (Math.abs(dir.y) > 0.9) tickNormal = new THREE.Vector3(1, 0, 0);
    const tickLen = 120 * scaleFactor;
    dimGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        start.clone().addScaledVector(tickNormal, tickLen),
        start.clone().addScaledVector(tickNormal, -tickLen)
      ]),
      dimLineMat
    ));
    dimGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        end.clone().addScaledVector(tickNormal, tickLen),
        end.clone().addScaledVector(tickNormal, -tickLen)
      ]),
      dimLineMat
    ));

    // 寸法文字スプライト
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const textSprite = makeTextSprite(labelText, scaleFactor);
    textSprite.position.copy(mid).add(new THREE.Vector3(0, 160 * scaleFactor, 0));
    dimGroup.add(textSprite);
  };


  // -------------------------------------------------------------
  // 積算計算 & 計算式表示 (gemini-code 完全移植)
  // -------------------------------------------------------------
  const updateCalculations = (corePts, outerPts, hPts, roofThickness, slopeVal) => {
    const { wFront: wF, wBack: wB, dLeft: dL, dRight: dR } = dimensions;

    // 1. 床面積
    let floorMm2 = 0;
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      floorMm2 += corePts[i].x * corePts[j].y - corePts[j].x * corePts[i].y;
    }
    const floorAreaM2 = Math.abs(floorMm2) / 2 / 1000000;
    const tsubo = floorAreaM2 * 0.3025;
    const floorFormula = `[(間口平均 ${(wF + wB) / 2}mm) × (奥行平均 ${(dL + dR) / 2}mm)]`;
    const floorVal = `${floorAreaM2.toFixed(2)} ㎡ (${tsubo.toFixed(2)} 坪)`;

    // 2. 基礎長さ
    const fL0 = outerPts[0].distanceTo(outerPts[1]);
    const fL1 = outerPts[1].distanceTo(outerPts[2]);
    const fL2 = outerPts[2].distanceTo(outerPts[3]);
    const fL3 = outerPts[3].distanceTo(outerPts[0]);
    const totalFoundM = (fL0 + fL1 + fL2 + fL3) / 1000;
    const foundFormula = `正:${(fL0 / 1000).toFixed(2)}m + 右:${(fL1 / 1000).toFixed(2)}m + 裏:${(fL2 / 1000).toFixed(2)}m + 左:${(fL3 / 1000).toFixed(2)}m`;
    const foundVal = `全周: ${totalFoundM.toFixed(2)} m`;

    // 3. 屋根実面積
    let roofProjMm2 = 0;
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      roofProjMm2 += outerPts[i].x * outerPts[j].y - outerPts[j].x * outerPts[i].y;
    }
    const roofProjM2 = Math.abs(roofProjMm2) / 2 / 1000000;
    const slopeRatio = slopeVal / 10.0;
    const slopeFactor = Math.sqrt(1 + slopeRatio * slopeRatio);
    const roofRealM2 = roofProjM2 * slopeFactor;
    const roofFormula = `(水平投影面積 ${roofProjM2.toFixed(2)}㎡) × (勾配係数 √[1+(${slopeVal}/10)²] = ${slopeFactor.toFixed(3)})`;
    const roofVal = `${roofRealM2.toFixed(2)} ㎡`;

    // 4. 開口部面積
    let totalOpM2 = 0;
    const opDetails = openings.map(op => {
      const area = (op.width / 1000) * (op.height / 1000);
      totalOpM2 += area;
      return `${op.wall === 'front' ? '正' : op.wall === 'right' ? '右' : op.wall === 'back' ? '裏' : '左'}: ${op.type} (${(op.width / 1000).toFixed(2)}m × ${(op.height / 1000).toFixed(2)}m = ${area.toFixed(2)}㎡)`;
    });
    const openingsFormula = opDetails.length > 0 ? opDetails.join('\n') : '開口部なし';
    const openingsVal = `総面積: ${totalOpM2.toFixed(2)} ㎡`;

    // 5. 外壁各面面積 (正・裏・右・左)
    const getWallData = (pA, pB, hA, hB, wKey, nameJp) => {
      const lenM = pA.distanceTo(pB) / 1000;
      const hAM = (hA - dimensions.foundationHeight) / 1000;
      const hBM = (hB - dimensions.foundationHeight) / 1000;
      const grossM2 = ((hAM + hBM) / 2) * lenM;
      let wOpM2 = 0;
      openings.filter(op => op.wall === wKey).forEach(op => {
        wOpM2 += (op.width / 1000) * (op.height / 1000);
      });
      const netM2 = Math.max(0, grossM2 - wOpM2);
      return {
        formula: `${nameJp}: [(${hAM.toFixed(2)}m+${hBM.toFixed(2)}m)/2 × ${lenM.toFixed(2)}m] - 控除${wOpM2.toFixed(2)}㎡ = 純壁 ${netM2.toFixed(2)}㎡`,
        netM2: netM2
      };
    };

    const w0 = getWallData(outerPts[0], outerPts[1], hPts[0], hPts[1], 'front', '正面');
    const w1 = getWallData(outerPts[1], outerPts[2], hPts[1], hPts[2], 'right', '右面');
    const w2 = getWallData(outerPts[2], outerPts[3], hPts[2], hPts[3], 'back', '裏面');
    const w3 = getWallData(outerPts[3], outerPts[0], hPts[3], hPts[0], 'left', '左面');
    const totalNetWallM2 = w0.netM2 + w1.netM2 + w2.netM2 + w3.netM2;
    const wallsFormula = `${w0.formula}\n${w1.formula}\n${w2.formula}\n${w3.formula}`;
    const wallsVal = `純外壁総面積: ${totalNetWallM2.toFixed(2)} ㎡`;

    // 概算建築費用目安算出 (坪22万円〜 + 基礎・開口部・屋根係数)
    const approxCost = Math.round((tsubo * 220000 + totalFoundM * 25000 + roofRealM2 * 18000 + totalOpM2 * 45000) / 10000) * 10000;

    setCalculations({
      floorFormula,
      floorVal,
      foundFormula,
      foundVal,
      roofFormula,
      roofVal,
      openingsFormula,
      openingsVal,
      wallsFormula,
      wallsVal,
      approxCost
    });
  };

  // 幾何計算ヘルパー & 角度計算
  const calculateAngles = (corePts) => {
    if (!corePts || corePts.length < 4) return { angleLeft: 90, angleRight: 90 };
    const [p0, p1, p2, p3] = corePts;
    // 左壁: p0からp3へのベクトル (正面に対する開き角度)
    const dxLeft = p0.x - p3.x; // p3が左に張り出すと正
    const dyLeft = -(p3.y - p0.y);
    const angleLeft = dyLeft > 0 ? Math.round((90 + Math.atan2(dxLeft, dyLeft) * 180 / Math.PI) * 10) / 10 : 90;

    // 右壁: p1からp2へのベクトル (正面に対する開き角度)
    const dxRight = p2.x - p1.x; // p2が右に張り出すと正
    const dyRight = -(p2.y - p1.y);
    const angleRight = dyRight > 0 ? Math.round((90 + Math.atan2(dxRight, dyRight) * 180 / Math.PI) * 10) / 10 : 90;

    return { angleLeft, angleRight };
  };

  const getCorePoints = (wF, wB, dL, dR, shapeType = 'regular', skewOffset = 0) => {
    const p0 = new THREE.Vector2(-wF / 2, 0);
    const p1 = new THREE.Vector2(wF / 2, 0);

    let p2, p3;
    if (shapeType === 'trapezoid_right_angle_left') {
      // 左直角台形: 左壁が正面に対して直角(90°垂直)
      p3 = new THREE.Vector2(-wF / 2, -dL);
      p2 = new THREE.Vector2(-wF / 2 + wB, -dR);
    } else if (shapeType === 'trapezoid_right_angle_right') {
      // 右直角台形: 右壁が正面に対して直角(90°垂直)
      p2 = new THREE.Vector2(wF / 2, -dR);
      p3 = new THREE.Vector2(wF / 2 - wB, -dL);
    } else if (shapeType === 'trapezoid_free') {
      // 自由偏芯台形: 背面中心が skewOffset だけ左右にシフト
      p2 = new THREE.Vector2(skewOffset + wB / 2, -dR);
      p3 = new THREE.Vector2(skewOffset - wB / 2, -dL);
    } else {
      // regular / 等脚台形
      const backOffset = (wF - wB) / 2;
      p2 = new THREE.Vector2(wF / 2 - backOffset, -dR);
      p3 = new THREE.Vector2(-wF / 2 + backOffset, -dL);
    }

    return [p0, p1, p2, p3];
  };

  const getOffsetPoints = (corePts, offset) => {
    const n = corePts.length;
    const lines = [];
    for (let i = 0; i < n; i++) {
      const next = (i + 1) % n;
      const pA = corePts[i];
      const pB = corePts[next];
      const v = new THREE.Vector2().subVectors(pB, pA).normalize();
      const norm = new THREE.Vector2(-v.y, v.x);
      lines.push({ p: new THREE.Vector2().addVectors(pA, norm.clone().multiplyScalar(offset)), v });
    }
    const out = [];
    for (let i = 0; i < n; i++) {
      const prev = (i + n - 1) % n;
      const l1 = lines[prev];
      const l2 = lines[i];
      const det = l1.v.x * l2.v.y - l1.v.y * l2.v.x;
      if (Math.abs(det) < 1e-6) out.push(corePts[i].clone());
      else {
        const dp = new THREE.Vector2().subVectors(l2.p, l1.p);
        const t = (dp.x * l2.v.y - dp.y * l2.v.x) / det;
        out.push(new THREE.Vector2(l1.p.x + t * l1.v.x, l1.p.y + t * l1.v.y));
      }
    }
    return out;
  };

  const getGirderHeight = (point, bounds, baseEaveH, slopeVal, dir) => {
    const slopeRatio = slopeVal / 10.0;
    let distFromLow = 0;
    if (dir === 'front-to-back') distFromLow = point.y - bounds.minY;
    else if (dir === 'back-to-front') distFromLow = bounds.maxY - point.y;
    else if (dir === 'left-to-right') distFromLow = bounds.maxX - point.x;
    else if (dir === 'right-to-left') distFromLow = point.x - bounds.minX;
    return baseEaveH + distFromLow * slopeRatio;
  };

  // -------------------------------------------------------------
  // 2Dベクトル製図 (SVG描画 - gemini-code 完全復元)
  // -------------------------------------------------------------
  const renderSvgDrawings = () => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.innerHTML = '';

    const { wFront: wF, wBack: wB, dLeft: dL, dRight: dR, eaveHeight: eaveH, foundationHeight: foundationH, roofSlope: slope, slopeDirection: slopeDir, shapeType, skewOffset } = dimensions;

    const corePts = getCorePoints(wF, wB, dL, dR, shapeType, skewOffset);
    const outerPts = getOffsetPoints(corePts, WALL_OUTER_OFFSET);

    const bounds = {
      minX: Math.min(...outerPts.map(p => p.x)),
      maxX: Math.max(...outerPts.map(p => p.x)),
      minY: Math.min(...outerPts.map(p => p.y)),
      maxY: Math.max(...outerPts.map(p => p.y))
    };
    const hPts = outerPts.map(p => getGirderHeight(p, bounds, eaveH, slope, slopeDir));
    const roofThickness = Math.round(100 + (slope * 2));

    let elements = [];
    const baseFontSize = Math.round(135 * dimFontScale);
    const tickLen = Math.round(40 * dimFontScale);

    const drawDim2DLocal = (x1, y1, x2, y2, text, offset, isVertical = false) => {
      let nx = isVertical ? offset : 0;
      let ny = isVertical ? 0 : offset;
      const sx = x1 + nx, sy = y1 + ny;
      const ex = x2 + nx, ey = y2 + ny;

      elements.push(`<line x1="${sx}" y1="${sy}" x2="${x1}" y2="${y1}" stroke="#94a3b8" stroke-width="4" stroke-dasharray="10,10"/>`);
      elements.push(`<line x1="${ex}" y1="${ey}" x2="${x2}" y2="${y2}" stroke="#94a3b8" stroke-width="4" stroke-dasharray="10,10"/>`);
      elements.push(`<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="#0284c7" stroke-width="6"/>`);
      
      if (isVertical) {
        elements.push(`<line x1="${sx - tickLen}" y1="${sy}" x2="${sx + tickLen}" y2="${sy}" stroke="#0284c7" stroke-width="6"/>`);
        elements.push(`<line x1="${ex - tickLen}" y1="${ey}" x2="${ex + tickLen}" y2="${ey}" stroke="#0284c7" stroke-width="6"/>`);
      } else {
        elements.push(`<line x1="${sx}" y1="${sy - tickLen}" x2="${sx}" y2="${sy + tickLen}" stroke="#0284c7" stroke-width="6"/>`);
        elements.push(`<line x1="${ex}" y1="${ey - tickLen}" x2="${ex}" y2="${ey + tickLen}" stroke="#0284c7" stroke-width="6"/>`);
      }

      const midX = (sx + ex) / 2;
      const midY = (sy + ey) / 2;
      const approxCharW = baseFontSize * 0.65;
      const bgW = text.length * approxCharW + 50;
      const bgH = baseFontSize + 36;

      let tx = midX; let ty = midY;
      if (isVertical) tx = sx + (offset > 0 ? (bgW / 2 + 35) : -(bgW / 2 + 35));
      else ty = sy + (offset > 0 ? (bgH / 2 + 35) : -(bgH / 2 + 35));

      elements.push(`<rect x="${tx - bgW/2}" y="${ty - bgH/2}" width="${bgW}" height="${bgH}" fill="rgba(255, 255, 255, 0.96)" stroke="#0284c7" stroke-width="3" rx="10"/>`);
      elements.push(`<text x="${tx}" y="${ty}" fill="#0f172a" font-size="${baseFontSize}" font-weight="bold" text-anchor="middle" dominant-baseline="central">${text}</text>`);
    };

    let vbMinX, vbMinY, vbW, vbH;

    if (currentView === 'plan') {
      const toSvg = p => ({ x: p.x, y: p.y });
      const sc0 = toSvg(corePts[0]), sc1 = toSvg(corePts[1]), sc2 = toSvg(corePts[2]), sc3 = toSvg(corePts[3]);
      const so0 = toSvg(outerPts[0]), so1 = toSvg(outerPts[1]), so2 = toSvg(outerPts[2]), so3 = toSvg(outerPts[3]);

      // 外壁ライン
      elements.push(`<polygon points="${so0.x},${so0.y} ${so1.x},${so1.y} ${so2.x},${so2.y} ${so3.x},${so3.y}" fill="#f8fafc" stroke="#64748b" stroke-width="6"/>`);
      // 柱芯線 (赤一点鎖線)
      elements.push(`<polygon points="${sc0.x},${sc0.y} ${sc1.x},${sc1.y} ${sc2.x},${sc2.y} ${sc3.x},${sc3.y}" fill="none" stroke="#ef4444" stroke-width="6" stroke-dasharray="24,8,6,8"/>`);

      // 4隅の柱 (105mm角)
      [sc0, sc1, sc2, sc3].forEach(pt => {
        elements.push(`<rect x="${pt.x - 52.5}" y="${pt.y - 52.5}" width="105" height="105" fill="#cbd5e1" stroke="#1e293b" stroke-width="4"/>`);
      });

      // 水流方向矢印
      const midDepthY = -(dL + dR) / 4;
      let rotDeg = 0;
      if (slopeDir === 'front-to-back') rotDeg = 180;
      else if (slopeDir === 'back-to-front') rotDeg = 0;
      else if (slopeDir === 'left-to-right') rotDeg = 90;
      else if (slopeDir === 'right-to-left') rotDeg = -90;

      elements.push(`
        <g transform="translate(0, ${midDepthY})">
          <g transform="rotate(${rotDeg})">
            <line x1="0" y1="-250" x2="0" y2="250" stroke="#0284c7" stroke-width="12"/>
            <polygon points="0,320 -70,220 70,220" fill="#0284c7"/>
          </g>
          <text x="0" y="-300" font-size="${baseFontSize * 1.1}" font-weight="bold" fill="#0284c7" text-anchor="middle">水流方向 (${slope}寸勾配)</text>
        </g>
      `);

      // 平面図上の開口部
      openings.forEach(op => {
        let pA, pB;
        if (op.wall === 'front') { pA = corePts[0]; pB = corePts[1]; }
        else if (op.wall === 'right') { pA = corePts[1]; pB = corePts[2]; }
        else if (op.wall === 'back') { pA = corePts[2]; pB = corePts[3]; }
        else { pA = corePts[3]; pB = corePts[0]; }

        const dir = new THREE.Vector2().subVectors(pB, pA).normalize();
        const opStart = new THREE.Vector2().addVectors(pA, dir.clone().multiplyScalar(op.clearanceLeft));
        const opEnd = new THREE.Vector2().addVectors(opStart, dir.clone().multiplyScalar(op.width));
        const sopS = toSvg(opStart), sopE = toSvg(opEnd);

        let strokeColor = (op.type === 'shutter') ? '#0f172a' : ((op.type === 'door' || op.type === 'sliding_door') ? '#059669' : '#0284c7');
        elements.push(`<line x1="${sopS.x}" y1="${sopS.y}" x2="${sopE.x}" y2="${sopE.y}" stroke="#ffffff" stroke-width="26"/>`);
        elements.push(`<line x1="${sopS.x}" y1="${sopS.y}" x2="${sopE.x}" y2="${sopE.y}" stroke="${strokeColor}" stroke-width="16"/>`);
      });

      // 車両フットプリント
      vehicles.forEach(veh => {
        let vW = 1850, vL = 4800, label = 'SUV';
        if (veh.type === 'car_sport') { vW = 1800; vL = 4500; label = 'SPORT'; }
        else if (veh.type === 'bike') { vW = 800; vL = 2100; label = 'BIKE'; }
        else if (veh.type === 'tractor') { vW = 1600; vL = 3400; label = 'TRACTOR'; }
        
        elements.push(`
          <g transform="translate(${veh.posX}, ${veh.posZ}) rotate(${veh.rotDeg || 0})">
            <rect x="${-vW/2}" y="${-vL/2}" width="${vW}" height="${vL}" rx="60" fill="rgba(30, 41, 59, 0.15)" stroke="#0f172a" stroke-width="4"/>
            <polygon points="0,${-vL/2 + 80} -50,${-vL/2 + 200} 50,${-vL/2 + 200}" fill="#0f172a"/>
            <text x="0" y="20" font-size="100" font-weight="bold" fill="#0f172a" text-anchor="middle">${label}</text>
          </g>
        `);
      });

      const offFront = Math.max(650, baseFontSize * 4.0);
      const offSide = Math.max(750, baseFontSize * 4.5);

      drawDim2DLocal(sc0.x, sc0.y, sc1.x, sc1.y, `正面 柱芯: ${wF}mm`, offFront);
      drawDim2DLocal(sc1.x, sc1.y, sc2.x, sc2.y, `右奥行 柱芯: ${dR}mm`, offSide, true);
      drawDim2DLocal(sc3.x, sc3.y, sc2.x, sc2.y, `背面 柱芯: ${wB}mm`, -offFront);
      drawDim2DLocal(sc0.x, sc0.y, sc3.x, sc3.y, `左奥行 柱芯: ${dL}mm`, -offSide, true);

      const titleY = Math.min(-dL, -dR) - offFront - 500;
      elements.push(`<text x="0" y="${titleY}" font-size="${baseFontSize * 1.3}" font-weight="bold" fill="#0f172a" text-anchor="middle">平面図 (赤破線: 柱芯 / 外側線: 仕上ふかし+100mm)</text>`);

      const allX = [sc0.x, sc1.x, sc2.x, sc3.x, so0.x, so1.x, so2.x, so3.x];
      const allY = [sc0.y, sc1.y, sc2.y, sc3.y, so0.y, so1.y, so2.y, so3.y];
      const padX = offSide + 1500;
      const padY = offFront + 1200;
      vbMinX = Math.min(...allX) - padX;
      vbW = Math.max(...allX) + padX - vbMinX;
      vbMinY = titleY - 300;
      vbH = Math.max(...allY) + padY - vbMinY;

    } else if (currentView === 'front-elev' || currentView === 'back-elev') {
      const isFront = currentView === 'front-elev';
      const wallName = isFront ? 'front' : 'back';
      const wSpan = isFront ? wF : wB;
      const totalW = wSpan + WALL_OUTER_OFFSET * 2;
      const idxL = isFront ? 0 : 3;
      const idxR = isFront ? 1 : 2;

      const hL = hPts[idxL], hR = hPts[idxR];

      const coreX1 = -wSpan / 2;
      const coreX2 = wSpan / 2;
      const outerX1 = coreX1 - WALL_OUTER_OFFSET;
      const outerX2 = coreX2 + WALL_OUTER_OFFSET;

      const baseGL_Y = 0;
      const fFoundY = -foundationH;
      const fGirdY1 = -hL;
      const fGirdY2 = -hR;
      const fRoofY1 = fGirdY1 - roofThickness;
      const fRoofY2 = fGirdY2 - roofThickness;

      // GL地盤線
      elements.push(`<line x1="${outerX1 - 1400}" y1="${baseGL_Y}" x2="${outerX2 + 1400}" y2="${baseGL_Y}" stroke="#64748b" stroke-width="6"/>`);
      elements.push(`<text x="${outerX1 - 1300}" y="${baseGL_Y + 90}" font-size="${baseFontSize}" font-weight="bold" fill="#64748b">▼ 設計GL (±0)</text>`);

      // 基礎コンクリート (床付け開口部の切り欠き連動)
      const floorOps = openings.filter(op => op.wall === wallName && isFloorLevelOpening(op.type));
      if (floorOps.length === 0) {
        elements.push(`<rect x="${outerX1}" y="${fFoundY}" width="${totalW}" height="${foundationH}" fill="#94a3b8" stroke="#1e293b" stroke-width="4"/>`);
      } else {
        let curFoundX = outerX1;
        floorOps.sort((a,b) => a.clearanceLeft - b.clearanceLeft).forEach(fOp => {
          const sX1 = coreX1 + fOp.clearanceLeft;
          const sX2 = sX1 + fOp.width;
          if (sX1 > curFoundX) {
            elements.push(`<rect x="${curFoundX}" y="${fFoundY}" width="${sX1 - curFoundX}" height="${foundationH}" fill="#94a3b8" stroke="#1e293b" stroke-width="4"/>`);
          }
          curFoundX = sX2;
        });
        if (curFoundX < outerX2) {
          elements.push(`<rect x="${curFoundX}" y="${fFoundY}" width="${outerX2 - curFoundX}" height="${foundationH}" fill="#94a3b8" stroke="#1e293b" stroke-width="4"/>`);
        }
      }

      // 外壁ポリゴン
      elements.push(`<polygon points="${outerX1},${fFoundY} ${outerX2},${fFoundY} ${outerX2},${fGirdY2} ${outerX1},${fGirdY1}" fill="#f8fafc" stroke="#1e293b" stroke-width="4"/>`);

      // 柱芯線 (赤一点鎖線)
      elements.push(`<line x1="${coreX1}" y1="${baseGL_Y + 100}" x2="${coreX1}" y2="${fRoofY1 - 100}" stroke="#ef4444" stroke-width="4" stroke-dasharray="18,6,4,6"/>`);
      elements.push(`<line x1="${coreX2}" y1="${baseGL_Y + 100}" x2="${coreX2}" y2="${fRoofY2 - 100}" stroke="#ef4444" stroke-width="4" stroke-dasharray="18,6,4,6"/>`);
      elements.push(`<text x="${coreX1}" y="${baseGL_Y + 150}" font-size="${baseFontSize * 0.9}" fill="#ef4444" font-weight="bold" text-anchor="middle">柱芯</text>`);
      elements.push(`<text x="${coreX2}" y="${baseGL_Y + 150}" font-size="${baseFontSize * 0.9}" fill="#ef4444" font-weight="bold" text-anchor="middle">柱芯</text>`);

      // 屋根スラブ
      elements.push(`<polygon points="${outerX1},${fGirdY1} ${outerX2},${fGirdY2} ${outerX2},${fRoofY2} ${outerX1},${fRoofY1}" fill="#334155" stroke="#1e293b" stroke-width="4"/>`);

      // 開口部 (シャッター / 建具)
      openings.filter(op => op.wall === wallName).forEach(op => {
        const opLeftX = coreX1 + op.clearanceLeft;
        const opW = op.width;
        const opTopY = -op.topHeightGL;
        const opH = isFloorLevelOpening(op.type) ? op.topHeightGL - 50 : op.topHeightGL - Math.max(op.topHeightGL - op.height, 50);

        let fillC = (op.type === 'shutter') ? '#334155' : ((op.type === 'door' || op.type === 'sliding_door') ? '#475569' : '#38bdf8');
        elements.push(`<rect x="${opLeftX}" y="${opTopY}" width="${opW}" height="${opH}" fill="${fillC}" stroke="#1e293b" stroke-width="4"/>`);
        elements.push(`<text x="${opLeftX + opW/2}" y="${opTopY + opH/2}" fill="#fff" font-size="${baseFontSize * 0.85}" font-weight="bold" text-anchor="middle" dominant-baseline="central">${op.width}×${op.height}</text>`);
      });

      // 寸法線
      const offH1 = Math.max(500, baseFontSize * 3.8);
      const offH2 = offH1 + Math.max(450, baseFontSize * 3.2);
      drawDim2DLocal(coreX1, baseGL_Y, coreX2, baseGL_Y, `柱芯間口: ${wSpan}mm`, offH1);
      drawDim2DLocal(outerX1, baseGL_Y, outerX2, baseGL_Y, `仕上全幅: ${totalW}mm`, offH2);
      drawDim2DLocal(outerX1, baseGL_Y, coreX1, baseGL_Y, `${WALL_OUTER_OFFSET}`, 220);
      drawDim2DLocal(coreX2, baseGL_Y, outerX2, baseGL_Y, `${WALL_OUTER_OFFSET}`, 220);

      const offV1 = Math.max(550, baseFontSize * 4.2);
      const offV2 = offV1 + Math.max(550, baseFontSize * 4.2);
      drawDim2DLocal(outerX1, baseGL_Y, outerX1, fFoundY, `基礎高: ${foundationH}mm`, -offV1, true);
      drawDim2DLocal(outerX1, baseGL_Y, outerX1, fGirdY1, `左軒高: ${Math.round(hL)}mm`, -offV2, true);
      drawDim2DLocal(outerX2, baseGL_Y, outerX2, fGirdY2, `右軒高: ${Math.round(hR)}mm`, offV1, true);

      const titleY = Math.min(fRoofY1, fRoofY2) - 500;
      elements.push(`<text x="0" y="${titleY}" font-size="${baseFontSize * 1.3}" font-weight="bold" fill="#0f172a" text-anchor="middle">${isFront ? '正立面図' : '裏立面図'} (両端柱芯より各100mmふかし施工)</text>`);

      vbMinX = outerX1 - offV2 - 1400;
      vbW = totalW + offV2 * 2 + 2800;
      vbMinY = titleY - 300;
      vbH = baseGL_Y + offH2 + 1000 - vbMinY;

    } else if (currentView === 'left-elev' || currentView === 'right-elev') {
      const isLeft = currentView === 'left-elev';
      const sideWallName = isLeft ? 'left' : 'right';
      const dSide = isLeft ? dL : dR;
      const totalD = dSide + WALL_OUTER_OFFSET * 2;
      const idxA = isLeft ? 0 : 1;
      const idxB = isLeft ? 3 : 2;
      const hA = hPts[idxA], hB = hPts[idxB];

      const coreX1 = -dSide / 2;
      const coreX2 = dSide / 2;
      const outerX1 = coreX1 - WALL_OUTER_OFFSET;
      const outerX2 = coreX2 + WALL_OUTER_OFFSET;

      const baseGL_Y = 0;
      const sFoundY = -foundationH;
      const sGirdY1 = -hA;
      const sGirdY2 = -hB;
      const sRoofY1 = sGirdY1 - roofThickness;
      const sRoofY2 = sGirdY2 - roofThickness;

      // GL地盤線
      elements.push(`<line x1="${outerX1 - 1400}" y1="${baseGL_Y}" x2="${outerX2 + 1400}" y2="${baseGL_Y}" stroke="#64748b" stroke-width="6"/>`);
      elements.push(`<text x="${outerX1 - 1300}" y="${baseGL_Y + 90}" font-size="${baseFontSize}" font-weight="bold" fill="#64748b">▼ 設計GL (±0)</text>`);

      // 基礎コンクリート
      const floorOps = openings.filter(op => op.wall === sideWallName && isFloorLevelOpening(op.type));
      if (floorOps.length === 0) {
        elements.push(`<rect x="${outerX1}" y="${sFoundY}" width="${totalD}" height="${foundationH}" fill="#94a3b8" stroke="#1e293b" stroke-width="4"/>`);
      } else {
        let curFoundX = outerX1;
        floorOps.sort((a,b) => a.clearanceLeft - b.clearanceLeft).forEach(fOp => {
          const sX1 = coreX1 + fOp.clearanceLeft;
          const sX2 = sX1 + fOp.width;
          if (sX1 > curFoundX) {
            elements.push(`<rect x="${curFoundX}" y="${sFoundY}" width="${sX1 - curFoundX}" height="${foundationH}" fill="#94a3b8" stroke="#1e293b" stroke-width="4"/>`);
          }
          curFoundX = sX2;
        });
        if (curFoundX < outerX2) {
          elements.push(`<rect x="${curFoundX}" y="${sFoundY}" width="${outerX2 - curFoundX}" height="${foundationH}" fill="#94a3b8" stroke="#1e293b" stroke-width="4"/>`);
        }
      }

      // 外壁ポリゴン
      elements.push(`<polygon points="${outerX1},${sFoundY} ${outerX2},${sFoundY} ${outerX2},${sGirdY2} ${outerX1},${sGirdY1}" fill="#f8fafc" stroke="#1e293b" stroke-width="4"/>`);

      // 柱芯線 (赤一点鎖線)
      elements.push(`<line x1="${coreX1}" y1="${baseGL_Y + 100}" x2="${coreX1}" y2="${sRoofY1 - 100}" stroke="#ef4444" stroke-width="4" stroke-dasharray="18,6,4,6"/>`);
      elements.push(`<line x1="${coreX2}" y1="${baseGL_Y + 100}" x2="${coreX2}" y2="${sRoofY2 - 100}" stroke="#ef4444" stroke-width="4" stroke-dasharray="18,6,4,6"/>`);
      elements.push(`<text x="${coreX1}" y="${baseGL_Y + 150}" font-size="${baseFontSize * 0.9}" fill="#ef4444" font-weight="bold" text-anchor="middle">柱芯</text>`);
      elements.push(`<text x="${coreX2}" y="${baseGL_Y + 150}" font-size="${baseFontSize * 0.9}" fill="#ef4444" font-weight="bold" text-anchor="middle">柱芯</text>`);

      // 屋根スラブ
      elements.push(`<polygon points="${outerX1},${sGirdY1} ${outerX2},${sGirdY2} ${outerX2},${sRoofY2} ${outerX1},${sRoofY1}" fill="#334155" stroke="#1e293b" stroke-width="4"/>`);

      // 開口部
      openings.filter(op => op.wall === sideWallName).forEach(op => {
        const opLeftX = coreX1 + op.clearanceLeft;
        const opW = op.width;
        const opTopY = -op.topHeightGL;
        const opH = isFloorLevelOpening(op.type) ? op.topHeightGL - 50 : op.topHeightGL - Math.max(op.topHeightGL - op.height, 50);

        let fillC = (op.type === 'shutter') ? '#334155' : ((op.type === 'door' || op.type === 'sliding_door') ? '#475569' : '#38bdf8');
        elements.push(`<rect x="${opLeftX}" y="${opTopY}" width="${opW}" height="${opH}" fill="${fillC}" stroke="#1e293b" stroke-width="4"/>`);
        elements.push(`<text x="${opLeftX + opW/2}" y="${opTopY + opH/2}" fill="#fff" font-size="${baseFontSize * 0.85}" font-weight="bold" text-anchor="middle" dominant-baseline="central">${op.width}×${op.height}</text>`);
      });

      // 寸法線
      const offH1 = Math.max(500, baseFontSize * 3.8);
      const offH2 = offH1 + Math.max(450, baseFontSize * 3.2);
      drawDim2DLocal(coreX1, baseGL_Y, coreX2, baseGL_Y, `柱芯奥行: ${dSide}mm`, offH1);
      drawDim2DLocal(outerX1, baseGL_Y, outerX2, baseGL_Y, `仕上全奥行: ${totalD}mm`, offH2);
      drawDim2DLocal(outerX1, baseGL_Y, coreX1, baseGL_Y, `${WALL_OUTER_OFFSET}`, 220);
      drawDim2DLocal(coreX2, baseGL_Y, outerX2, baseGL_Y, `${WALL_OUTER_OFFSET}`, 220);

      const offV1 = Math.max(550, baseFontSize * 4.2);
      const offV2 = offV1 + Math.max(550, baseFontSize * 4.2);
      drawDim2DLocal(outerX1, baseGL_Y, outerX1, sFoundY, `基礎高: ${foundationH}mm`, -offV1, true);
      drawDim2DLocal(outerX1, baseGL_Y, outerX1, sGirdY1, `手前軒高: ${Math.round(hA)}mm`, -offV2, true);
      drawDim2DLocal(outerX2, baseGL_Y, outerX2, sGirdY2, `奥側軒高: ${Math.round(hB)}mm`, offV1, true);

      const titleY = Math.min(sRoofY1, sRoofY2) - 500;
      elements.push(`<text x="0" y="${titleY}" font-size="${baseFontSize * 1.3}" font-weight="bold" fill="#0f172a" text-anchor="middle">${isLeft ? '左側立面図' : '右側立面図'} (勾配: ${slope}寸 / ふかし各100mm)</text>`);

      vbMinX = outerX1 - offV2 - 1400;
      vbW = totalD + offV2 * 2 + 2800;
      vbMinY = titleY - 300;
      vbH = baseGL_Y + offH2 + 1000 - vbMinY;
    }

    svg.setAttribute('viewBox', `${vbMinX} ${vbMinY} ${vbW} ${vbH}`);
    svg.innerHTML = elements.join('\n');
  };


  // -------------------------------------------------------------
  // JSON保存 / 読込 / 画像保存
  // -------------------------------------------------------------
  const handleSaveJson = () => {
    const data = { dimensions, openings, shelfUnits, vehicles, savedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `garage-project-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const loaded = JSON.parse(ev.target.result);
        restoreState(loaded);
        pushHistory(loaded);
      } catch (err) {
        alert('JSONファイルの読み込みに失敗しました。');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownloadImage = () => {
    const { renderer } = threeRef.current;
    if (!renderer) return;
    const dataUrl = renderer.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `archix-garage-3d-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="simulator-root" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#0f172a',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* 操作マニュアルモーダル */}
      <ManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />

      {/* パース作成依頼モーダル */}
      <ParseRequestModal 
        isOpen={isParseRequestOpen} 
        onClose={() => setIsParseRequestOpen(false)} 
        currentModelData={{ dimensions, openings, shelfUnits, vehicles }}
        onOpenChat={(newRoomId) => {
          setChatRoomId(newRoomId);
          setIsChatOpen(true);
        }}
      />

      {/* チャットモーダル */}
      <ChatRoomModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        initialRoomId={chatRoomId}
      />

      {/* 隠しファイルインプット */}
      <input type="file" ref={fileInputRef} onChange={handleLoadJson} accept=".json" style={{ display: 'none' }} />

      {/* 1. 極薄シミュレータートップバー (全幅, 高さ46px) */}
      <header className="sim-top-bar" style={{
        height: 46,
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        flexShrink: 0,
        zIndex: 50,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
      }}>
        {/* 左: 戻る & タイトル & バージョン */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setCurrentRoute('top')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12.5,
              fontWeight: 700,
              color: 'var(--color-primary)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: 4
            }}
          >
            <ArrowLeft size={16} />
            <span>サイトへ</span>
          </button>

          <div style={{ height: 16, width: 1, background: '#cbd5e1' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#1e293b' }}>
              スマイチ3D
            </span>
            <span style={{
              background: 'var(--color-primary-soft)',
              color: 'var(--color-primary)',
              fontSize: 10.5,
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: 4
            }}>
              v{APP_VERSION}
            </span>
          </div>
        </div>

        {/* 右: アクション（パース依頼 / 相談 / マニュアル / 全画面切替） */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => setIsParseRequestOpen(true)}
            className="btn-accent"
            style={{
              padding: '5px 10px',
              fontSize: 11.5,
              borderRadius: 6,
              boxShadow: '0 2px 8px rgba(224, 122, 95, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <Sparkles size={13} color="#fde047" />
            <span>パース依頼 (無料)</span>
          </button>

          <button
            onClick={() => setIsChatOpen(true)}
            className="btn-secondary"
            style={{ padding: '5px 8px', fontSize: 11.5, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}
            title="相談チャットを開く"
          >
            <MessageSquare size={13} />
            <span>相談</span>
          </button>

          <button
            onClick={() => setIsManualOpen(true)}
            className="btn-primary"
            style={{ padding: '5px 8px', fontSize: 11.5, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}
            title="マニュアルを見る"
          >
            <BookOpen size={13} />
            <span>使い方</span>
          </button>

          {/* 3D全画面表示トグルボタン (スマホで特に大活躍) */}
          <button
            onClick={() => setIs3dFullScreen(!is3dFullScreen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 8px',
              fontSize: 11.5,
              fontWeight: 700,
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              background: is3dFullScreen ? '#0284c7' : '#f1f5f9',
              color: is3dFullScreen ? '#ffffff' : '#334155',
              cursor: 'pointer'
            }}
            title={is3dFullScreen ? '操作パネルを表示' : '3Dを画面いっぱいに広げる'}
          >
            {is3dFullScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span>{is3dFullScreen ? 'パネル' : '全画面'}</span>
          </button>
        </div>
      </header>

      {/* 2. ワークスペース (PC: 左右 / スマホ: 上下 3D最優先) */}
      <div className="sim-workspace" style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* =========================================================
            操作パネル (PC: 左サイドバー 440px / スマホ: 下部ボトムシート)
           ========================================================= */}
        <div className="sim-control-panel" style={{
          width: 440,
          height: '100%',
          background: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          padding: '14px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          flexShrink: 0,
          zIndex: 20
        }}>
          {/* 保存・読込 ＆ Undo/Redo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
            <button onClick={handleSaveJson} className="btn-secondary" style={{ padding: '6px 4px', fontSize: 11, borderRadius: 4, justifyContent: 'center' }}>
              <Save size={13} /> 保存
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="btn-secondary" style={{ padding: '6px 4px', fontSize: 11, borderRadius: 4, justifyContent: 'center' }}>
              <FolderOpen size={13} /> 読込
            </button>
            <button onClick={handleUndo} className="btn-secondary" style={{ padding: '6px 4px', fontSize: 11, borderRadius: 4, justifyContent: 'center' }}>
              <Undo2 size={13} /> 戻る
            </button>
            <button onClick={handleRedo} className="btn-secondary" style={{ padding: '6px 4px', fontSize: 11, borderRadius: 4, justifyContent: 'center' }}>
              <Redo2 size={13} /> 進む
            </button>
          </div>


        {/* 操作セクション タブバー (PC・スマホ両対応で常時くっきり表示) */}
        <div className="sim-tab-bar" style={{
          display: 'flex',
          overflowX: 'auto',
          gap: 8,
          padding: '4px 2px 8px',
          borderBottom: '2px solid #e2e8f0',
          flexShrink: 0,
          WebkitOverflowScrolling: 'touch'
        }}>
          {[
            { id: 'dims', label: '📐 4辺寸法' },
            { id: 'roof', label: '🏠 屋根・高さ' },
            { id: 'openings', label: '🚪 開口部' },
            { id: 'shelves', label: '📦 内部棚' },
            { id: 'vehicles', label: '🚜 車両' },
            { id: 'calc', label: '📊 積算見積' }
          ].map(tab => {
            const isActive = activeMobileTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMobileTab(tab.id)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '7px 14px',
                  borderRadius: 20,
                  fontSize: 12.5,
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#ffffff' : '#334155',
                  background: isActive ? 'var(--color-primary)' : '#e2e8f0',
                  border: isActive ? '1px solid var(--color-primary-dark)' : '1px solid #cbd5e1',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: isActive ? '0 2px 6px rgba(45, 106, 79, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>


        {/* 1. 柱芯寸法セクション (台形・変形地対応) */}
        <div className={`control-section ${activeMobileTab === 'dims' ? 'mobile-show' : 'mobile-hide'}`} style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--color-primary)', paddingBottom: 4, marginBottom: 8 }}>
            <h3 style={{ fontSize: 13, color: '#1e293b' }}>📐 柱芯寸法 (mm) - 台形変形対応</h3>
          </div>

          {/* 3D寸法表示トグル & 文字倍率 (gemini-code 完全復元) */}
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 6,
            padding: '8px 10px',
            marginBottom: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <input 
                  type="checkbox" 
                  checked={show3dDimensions} 
                  onChange={(e) => setShow3dDimensions(e.target.checked)} 
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <span>📐 3D寸法を表示する</span>
              </label>
              <span style={{ fontSize: 11, color: '#15803d', fontWeight: 700 }}>
                {show3dDimensions ? '表示中' : '非表示'}
              </span>
            </div>
            {show3dDimensions && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 4, borderTop: '1px dashed #86efac' }}>
                <span style={{ fontSize: 11, color: '#166534', fontWeight: 600 }}>3D文字倍率</span>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2.5" 
                  step="0.1" 
                  value={dim3dFontScale} 
                  onChange={(e) => setDim3dFontScale(parseFloat(e.target.value))} 
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#166534', width: 34, textAlign: 'right' }}>
                  {dim3dFontScale.toFixed(1)}x
                </span>
              </div>
            )}
          </div>

          {/* 建物形状・敷地タイプ選択 */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
              📐 建物形状・敷地タイプ
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, marginBottom: 8 }}>
              {[
                { id: 'regular', label: '長方形 (四角形)', icon: '⬛', desc: '標準的な四角い敷地' },
                { id: 'trapezoid_right_angle_left', label: '片側直角 (左直角)', icon: '📐', desc: '左境界に直角・右斜め' },
                { id: 'trapezoid_right_angle_right', label: '片側直角 (右直角)', icon: '📐', desc: '右境界に直角・左斜め' },
                { id: 'trapezoid_free', label: '自由台形・偏芯', icon: '▱', desc: '左右の開き角が異なる' }
              ].map(st => {
                const isSelected = (dimensions.shapeType || 'regular') === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      let update = { ...dimensions, shapeType: st.id };
                      if (st.id === 'regular') {
                        update.wBack = dimensions.wFront;
                        update.dRight = dimensions.dLeft;
                        update.skewOffset = 0;
                      } else if (st.id === 'trapezoid_right_angle_left' && dimensions.wBack === dimensions.wFront) {
                        // 少し開き角度(100度)をつけてわかりやすくする
                        const rad = (100 - 90) * Math.PI / 180;
                        update.wBack = Math.round(dimensions.wFront + dimensions.dRight * Math.tan(rad));
                      } else if (st.id === 'trapezoid_right_angle_right' && dimensions.wBack === dimensions.wFront) {
                        const rad = (100 - 90) * Math.PI / 180;
                        update.wBack = Math.round(dimensions.wFront + dimensions.dLeft * Math.tan(rad));
                      }
                      setDimensions(update);
                      pushHistory(update);
                    }}
                    style={{
                      padding: '7px 8px',
                      borderRadius: 6,
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid #cbd5e1',
                      background: isSelected ? 'var(--color-primary-soft)' : '#f8fafc',
                      color: isSelected ? 'var(--color-primary-dark)' : '#475569',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{st.icon}</span>
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 800, lineHeight: 1.2 }}>{st.label}</div>
                      <div style={{ fontSize: 9.5, color: isSelected ? 'var(--color-primary)' : '#94a3b8' }}>{st.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 開き角度 ＆ 偏芯調整パネル */}
            {(() => {
              const currentCore = getCorePoints(dimensions.wFront, dimensions.wBack, dimensions.dLeft, dimensions.dRight, dimensions.shapeType, dimensions.skewOffset);
              const angles = calculateAngles(currentCore);
              const shape = dimensions.shapeType || 'regular';

              return (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: '8px 10px',
                  marginBottom: 10
                }}>
                  {/* リアルタイム角度表示バッジ */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}>壁面の開き角度 (内角)</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: angles.angleLeft === 90 ? '#e2e8f0' : '#e0f2fe',
                        color: angles.angleLeft === 90 ? '#475569' : '#0369a1'
                      }}>
                        左壁: {angles.angleLeft}° {angles.angleLeft === 90 ? '(直角)' : angles.angleLeft > 90 ? '(開き)' : '(狭まり)'}
                      </span>
                      <span style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: angles.angleRight === 90 ? '#e2e8f0' : '#e0f2fe',
                        color: angles.angleRight === 90 ? '#475569' : '#0369a1'
                      }}>
                        右壁: {angles.angleRight}° {angles.angleRight === 90 ? '(直角)' : angles.angleRight > 90 ? '(開き)' : '(狭まり)'}
                      </span>
                    </div>
                  </div>

                  {/* 左直角のときの右壁角度スライダー */}
                  {shape === 'trapezoid_right_angle_left' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: '#0369a1', fontWeight: 700 }}>📐 右壁の開き角度を設定</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#0284c7' }}>{angles.angleRight}°</span>
                      </div>
                      <input 
                        type="range" 
                        min="70" 
                        max="115" 
                        step="0.5" 
                        value={angles.angleRight} 
                        onChange={(e) => {
                          const targetA = parseFloat(e.target.value);
                          const rad = (targetA - 90) * Math.PI / 180;
                          const newWB = Math.max(1200, Math.round(dimensions.wFront + dimensions.dRight * Math.tan(rad)));
                          const up = { ...dimensions, wBack: newWB };
                          setDimensions(up);
                          pushHistory(up);
                        }}
                        style={{ width: '100%', marginBottom: 6 }}
                      />
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[75, 85, 90, 100, 105, 110].map(deg => (
                          <button
                            key={deg}
                            type="button"
                            onClick={() => {
                              const rad = (deg - 90) * Math.PI / 180;
                              const newWB = Math.max(1200, Math.round(dimensions.wFront + dimensions.dRight * Math.tan(rad)));
                              const up = { ...dimensions, wBack: newWB };
                              setDimensions(up);
                              pushHistory(up);
                            }}
                            style={{
                              flex: 1,
                              fontSize: 10,
                              padding: '3px 0',
                              borderRadius: 4,
                              border: '1px solid #cbd5e1',
                              background: Math.abs(angles.angleRight - deg) < 0.3 ? '#0284c7' : '#fff',
                              color: Math.abs(angles.angleRight - deg) < 0.3 ? '#fff' : '#334155',
                              cursor: 'pointer',
                              fontWeight: 700
                            }}
                          >
                            {deg}°{deg === 90 ? '直角' : ''}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 右直角のときの左壁角度スライダー */}
                  {shape === 'trapezoid_right_angle_right' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: '#0369a1', fontWeight: 700 }}>📐 左壁の開き角度を設定</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#0284c7' }}>{angles.angleLeft}°</span>
                      </div>
                      <input 
                        type="range" 
                        min="70" 
                        max="115" 
                        step="0.5" 
                        value={angles.angleLeft} 
                        onChange={(e) => {
                          const targetA = parseFloat(e.target.value);
                          const rad = (targetA - 90) * Math.PI / 180;
                          const newWB = Math.max(1200, Math.round(dimensions.wFront + dimensions.dLeft * Math.tan(rad)));
                          const up = { ...dimensions, wBack: newWB };
                          setDimensions(up);
                          pushHistory(up);
                        }}
                        style={{ width: '100%', marginBottom: 6 }}
                      />
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[75, 85, 90, 100, 105, 110].map(deg => (
                          <button
                            key={deg}
                            type="button"
                            onClick={() => {
                              const rad = (deg - 90) * Math.PI / 180;
                              const newWB = Math.max(1200, Math.round(dimensions.wFront + dimensions.dLeft * Math.tan(rad)));
                              const up = { ...dimensions, wBack: newWB };
                              setDimensions(up);
                              pushHistory(up);
                            }}
                            style={{
                              flex: 1,
                              fontSize: 10,
                              padding: '3px 0',
                              borderRadius: 4,
                              border: '1px solid #cbd5e1',
                              background: Math.abs(angles.angleLeft - deg) < 0.3 ? '#0284c7' : '#fff',
                              color: Math.abs(angles.angleLeft - deg) < 0.3 ? '#fff' : '#334155',
                              cursor: 'pointer',
                              fontWeight: 700
                            }}
                          >
                            {deg}°{deg === 90 ? '直角' : ''}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 自由偏芯台形のときの左右ズレスライダー */}
                  {shape === 'trapezoid_free' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: '#0369a1', fontWeight: 700 }}>▱ 背面の左右ズレ (偏芯・斜行)</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#0284c7' }}>
                          {dimensions.skewOffset > 0 ? `右へ +${dimensions.skewOffset}mm` : dimensions.skewOffset < 0 ? `左へ ${dimensions.skewOffset}mm` : '中央 0mm'}
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="-1500" 
                        max="1500" 
                        step="50" 
                        value={dimensions.skewOffset || 0} 
                        onChange={(e) => {
                          const off = parseFloat(e.target.value);
                          const up = { ...dimensions, skewOffset: off };
                          setDimensions(up);
                          pushHistory(up);
                        }}
                        style={{ width: '100%', marginBottom: 4 }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b' }}>
                        <span>← 左に振る (-1500)</span>
                        <button
                          type="button"
                          onClick={() => {
                            const up = { ...dimensions, skewOffset: 0 };
                            setDimensions(up);
                            pushHistory(up);
                          }}
                          style={{ border: 'none', background: 'none', color: '#0284c7', cursor: 'pointer', fontWeight: 700 }}
                        >
                          中央リセット
                        </button>
                        <span>右に振る (+1500) →</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>正面幅 (mm)</label>
              <input 
                type="number" 
                value={dimensions.wFront} 
                step="10" 
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  const up = { ...dimensions, wFront: val };
                  if (dimensions.shapeType === 'regular') up.wBack = val;
                  setDimensions(up);
                  pushHistory(up);
                }}
                style={{ width: '100%', padding: '5px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>背面幅 (mm)</label>
              <input 
                type="number" 
                value={dimensions.wBack} 
                step="10" 
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setDimensions({ ...dimensions, wBack: val });
                  pushHistory({ ...dimensions, wBack: val });
                }}
                style={{ width: '100%', padding: '5px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>左奥行 (mm)</label>
              <input 
                type="number" 
                value={dimensions.dLeft} 
                step="10" 
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  const up = { ...dimensions, dLeft: val };
                  if (dimensions.shapeType === 'regular') up.dRight = val;
                  setDimensions(up);
                  pushHistory(up);
                }}
                style={{ width: '100%', padding: '5px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>右奥行 (mm)</label>
              <input 
                type="number" 
                value={dimensions.dRight} 
                step="10" 
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setDimensions({ ...dimensions, dRight: val });
                  pushHistory({ ...dimensions, dRight: val });
                }}
                style={{ width: '100%', padding: '5px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 700 }}
              />
            </div>
          </div>

          {/* 敷地の障害物・隅欠き（凸凹・L字敷地対応） */}
          <div style={{
            background: dimensions.cornerCutEnabled ? '#fffbeb' : '#f8fafc',
            border: dimensions.cornerCutEnabled ? '1px solid #fde68a' : '1px solid #e2e8f0',
            borderRadius: 6,
            padding: '8px 10px',
            marginTop: 10,
            marginBottom: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: '#92400e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <input 
                  type="checkbox" 
                  checked={dimensions.cornerCutEnabled || false} 
                  onChange={(e) => {
                    const up = { ...dimensions, cornerCutEnabled: e.target.checked };
                    setDimensions(up);
                    pushHistory(up);
                  }} 
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <span>🚧 敷地の障害物・隅欠き（凸凹回避）</span>
              </label>
              <span style={{ fontSize: 10.5, color: '#b45309', fontWeight: 700 }}>
                {dimensions.cornerCutEnabled ? '有効 (3D表示中)' : 'オフ'}
              </span>
            </div>

            {dimensions.cornerCutEnabled && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #fcd34d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 10, color: '#78350f' }}>
                  ※電柱・隣地ブロック・母屋のひさし・樹木等の障害物を避けてガレージを配置します。
                </div>
                <div>
                  <label style={{ fontSize: 10.5, fontWeight: 700, color: '#78350f', display: 'block', marginBottom: 4 }}>
                    障害物の角位置
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                    {[
                      { id: 'back-right', label: '右奥' },
                      { id: 'back-left', label: '左奥' },
                      { id: 'front-right', label: '右手前' },
                      { id: 'front-left', label: '左手前' }
                    ].map(cp => (
                      <button
                        key={cp.id}
                        type="button"
                        onClick={() => {
                          const up = { ...dimensions, cornerCutPos: cp.id };
                          setDimensions(up);
                          pushHistory(up);
                        }}
                        style={{
                          fontSize: 10.5,
                          padding: '4px 0',
                          borderRadius: 4,
                          border: (dimensions.cornerCutPos || 'back-right') === cp.id ? '2px solid #d97706' : '1px solid #d1d5db',
                          background: (dimensions.cornerCutPos || 'back-right') === cp.id ? '#fef3c7' : '#fff',
                          color: (dimensions.cornerCutPos || 'back-right') === cp.id ? '#92400e' : '#374151',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {cp.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={{ fontSize: 10.5, fontWeight: 700, color: '#78350f' }}>欠き取り幅 (mm)</label>
                    <input 
                      type="number" 
                      value={dimensions.cornerCutWidth || 1500} 
                      step="50" 
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const up = { ...dimensions, cornerCutWidth: val };
                        setDimensions(up);
                        pushHistory(up);
                      }}
                      style={{ width: '100%', padding: '4px 6px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 700 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 10.5, fontWeight: 700, color: '#78350f' }}>欠き取り奥行 (mm)</label>
                    <input 
                      type="number" 
                      value={dimensions.cornerCutDepth || 1500} 
                      step="50" 
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const up = { ...dimensions, cornerCutDepth: val };
                        setDimensions(up);
                        pushHistory(up);
                      }}
                      style={{ width: '100%', padding: '4px 6px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 700 }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ fontSize: 10.5, color: '#64748b' }}>
            ※外壁ふかし+100mm（通気・外装仕上） / 内装仕上: 柱芯+65mm
          </div>
        </div>

        {/* 2. 高さ・屋根・天井仕様 */}
        <div className={`control-section ${activeMobileTab === 'roof' ? 'mobile-show' : 'mobile-hide'}`} style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: 12
        }}>
          <h3 style={{ fontSize: 13, color: '#1e293b', borderBottom: '2px solid var(--color-primary)', paddingBottom: 4, marginBottom: 8 }}>
            🏠 高さ・屋根勾配・天井仕様
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>水下軒高 (GL+ mm)</label>
              <input 
                type="number" 
                value={dimensions.eaveHeight} 
                step="10" 
                onChange={(e) => setDimensions({ ...dimensions, eaveHeight: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', padding: '5px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>屋根勾配 (寸)</label>
              <input 
                type="number" 
                value={dimensions.roofSlope} 
                step="0.1" 
                min="1.0" 
                max="10.0"
                onChange={(e) => setDimensions({ ...dimensions, roofSlope: parseFloat(e.target.value) || 1.0 })}
                style={{ width: '100%', padding: '5px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12 }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>水流し方向 (水上→水下)</label>
            <select 
              value={dimensions.slopeDirection} 
              onChange={(e) => setDimensions({ ...dimensions, slopeDirection: e.target.value })}
              style={{ width: '100%', padding: '5px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12 }}
            >
              <option value="front-to-back">前高・後低 (後へ流す)</option>
              <option value="back-to-front">後高・前低 (前へ流す)</option>
              <option value="left-to-right">左高・右低 (右へ流す)</option>
              <option value="right-to-left">右高・左低 (左へ流す)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>天井仕様 (3タイプ切替)</label>
            <select 
              value={dimensions.ceilingType} 
              onChange={(e) => setDimensions({ ...dimensions, ceilingType: e.target.value })}
              style={{ width: '100%', padding: '5px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12 }}
            >
              <option value="open">小屋組み現し (標準仕様・梁開放)</option>
              <option value="flat">フラット天井 (-320mm / PB9.5mm)</option>
              <option value="sloped">勾配天井 (屋根なり斜め)</option>
            </select>
          </div>
        </div>

        {/* 3. 開口部・建具 (シャッター内付け・半外付け・床付け切り欠き) */}
        <div className={`control-section ${activeMobileTab === 'openings' ? 'mobile-show' : 'mobile-hide'}`} style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--color-primary)', paddingBottom: 4, marginBottom: 8 }}>
            <h3 style={{ fontSize: 13, color: '#1e293b' }}>🚪 開口部配置（内付け・半外付け）</h3>
            <button
              onClick={() => {
                setOpenings([...openings, {
                  id: Date.now(),
                  wall: 'front',
                  type: 'shutter',
                  width: 2700,
                  height: 2400,
                  topHeightGL: 2450,
                  clearanceLeft: 300,
                  openRatio: 0
                }]);
              }}
              style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', background: 'var(--color-primary-soft)', padding: '2px 8px', borderRadius: 4 }}
            >
              ＋ 追加
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {openings.map((op, idx) => {
              const hasErr = validationErrors[op.id];
              return (
                <div key={op.id} style={{
                  background: hasErr ? '#fef2f2' : '#f8fafc',
                  border: `1px solid ${hasErr ? '#ef4444' : '#e2e8f0'}`,
                  borderRadius: 6,
                  padding: 8,
                  position: 'relative'
                }}>
                  <button
                    onClick={() => setOpenings(openings.filter(o => o.id !== op.id))}
                    style={{ position: 'absolute', top: 4, right: 4, color: '#ef4444', fontSize: 10, fontWeight: 700 }}
                  >
                    削除
                  </button>

                  {hasErr && (
                    <div style={{ fontSize: 10, color: '#dc2626', fontWeight: 700, marginBottom: 4 }}>
                      {hasErr.map((e, ei) => <div key={ei}>{e}</div>)}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
                    <div>
                      <label style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>配置壁</label>
                      <select
                        value={op.wall}
                        onChange={(e) => {
                          const updated = [...openings];
                          updated[idx].wall = e.target.value;
                          setOpenings(updated);
                        }}
                        style={{ width: '100%', padding: '3px 6px', fontSize: 11, borderRadius: 4, border: '1px solid #cbd5e1' }}
                      >
                        <option value="front">正面壁</option>
                        <option value="right">右面壁</option>
                        <option value="back">後面壁</option>
                        <option value="left">左面壁</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>種別</label>
                      <select
                        value={op.type}
                        onChange={(e) => {
                          const updated = [...openings];
                          updated[idx].type = e.target.value;
                          setOpenings(updated);
                        }}
                        style={{ width: '100%', padding: '3px 6px', fontSize: 11, borderRadius: 4, border: '1px solid #cbd5e1' }}
                      >
                        <option value="shutter">シャッター (床付け/内付け100mm)</option>
                        <option value="window">引き違い窓 (半外付け)</option>
                        <option value="fix">FIX窓 (半外付け)</option>
                        <option value="door">框ドア (床付け/半外付け)</option>
                        <option value="sliding_door">片引き戸 (床付け/半外付け)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
                    <div>
                      <label style={{ fontSize: 10, color: '#64748b' }}>幅 W (mm)</label>
                      <input
                        type="number"
                        value={op.width}
                        step="10"
                        onChange={(e) => {
                          const updated = [...openings];
                          updated[idx].width = parseFloat(e.target.value) || 0;
                          setOpenings(updated);
                        }}
                        style={{ width: '100%', padding: '3px 6px', fontSize: 11, borderRadius: 4, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: '#64748b' }}>高さ H (mm)</label>
                      <input
                        type="number"
                        value={op.height}
                        step="10"
                        onChange={(e) => {
                          const updated = [...openings];
                          updated[idx].height = parseFloat(e.target.value) || 0;
                          setOpenings(updated);
                        }}
                        style={{ width: '100%', padding: '3px 6px', fontSize: 11, borderRadius: 4, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    <div>
                      <label style={{ fontSize: 10, color: '#64748b' }}>左柱芯逃げ (mm)</label>
                      <input
                        type="number"
                        value={op.clearanceLeft}
                        step="10"
                        onChange={(e) => {
                          const updated = [...openings];
                          updated[idx].clearanceLeft = parseFloat(e.target.value) || 0;
                          setOpenings(updated);
                        }}
                        style={{ width: '100%', padding: '3px 6px', fontSize: 11, borderRadius: 4, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: '#64748b' }}>開閉率: {((op.openRatio || 0) * 100).toFixed(0)}%</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={op.openRatio || 0}
                        onChange={(e) => {
                          const updated = [...openings];
                          updated[idx].openRatio = parseFloat(e.target.value);
                          setOpenings(updated);
                        }}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. 内部棚・間仕切りユニット */}
        <div className={`control-section ${activeMobileTab === 'shelves' ? 'mobile-show' : 'mobile-hide'}`} style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--color-primary)', paddingBottom: 4, marginBottom: 8 }}>
            <h3 style={{ fontSize: 13, color: '#1e293b' }}>📦 内部棚・間仕切りユニット</h3>
            <button
              onClick={() => {
                setShelfUnits([...shelfUnits, {
                  id: Date.now(),
                  wall: 'back',
                  width: 3000,
                  depth: 600,
                  clearanceLeft: 200,
                  levels: [450, 900, 1500]
                }]);
              }}
              style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', background: 'var(--color-primary-soft)', padding: '2px 8px', borderRadius: 4 }}
            >
              ＋ 追加
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {shelfUnits.map((shelf, idx) => (
              <div key={shelf.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 8, position: 'relative' }}>
                <button
                  onClick={() => setShelfUnits(shelfUnits.filter(s => s.id !== shelf.id))}
                  style={{ position: 'absolute', top: 4, right: 4, color: '#ef4444', fontSize: 10, fontWeight: 700 }}
                >
                  削除
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
                  <div>
                    <label style={{ fontSize: 10, color: '#64748b' }}>設置壁</label>
                    <select
                      value={shelf.wall}
                      onChange={(e) => {
                        const updated = [...shelfUnits];
                        updated[idx].wall = e.target.value;
                        setShelfUnits(updated);
                      }}
                      style={{ width: '100%', padding: '3px 6px', fontSize: 11, borderRadius: 4, border: '1px solid #cbd5e1' }}
                    >
                      <option value="back">後面壁</option>
                      <option value="left">左面壁</option>
                      <option value="right">右面壁</option>
                      <option value="front">正面壁</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: '#64748b' }}>出幅 (奥行 mm)</label>
                    <select
                      value={shelf.depth}
                      onChange={(e) => {
                        const updated = [...shelfUnits];
                        updated[idx].depth = parseFloat(e.target.value);
                        setShelfUnits(updated);
                      }}
                      style={{ width: '100%', padding: '3px 6px', fontSize: 11, borderRadius: 4, border: '1px solid #cbd5e1' }}
                    >
                      <option value="450">450mm (壁厚60mm)</option>
                      <option value="600">600mm (壁厚60mm)</option>
                      <option value="750">750mm (壁厚90mm)</option>
                      <option value="900">900mm (壁厚90mm)</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <div>
                    <label style={{ fontSize: 10, color: '#64748b' }}>棚幅 (mm)</label>
                    <input
                      type="number"
                      value={shelf.width}
                      step="100"
                      onChange={(e) => {
                        const updated = [...shelfUnits];
                        updated[idx].width = parseFloat(e.target.value) || 0;
                        setShelfUnits(updated);
                      }}
                      style={{ width: '100%', padding: '3px 6px', fontSize: 11, borderRadius: 4, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: '#64748b' }}>段数: {shelf.levels.length}段</label>
                    <div style={{ fontSize: 11, color: '#475569', fontWeight: 700 }}>
                      H: {shelf.levels.join(', ')} mm
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. 車両配置 (★トラクター / SUV / スポーツ / バイク) */}
        <div className={`control-section ${activeMobileTab === 'vehicles' ? 'mobile-show' : 'mobile-hide'}`} style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--color-accent)', paddingBottom: 4, marginBottom: 8 }}>
            <h3 style={{ fontSize: 13, color: '#1e293b' }}>🚜 車両・トラクター配置</h3>
            <button
              onClick={() => {
                setVehicles([...vehicles, { id: Date.now(), type: 'tractor', posX: 0, posZ: -3200, rotDeg: 0, color: '#dc2626' }]);
              }}
              style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', background: 'var(--color-primary-soft)', padding: '2px 8px', borderRadius: 4 }}
            >
              ＋ 追加
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {vehicles.map((veh, idx) => (
              <div key={veh.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 8, position: 'relative' }}>
                <button
                  onClick={() => setVehicles(vehicles.filter(v => v.id !== veh.id))}
                  style={{ position: 'absolute', top: 4, right: 4, color: '#ef4444', fontSize: 10, fontWeight: 700 }}
                >
                  削除
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
                  <div>
                    <label style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>種別</label>
                    <select
                      value={veh.type}
                      onChange={(e) => {
                        const updated = [...vehicles];
                        updated[idx].type = e.target.value;
                        setVehicles(updated);
                      }}
                      style={{ width: '100%', padding: '3px 6px', fontSize: 11, borderRadius: 4, border: '1px solid #cbd5e1' }}
                    >
                      <option value="tractor">🚜 農業用トラクター (農機具用)</option>
                      <option value="car_suv">🚙 SUV・大型ワゴン</option>
                      <option value="car_sport">🏎 スポーツカー・クーペ</option>
                      <option value="bike">🏍 大型バイク</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>ボディカラー</label>
                    <input
                      type="color"
                      value={veh.color || '#dc2626'}
                      onChange={(e) => {
                        const updated = [...vehicles];
                        updated[idx].color = e.target.value;
                        setVehicles(updated);
                      }}
                      style={{ width: '100%', height: 26, padding: 1, borderRadius: 4, border: '1px solid #cbd5e1', cursor: 'pointer' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <div>
                    <label style={{ fontSize: 10, color: '#64748b' }}>左右X: {veh.posX}mm</label>
                    <input
                      type="range"
                      min="-4000"
                      max="4000"
                      step="100"
                      value={veh.posX}
                      onChange={(e) => {
                        const updated = [...vehicles];
                        updated[idx].posX = parseFloat(e.target.value);
                        setVehicles(updated);
                      }}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: '#64748b' }}>前後Z: {veh.posZ}mm</label>
                    <input
                      type="range"
                      min="-7000"
                      max="-500"
                      step="100"
                      value={veh.posZ}
                      onChange={(e) => {
                        const updated = [...vehicles];
                        updated[idx].posZ = parseFloat(e.target.value);
                        setVehicles(updated);
                      }}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. 見積書転用レベルの詳細計算式表示 (gemini-code 完全復元) */}
        <div className={`control-section ${activeMobileTab === 'calc' ? 'mobile-show' : 'mobile-hide'}`} style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--color-primary)', paddingBottom: 4, marginBottom: 8 }}>
            <h3 style={{ fontSize: 13, color: '#1e293b' }}>📊 面積・積算数量（詳細計算根拠）</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* ① 床面積 */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderLeft: '4px solid var(--color-primary)', borderRadius: 4, padding: 8 }}>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 11.5 }}>① 床面積 (柱芯間 靴ひも公式)</div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#475569', background: '#e2e8f0', padding: '3px 6px', borderRadius: 3, marginTop: 4 }}>
                {calculations.floorFormula}
              </div>
              <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: 14, textAlign: 'right', marginTop: 3 }}>
                {calculations.floorVal}
              </div>
            </div>

            {/* ② 基礎長さ */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderLeft: '4px solid var(--color-primary)', borderRadius: 4, padding: 8 }}>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 11.5 }}>② 基礎長さ (外周ふかし面)</div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#475569', background: '#e2e8f0', padding: '3px 6px', borderRadius: 3, marginTop: 4 }}>
                {calculations.foundFormula}
              </div>
              <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: 14, textAlign: 'right', marginTop: 3 }}>
                {calculations.foundVal}
              </div>
            </div>

            {/* ③ 屋根実面積 */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderLeft: '4px solid var(--color-primary)', borderRadius: 4, padding: 8 }}>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 11.5 }}>③ 屋根実面積 (勾配加算)</div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#475569', background: '#e2e8f0', padding: '3px 6px', borderRadius: 3, marginTop: 4 }}>
                {calculations.roofFormula}
              </div>
              <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: 14, textAlign: 'right', marginTop: 3 }}>
                {calculations.roofVal}
              </div>
            </div>

            {/* ④ サッシ・開口部面積 */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderLeft: '4px solid var(--color-primary)', borderRadius: 4, padding: 8 }}>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 11.5 }}>④ サッシ・開口部面積 (算出式)</div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#475569', background: '#e2e8f0', padding: '3px 6px', borderRadius: 3, marginTop: 4, whiteSpace: 'pre-line' }}>
                {calculations.openingsFormula}
              </div>
              <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: 14, textAlign: 'right', marginTop: 3 }}>
                {calculations.openingsVal}
              </div>
            </div>

            {/* ⑤ 外壁各面面積 */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderLeft: '4px solid var(--color-primary)', borderRadius: 4, padding: 8 }}>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 11.5 }}>⑤ 外壁各面面積 (正・裏・右・左)</div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#475569', background: '#e2e8f0', padding: '3px 6px', borderRadius: 3, marginTop: 4, whiteSpace: 'pre-line' }}>
                {calculations.wallsFormula}
              </div>
              <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: 14, textAlign: 'right', marginTop: 3 }}>
                {calculations.wallsVal}
              </div>
            </div>

            {/* 概算建築費用 */}
            <div style={{
              background: 'linear-gradient(135deg, var(--color-primary-soft) 0%, #ffffff 100%)',
              border: '2px solid var(--color-primary)',
              borderRadius: 6,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>概算建築費用目安</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>※基礎・構造・建具・屋根連動</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                {calculations.approxCost.toLocaleString()} <span style={{ fontSize: 13, fontWeight: 500 }}>円〜</span>
              </div>
            </div>
          </div>
        </div>

        {/* AIパース用画像保存ボタン */}
        <button
          onClick={handleDownloadImage}
          className="btn-accent"
          style={{ padding: '12px', fontSize: 13, borderRadius: 8, width: '100%', justifyContent: 'center' }}
        >
          <Camera size={16} />
          <span>表示中の画面を画像保存 (AI生成用)</span>
        </button>
      </div>

      {/* =========================================================
          メインステージ (PC: 右ビュー / スマホ: 上部固定ビュー 42vh)
         ========================================================= */}
      <div className="sim-main-stage" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
        overflow: 'hidden'
      }}>
        {/* ビュー切替タブバー */}
        <div style={{
          display: 'flex',
          background: '#0f172a',
          padding: '6px 10px 0',
          gap: 4,
          alignItems: 'center',
          borderBottom: '2px solid #334155',
          flexShrink: 0,
          overflowX: 'auto'
        }}>
          {[
            { id: '3d', label: '🏠 3Dパース' },
            { id: 'plan', label: '📐 平面図' },
            { id: 'front-elev', label: '🏛 正立面' },
            { id: 'back-elev', label: '🏛 裏立面' },
            { id: 'left-elev', label: '🏛 左立面' },
            { id: 'right-elev', label: '🏛 右立面' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              style={{
                whiteSpace: 'nowrap',
                padding: '7px 12px',
                fontSize: 12,
                fontWeight: 700,
                borderRadius: '6px 6px 0 0',
                border: 'none',
                color: currentView === tab.id ? 'var(--color-primary)' : '#94a3b8',
                background: currentView === tab.id ? '#f8fafc' : '#1e293b',
                cursor: 'pointer',
                borderTop: currentView === tab.id ? '3px solid var(--color-primary)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}

          {/* 右側ヘルパー */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 4 }}>
            {currentView === '3d' && (
              <>
                <button
                  onClick={() => setShow3dDimensions(!show3dDimensions)}
                  style={{
                    background: show3dDimensions ? '#0284c7' : '#334155',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'pointer'
                  }}
                  title="3D寸法の表示/非表示をワンタップ切替"
                >
                  <span>📐 寸法:{show3dDimensions ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => setIsSeeThrough(!isSeeThrough)}
                  style={{
                    background: isSeeThrough ? 'var(--color-primary)' : '#334155',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'pointer'
                  }}
                >
                  {isSeeThrough ? <Eye size={12} /> : <EyeOff size={12} />}
                  <span>透視:{isSeeThrough ? 'ON' : 'OFF'}</span>
                </button>
              </>
            )}


            {currentView !== '3d' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#38bdf8', fontSize: 11, fontWeight: 700 }}>
                <span>縮尺:</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={svgZoom}
                  onChange={(e) => setSvgZoom(parseFloat(e.target.value))}
                  style={{ width: 60 }}
                />
              </div>
            )}
          </div>
        </div>

        {/* 描画キャンバス */}
        <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          <div 
            ref={canvasContainerRef} 
            style={{ width: '100%', height: '100%', display: currentView === '3d' ? 'block' : 'none' }} 
          />
          <div 
            style={{ 
              width: '100%', 
              height: '100%', 
              display: currentView !== '3d' ? 'flex' : 'none', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: '#ffffff',
              overflow: 'auto'
            }}
          >
            <svg ref={svgRef} style={{ display: 'block', margin: 'auto' }} />
          </div>

          <div style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            background: 'rgba(15, 23, 42, 0.8)',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 10.5,
            pointerEvents: 'none'
          }}>
            {currentView === '3d' ? 'ドラッグ: 回転 | ホイール: ズーム' : '2Dベクトル製図モード'}
          </div>
        </div>
      </div>
      </div>


      {/* レスポンシブ & タブ切り替えスタイル */}
      <style>{`
        .sim-tab-bar::-webkit-scrollbar {
          height: 4px;
        }
        .sim-tab-bar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .control-section.mobile-hide {
          display: none !important;
        }
        .control-section.mobile-show {
          display: block !important;
          animation: fadeIn 0.2s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .simulator-root {
            height: 100vh !important;
          }
          .sim-workspace {
            flex-direction: column !important;
            height: calc(100vh - 46px) !important;
          }
          .sim-main-stage {
            order: 1 !important;
            height: ${is3dFullScreen ? 'calc(100vh - 46px)' : '46vh'} !important;
            flex: none !important;
            border-bottom: 2px solid #334155;
          }
          .sim-control-panel {
            order: 2 !important;
            width: 100% !important;
            height: 54vh !important;
            display: ${is3dFullScreen ? 'none' : 'flex'} !important;
            border-right: none !important;
            padding: 10px 12px 28px !important;
          }
        }
        @media (max-width: 480px) {
          .sim-top-bar {
            padding: 0 8px !important;
          }
          .hide-on-mobile-mini {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
}

