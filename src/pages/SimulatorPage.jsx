import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  ArrowLeft, BookOpen, Save, FolderOpen, Undo2, Redo2, 
  Camera, Eye, EyeOff, ZoomIn, HelpCircle, Layers, CheckCircle2, AlertCircle,
  Maximize2, Compass, Move, ChevronRight, Sliders, FileText, Check, MessageSquare, Sparkles
} from 'lucide-react';
import ManualModal from '../components/ManualModal';
import ParseRequestModal from '../components/ParseRequestModal';
import ChatRoomModal from '../components/ChatRoomModal';

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

    const { wFront: wF, wBack: wB, dLeft: dL, dRight: dR, eaveHeight: eaveH, foundationHeight: foundationH, roofSlope: slope, slopeDirection: slopeDir, ceilingType } = dimensions;

    const corePts = getCorePoints(wF, wB, dL, dR);
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

    // 9. 3D寸法線・文字スプライト (gemini-code 完全復元)
    if (show3dDimensions) {
      const offsetDist = 800;
      addDimensionSegment(corePts[0], corePts[1], `正面幅 ${wF}mm`, new THREE.Vector2(0, offsetDist), dim3dFontScale);
      addDimensionSegment(corePts[1], corePts[2], `右奥行 ${dR}mm`, new THREE.Vector2(offsetDist, 0), dim3dFontScale);
      addDimensionSegment(corePts[2], corePts[3], `背面幅 ${wB}mm`, new THREE.Vector2(0, -offsetDist), dim3dFontScale);
      addDimensionSegment(corePts[3], corePts[0], `左奥行 ${dL}mm`, new THREE.Vector2(-offsetDist, 0), dim3dFontScale);
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
  // 3D寸法線・スプライト描画 (gemini-code 完全移植)
  // -------------------------------------------------------------
  const makeTextSprite = (message, scaleFactor = 1.0) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(600 * scaleFactor, 150 * scaleFactor, 1);
    return sprite;
  };

  const addDimensionSegment = (pA, pB, labelText, offsetVec, scaleFactor) => {
    const { dimGroup } = threeRef.current;
    if (!dimGroup) return;

    const dimLineMat = new THREE.LineBasicMaterial({ color: 0x0284c7, linewidth: 2 });
    const start = new THREE.Vector3(pA.x + offsetVec.x, 100, pA.y + offsetVec.y);
    const end = new THREE.Vector3(pB.x + offsetVec.x, 100, pB.y + offsetVec.y);

    dimGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([start, end]), dimLineMat));
    dimGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(pA.x, 100, pA.y), start]), dimLineMat));
    dimGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(pB.x, 100, pB.y), end]), dimLineMat));

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

  // 幾何計算ヘルパー
  const getCorePoints = (wF, wB, dL, dR) => {
    const p0 = new THREE.Vector2(-wF / 2, 0);
    const p1 = new THREE.Vector2(wF / 2, 0);
    const backOffset = (wF - wB) / 2;
    const p2 = new THREE.Vector2(wF / 2 - backOffset, -dR);
    const p3 = new THREE.Vector2(-wF / 2 + backOffset, -dL);
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
  // 2Dベクトル製図 (SVG描画 - gemini-code 完全移植)
  // -------------------------------------------------------------
  const renderSvgDrawings = () => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.innerHTML = '';

    const { wFront: wF, wBack: wB, dLeft: dL, dRight: dR, eaveHeight: eaveH, foundationHeight: foundationH, roofSlope: slope } = dimensions;

    const baseWidth = 850 * svgZoom;
    const baseHeight = 650 * svgZoom;
    svg.setAttribute('width', baseWidth);
    svg.setAttribute('height', baseHeight);

    if (currentView === 'plan') {
      svg.setAttribute('viewBox', '-4500 -7500 9000 8500');

      const corePts = getCorePoints(wF, wB, dL, dR);
      const outerPts = getOffsetPoints(corePts, WALL_OUTER_OFFSET);

      // 外壁ポリゴン
      const pStr = outerPts.map(p => `${p.x},${p.y}`).join(' ');
      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      poly.setAttribute('points', pStr);
      poly.setAttribute('fill', '#f1f5f9');
      poly.setAttribute('stroke', '#334155');
      poly.setAttribute('stroke-width', '40');
      svg.appendChild(poly);

      // 柱芯線
      const cStr = corePts.map(p => `${p.x},${p.y}`).join(' ');
      const cPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      cPoly.setAttribute('points', cStr);
      cPoly.setAttribute('fill', 'none');
      cPoly.setAttribute('stroke', '#0284c7');
      cPoly.setAttribute('stroke-width', '25');
      cPoly.setAttribute('stroke-dasharray', '80,40');
      svg.appendChild(cPoly);

      // 寸法線
      drawDim2D(corePts[0].x, 0, corePts[1].x, 0, `正面幅 ${wF}mm`, 450);
      drawDim2D(corePts[1].x, 0, corePts[2].x, -dR, `右奥行 ${dR}mm`, 550, true);
      drawDim2D(corePts[3].x, -dL, corePts[2].x, -dR, `背面幅 ${wB}mm`, -550);
      drawDim2D(corePts[0].x, 0, corePts[3].x, -dL, `左奥行 ${dL}mm`, -550, true);

    } else {
      // 立面図 (正面 / 裏 / 左 / 右)
      svg.setAttribute('viewBox', '-4500 -1200 9000 6200');

      let span = wF;
      let title = '正立面図 (南面)';
      if (currentView === 'back-elev') { span = wB; title = '裏立面図 (北面)'; }
      else if (currentView === 'left-elev') { span = dL; title = '左側立面図 (西面)'; }
      else if (currentView === 'right-elev') { span = dR; title = '右側立面図 (東面)'; }

      // 躯体矩形
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', `${-span / 2}`);
      rect.setAttribute('y', `${5000 - eaveH}`);
      rect.setAttribute('width', `${span}`);
      rect.setAttribute('height', `${eaveH}`);
      rect.setAttribute('fill', '#e2e8f0');
      rect.setAttribute('stroke', '#334155');
      rect.setAttribute('stroke-width', '35');
      svg.appendChild(rect);

      // GL線
      const gl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      gl.setAttribute('x1', '-4200'); gl.setAttribute('y1', '5000');
      gl.setAttribute('x2', '4200'); gl.setAttribute('y2', '5000');
      gl.setAttribute('stroke', '#15803d'); gl.setAttribute('stroke-width', '45');
      svg.appendChild(gl);

      const glTxt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      glTxt.setAttribute('x', '-4000'); glTxt.setAttribute('y', '4930');
      glTxt.setAttribute('fill', '#15803d'); glTxt.setAttribute('font-size', `${140 * dimFontScale}`);
      glTxt.setAttribute('font-weight', 'bold');
      glTxt.textContent = '▼ 設計GL ±0';
      svg.appendChild(glTxt);

      // タイトル
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', '0'); t.setAttribute('y', '-600');
      t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', '#1e293b');
      t.setAttribute('font-size', `${240 * dimFontScale}`); t.setAttribute('font-weight', 'bold');
      t.textContent = `${title} (スパン ${span}mm / 軒高 ${eaveH}mm)`;
      svg.appendChild(t);
    }
  };

  const drawDim2D = (x1, y1, x2, y2, text, offset, isVertical = false) => {
    const svg = svgRef.current;
    if (!svg) return;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    if (!isVertical) {
      line.setAttribute('x1', x1); line.setAttribute('y1', y1 + offset);
      line.setAttribute('x2', x2); line.setAttribute('y2', y2 + offset);
      txt.setAttribute('x', (x1 + x2) / 2); txt.setAttribute('y', y1 + offset - 60);
    } else {
      line.setAttribute('x1', x1 + offset); line.setAttribute('y1', y1);
      line.setAttribute('x2', x2 + offset); line.setAttribute('y2', y2);
      txt.setAttribute('x', x1 + offset + (offset > 0 ? 80 : -80)); txt.setAttribute('y', (y1 + y2) / 2);
    }

    line.setAttribute('stroke', '#0284c7'); line.setAttribute('stroke-width', '25');
    txt.setAttribute('text-anchor', 'middle'); txt.setAttribute('fill', '#0284c7');
    txt.setAttribute('font-size', `${170 * dimFontScale}`); txt.setAttribute('font-weight', 'bold');
    txt.textContent = text;

    g.appendChild(line); g.appendChild(txt);
    svg.appendChild(g);
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
      height: 'calc(100vh - 65px)',
      background: '#1e293b',
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
        {/* トップバー（サイト戻る・マニュアル・パース依頼） */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          <button
            onClick={() => setCurrentRoute('top')}
            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}
          >
            <ArrowLeft size={16} />
            <span>サイトへ戻る</span>
          </button>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setIsChatOpen(true)}
              className="btn-secondary"
              style={{ padding: '6px 10px', fontSize: 11, borderRadius: 6 }}
              title="相談チャットを開く"
            >
              <MessageSquare size={13} />
              <span>相談チャット</span>
            </button>
            <button
              onClick={() => setIsManualOpen(true)}
              className="btn-primary"
              style={{ padding: '6px 10px', fontSize: 11, borderRadius: 6 }}
            >
              <BookOpen size={13} />
              <span>マニュアル</span>
            </button>
          </div>
        </div>

        {/* パース依頼 目立つCTA */}
        <button
          onClick={() => setIsParseRequestOpen(true)}
          className="btn-accent"
          style={{ padding: '11px 16px', fontSize: 13.5, borderRadius: 8, justifyContent: 'center', boxShadow: '0 4px 14px rgba(224, 122, 95, 0.4)' }}
        >
          <Sparkles size={16} color="#fde047" />
          <span>✨ フォトリアルパースの作成を依頼 (無料)</span>
        </button>

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

        {/* スマホ用ボトムシート タブバー */}
        <div className="mobile-tab-bar" style={{
          display: 'none',
          overflowX: 'auto',
          gap: 6,
          paddingBottom: 4,
          borderBottom: '1px solid #cbd5e1'
        }}>
          {[
            { id: 'dims', label: '📐 4辺寸法' },
            { id: 'roof', label: '🏠 屋根・高さ' },
            { id: 'openings', label: '🚪 開口部' },
            { id: 'shelves', label: '📦 棚' },
            { id: 'vehicles', label: '🚜 車両' },
            { id: 'calc', label: '📊 積算見積' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveMobileTab(tab.id)}
              style={{
                whiteSpace: 'nowrap',
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: activeMobileTab === tab.id ? 800 : 500,
                color: activeMobileTab === tab.id ? '#ffffff' : '#475569',
                background: activeMobileTab === tab.id ? 'var(--color-primary)' : '#e2e8f0',
                border: 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>正面幅 (mm)</label>
              <input 
                type="number" 
                value={dimensions.wFront} 
                step="10" 
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setDimensions({ ...dimensions, wFront: val });
                  pushHistory({ ...dimensions, wFront: val });
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
                  setDimensions({ ...dimensions, dLeft: val });
                  pushHistory({ ...dimensions, dLeft: val });
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
                  gap: 4
                }}
              >
                {isSeeThrough ? <Eye size={12} /> : <EyeOff size={12} />}
                <span>透視:{isSeeThrough ? 'ON' : 'OFF'}</span>
              </button>
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

      {/* スマホレイアウト用スタイル */}
      <style>{`
        @media (max-width: 900px) {
          .simulator-root {
            flex-direction: column !important;
            height: calc(100vh - 58px) !important;
          }
          .sim-main-stage {
            height: 42vh !important;
            flex: none !important;
            border-bottom: 2px solid #334155;
          }
          .sim-control-panel {
            width: 100% !important;
            height: 58vh !important;
            border-right: none !important;
            padding: 10px 12px 24px !important;
          }
          .mobile-tab-bar {
            display: flex !important;
          }
          .control-section.mobile-hide {
            display: none !important;
          }
          .control-section.mobile-show {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
