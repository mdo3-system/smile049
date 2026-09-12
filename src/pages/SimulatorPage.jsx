import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  ArrowLeft, BookOpen, Save, FolderOpen, Undo2, Redo2, 
  Camera, Eye, EyeOff, ZoomIn, HelpCircle, Layers, CheckCircle2, AlertCircle 
} from 'lucide-react';
import ManualModal from '../components/ManualModal';

export default function SimulatorPage({ setCurrentRoute }) {
  const canvasContainerRef = useRef(null);
  const svgRef = useRef(null);
  const fileInputRef = useRef(null);

  // マニュアルモーダル開閉
  const [isManualOpen, setIsManualOpen] = useState(false);

  // 表示モード ('3d', 'plan', 'front-elev', 'back-elev', 'left-elev', 'right-elev')
  const [currentView, setCurrentView] = useState('3d');
  const [isSeeThrough, setIsSeeThrough] = useState(false);
  const [svgZoom, setSvgZoom] = useState(1.0);
  const [dimFontScale, setDimFontScale] = useState(1.0);
  const [show3dDimensions, setShow3dDimensions] = useState(true);
  const [dim3dFontScale, setDim3dFontScale] = useState(1.0);

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

  // 開口部リスト
  const [openings, setOpenings] = useState([
    {
      id: 1,
      wall: 'front',
      type: 'shutter',
      width: 2700,
      height: 2400,
      clearanceLeft: 300,
      sillHeight: 50,
      openRatio: 0
    },
    {
      id: 2,
      wall: 'right',
      type: 'window',
      width: 1650,
      height: 900,
      clearanceLeft: 1000,
      sillHeight: 1200,
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

  // 車両・スケール比較モデルリスト
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      type: 'car_suv',
      posX: 1200,
      posZ: -3200,
      rotDeg: 0,
      color: '#2b394a'
    }
  ]);

  // 積算・計算結果
  const [calcResults, setCalcResults] = useState({
    floorArea: 0,
    floorTsubo: 0,
    foundationLength: 0,
    roofArea: 0,
    openingsArea: 0,
    wallsArea: 0,
    wallDetails: ''
  });

  // バリデーション警告
  const [validationErrors, setValidationErrors] = useState([]);

  // Three.js インスタンス保持用 ref
  const threeRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    modelGroup: null,
    dimGroup: null,
    reqId: null
  });

  // Undo / Redo スタック
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
    camera.position.set(7000, 6500, 9000);

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1500, -3000);

    // 照明
    const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 0.8);
    dirLight.position.set(6000, 12000, 7000);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // 地面グリッド
    const grid = new THREE.GridHelper(24000, 48, 0x94a3b8, 0xcbd5e1);
    grid.position.y = 0;
    scene.add(grid);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const dimGroup = new THREE.Group();
    scene.add(dimGroup);

    threeRef.current = { scene, camera, renderer, controls, modelGroup, dimGroup, reqId: null };

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
  // 3Dモデル生成 & 積算ロジック
  // -------------------------------------------------------------
  useEffect(() => {
    update3DModelAndCalc();
  }, [dimensions, openings, shelfUnits, vehicles, isSeeThrough, show3dDimensions, dim3dFontScale]);

  // 2D製図 (SVG) の更新
  useEffect(() => {
    if (currentView !== '3d') {
      renderSvgDrawing();
    }
  }, [currentView, dimensions, openings, shelfUnits, svgZoom, dimFontScale]);

  const update3DModelAndCalc = () => {
    const { modelGroup, dimGroup } = threeRef.current;
    if (!modelGroup || !dimGroup) return;

    // クリーンアップ
    while (modelGroup.children.length > 0) {
      const obj = modelGroup.children[0];
      modelGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }
    while (dimGroup.children.length > 0) {
      const obj = dimGroup.children[0];
      dimGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }

    const { wFront, wBack, dLeft, dRight, eaveHeight, foundationHeight, roofSlope, slopeDirection, ceilingType } = dimensions;

    // 1. 柱芯頂点算出
    const p0 = new THREE.Vector2(-wFront / 2, 0);
    const p1 = new THREE.Vector2(wFront / 2, 0);
    const backOffset = (wFront - wBack) / 2;
    const p2 = new THREE.Vector2(wFront / 2 - backOffset, -dRight);
    const p3 = new THREE.Vector2(-wFront / 2 + backOffset, -dLeft);
    const corePts = [p0, p1, p2, p3];

    // ふかしポリゴン
    const outerPts = getOffsetPolygon(corePts, 100);
    const innerPts = getOffsetPolygon(corePts, -65);

    // バウンディングボックス
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    outerPts.forEach(p => {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    });
    const bounds = { minX, maxX, minY, maxY };

    const getGirderH = (p) => {
      const ratio = roofSlope / 10.0;
      let dist = 0;
      if (slopeDirection === 'front-to-back') dist = p.y - minY;
      else if (slopeDirection === 'back-to-front') dist = maxY - p.y;
      else if (slopeDirection === 'left-to-right') dist = maxX - p.x;
      else if (slopeDirection === 'right-to-left') dist = p.x - minX;
      return eaveHeight + dist * ratio;
    };

    // マテリアル定義
    const concMat = new THREE.MeshStandardMaterial({ color: 0xc8cbd0, roughness: 0.8 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xb58a63, roughness: 0.7 });
    const wallMat = new THREE.MeshStandardMaterial({ 
      color: 0x3d4a58, 
      roughness: 0.5, 
      transparent: isSeeThrough, 
      opacity: isSeeThrough ? 0.35 : 1.0 
    });
    const innerWallMat = new THREE.MeshStandardMaterial({ color: 0xeddcc8, roughness: 0.6 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.4 });
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xe5e5e5, roughness: 0.7 });

    // 2. 内部土間コンクリート床 (GL+50)
    const floorShape = new THREE.Shape();
    innerPts.forEach((p, i) => {
      if (i === 0) floorShape.moveTo(p.x, p.y);
      else floorShape.lineTo(p.x, p.y);
    });
    floorShape.closePath();
    const floorGeo = new THREE.ExtrudeGeometry(floorShape, { depth: 50, bevelEnabled: false });
    floorGeo.rotateX(Math.PI / 2);
    const floorMesh = new THREE.Mesh(floorGeo, concMat);
    floorMesh.position.y = 50;
    floorMesh.receiveShadow = true;
    modelGroup.add(floorMesh);

    // 3. 基礎立ち上がり (GL0 〜 GL+300)
    // シャッター・土間付けドアの開口部は切り欠き
    const fndOuterShape = new THREE.Shape();
    outerPts.forEach((p, i) => { if (i === 0) fndOuterShape.moveTo(p.x, p.y); else fndOuterShape.lineTo(p.x, p.y); });
    fndOuterShape.closePath();

    const fndHole = new THREE.Path();
    innerPts.forEach((p, i) => { if (i === 0) fndHole.moveTo(p.x, p.y); else fndHole.lineTo(p.x, p.y); });
    fndHole.closePath();
    fndOuterShape.holes.push(fndHole);

    const fndGeo = new THREE.ExtrudeGeometry(fndOuterShape, { depth: foundationHeight, bevelEnabled: false });
    fndGeo.rotateX(Math.PI / 2);
    const fndMesh = new THREE.Mesh(fndGeo, concMat);
    fndMesh.position.y = foundationHeight;
    modelGroup.add(fndMesh);

    // 4. 外壁・内壁モデリング
    const wallKeys = ['front', 'right', 'back', 'left'];
    const wallSpans = [wFront, dRight, wBack, dLeft];

    for (let i = 0; i < 4; i++) {
      const pA = outerPts[i];
      const pB = outerPts[(i + 1) % 4];
      const hA = getGirderH(pA);
      const hB = getGirderH(pB);

      // 外壁台形パネル
      const wallShape = new THREE.Shape();
      wallShape.moveTo(0, foundationHeight);
      wallShape.lineTo(pA.distanceTo(pB), foundationHeight);
      wallShape.lineTo(pA.distanceTo(pB), hB);
      wallShape.lineTo(0, hA);
      wallShape.closePath();

      // 開口部をくり抜き
      const currentWallKey = wallKeys[i];
      const wallOpenings = openings.filter(op => op.wall === currentWallKey);
      wallOpenings.forEach(op => {
        const ox = parseFloat(op.clearanceLeft) + 100;
        const ow = parseFloat(op.width);
        const oh = parseFloat(op.height);
        const oy = parseFloat(op.sillHeight);
        const opHole = new THREE.Path();
        opHole.moveTo(ox, oy);
        opHole.lineTo(ox + ow, oy);
        opHole.lineTo(ox + ow, oy + oh);
        opHole.lineTo(ox, oy + oh);
        opHole.closePath();
        wallShape.holes.push(opHole);
      });

      const wallGeo = new THREE.ExtrudeGeometry(wallShape, { depth: 35, bevelEnabled: false });
      const wallMesh = new THREE.Mesh(wallGeo, wallMat);

      // 壁の配置・回転
      const angle = Math.atan2(pB.y - pA.y, pB.x - pA.x);
      wallMesh.position.set(pA.x, 0, pA.y);
      wallMesh.rotation.y = -angle;
      modelGroup.add(wallMesh);
    }

    // 5. 屋根
    const roofShape = new THREE.Shape();
    outerPts.forEach((p, i) => { if (i === 0) roofShape.moveTo(p.x, p.y); else roofShape.lineTo(p.x, p.y); });
    roofShape.closePath();

    // 勾配を持った屋根メッシュ生成
    const roofGeo = new THREE.BufferGeometry();
    const v0 = new THREE.Vector3(outerPts[0].x, getGirderH(outerPts[0]) + 100, outerPts[0].y);
    const v1 = new THREE.Vector3(outerPts[1].x, getGirderH(outerPts[1]) + 100, outerPts[1].y);
    const v2 = new THREE.Vector3(outerPts[2].x, getGirderH(outerPts[2]) + 100, outerPts[2].y);
    const v3 = new THREE.Vector3(outerPts[3].x, getGirderH(outerPts[3]) + 100, outerPts[3].y);

    const positions = new Float32Array([
      v0.x, v0.y, v0.z,  v1.x, v1.y, v1.z,  v2.x, v2.y, v2.z,
      v0.x, v0.y, v0.z,  v2.x, v2.y, v2.z,  v3.x, v3.y, v3.z
    ]);
    roofGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    roofGeo.computeVertexNormals();
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    modelGroup.add(roofMesh);

    // 6. 天井仕様 (flat / sloped)
    if (ceilingType === 'flat') {
      const ceilGeo = new THREE.ExtrudeGeometry(floorShape, { depth: 12, bevelEnabled: false });
      ceilGeo.rotateX(Math.PI / 2);
      const ceilMesh = new THREE.Mesh(ceilGeo, ceilingMat);
      ceilMesh.position.y = eaveHeight - 320;
      modelGroup.add(ceilMesh);
    } else if (ceilingType === 'sloped') {
      const cGeo = roofGeo.clone();
      const cMesh = new THREE.Mesh(cGeo, ceilingMat);
      cMesh.position.y -= 80;
      modelGroup.add(cMesh);
    }

    // 7. 開口部・サッシ・シャッター
    openings.forEach((op) => {
      createOpening3D(op, outerPts, modelGroup);
    });

    // 8. 内部棚・間仕切り
    shelfUnits.forEach((shelf) => {
      createShelfUnit3D(shelf, innerPts, modelGroup, woodMat);
    });

    // 9. 車両・スケールモデル (SUV / スポーツカー / バイク / トラクター)
    vehicles.forEach((veh) => {
      createVehicle3D(veh, modelGroup);
    });

    // 10. 3D寸法線の描画
    if (show3dDimensions) {
      draw3dDimensions(corePts, eaveHeight, dimGroup, dim3dFontScale);
    }

    // 11. 積算数量の計算
    calculateEstimates(corePts, outerPts, wallSpans, eaveHeight, roofSlope, openings);
  };

  // -------------------------------------------------------------
  // 車両モデル作成（SUV / スポーツカー / バイク / ★トラクター新設）
  // -------------------------------------------------------------
  const createVehicle3D = (veh, parentGroup) => {
    const vehGroup = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: veh.color || 0x2b394a, roughness: 0.3, metalness: 0.2 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.1, transparent: true, opacity: 0.7 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.8, roughness: 0.2 });

    if (veh.type === 'tractor') {
      // 🚜 ★農業用トラクター（Stable Diffusion / ControlNet対応）
      // 巨大後輪、小径前輪、ロングノーズフード、安全フレーム(ROPS)、運転席
      
      // 1. 大型後輪 (直径1300mm, 幅450mm, ラグタイヤ感)
      const rearTireGeo = new THREE.CylinderGeometry(650, 650, 420, 24);
      rearTireGeo.rotateZ(Math.PI / 2);
      const rlTire = new THREE.Mesh(rearTireGeo, tireMat);
      rlTire.position.set(-850, 650, -800);
      const rrTire = rlTire.clone();
      rrTire.position.x = 850;
      vehGroup.add(rlTire, rrTire);

      // ホイールハブ
      const rearHubGeo = new THREE.CylinderGeometry(320, 320, 430, 16);
      rearHubGeo.rotateZ(Math.PI / 2);
      const rlHub = new THREE.Mesh(rearHubGeo, metalMat);
      rlHub.position.copy(rlTire.position);
      const rrHub = rlHub.clone();
      rrHub.position.copy(rrTire.position);
      vehGroup.add(rlHub, rrHub);

      // 2. 小型前輪 (直径800mm, 幅260mm)
      const frontTireGeo = new THREE.CylinderGeometry(400, 400, 260, 20);
      frontTireGeo.rotateZ(Math.PI / 2);
      const flTire = new THREE.Mesh(frontTireGeo, tireMat);
      flTire.position.set(-680, 400, 1100);
      const frTire = flTire.clone();
      frTire.position.x = 680;
      vehGroup.add(flTire, frTire);

      // 3. エンジンボンネット / フード (前方に伸びる角型ノーズ)
      const hoodGeo = new THREE.BoxGeometry(860, 750, 1600);
      const hood = new THREE.Mesh(hoodGeo, bodyMat);
      hood.position.set(0, 850, 750);
      vehGroup.add(hood);

      // フロントグリル
      const grillGeo = new THREE.BoxGeometry(800, 600, 40);
      const grill = new THREE.Mesh(grillGeo, new THREE.MeshStandardMaterial({ color: 0x111827 }));
      grill.position.set(0, 820, 1555);
      vehGroup.add(grill);

      // ヘッドライト
      const lightGeo = new THREE.CylinderGeometry(70, 70, 30, 16);
      lightGeo.rotateX(Math.PI / 2);
      const lLight = new THREE.Mesh(lightGeo, new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.5 }));
      lLight.position.set(-260, 950, 1560);
      const rLight = lLight.clone();
      rLight.position.x = 260;
      vehGroup.add(lLight, rLight);

      // 4. 排気マフラー (垂直パイプ)
      const exhaustGeo = new THREE.CylinderGeometry(35, 35, 1100, 12);
      const exhaust = new THREE.Mesh(exhaustGeo, new THREE.MeshStandardMaterial({ color: 0x374151 }));
      exhaust.position.set(400, 1500, 900);
      vehGroup.add(exhaust);

      // 5. 運転席デッキ ＆ シート
      const deckGeo = new THREE.BoxGeometry(1300, 160, 1200);
      const deck = new THREE.Mesh(deckGeo, new THREE.MeshStandardMaterial({ color: 0x374151 }));
      deck.position.set(0, 700, -500);
      vehGroup.add(deck);

      const seatGeo = new THREE.BoxGeometry(550, 650, 500);
      const seat = new THREE.Mesh(seatGeo, new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      seat.position.set(0, 1050, -500);
      vehGroup.add(seat);

      // ステアリングホイール
      const steerGeo = new THREE.TorusGeometry(180, 20, 8, 16);
      steerGeo.rotateX(Math.PI / 4);
      const steer = new THREE.Mesh(steerGeo, new THREE.MeshStandardMaterial({ color: 0x111827 }));
      steer.position.set(0, 1250, -50);
      vehGroup.add(steer);

      // 6. 安全フレーム (ROPS ロールバーキャノピー)
      const ropsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
      const ropsPillarGeo = new THREE.CylinderGeometry(40, 40, 1600, 8);
      const ropsLeft = new THREE.Mesh(ropsPillarGeo, ropsMat);
      ropsLeft.position.set(-580, 1750, -750);
      const ropsRight = ropsLeft.clone();
      ropsRight.position.x = 580;

      const ropsTopGeo = new THREE.CylinderGeometry(40, 40, 1200, 8);
      ropsTopGeo.rotateZ(Math.PI / 2);
      const ropsTop = new THREE.Mesh(ropsTopGeo, ropsMat);
      ropsTop.position.set(0, 2550, -750);

      const roofCapGeo = new THREE.BoxGeometry(1300, 50, 1400);
      const roofCap = new THREE.Mesh(roofCapGeo, bodyMat);
      roofCap.position.set(0, 2600, -350);

      vehGroup.add(ropsLeft, ropsRight, ropsTop, roofCap);

    } else if (veh.type === 'car_suv') {
      // SUV・大型ワゴン (全長4800, 全幅1850, 全高1800)
      const bodyGeo = new THREE.BoxGeometry(1850, 750, 4600);
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 750;

      const cabinGeo = new THREE.BoxGeometry(1650, 750, 2800);
      const cabin = new THREE.Mesh(cabinGeo, glassMat);
      cabin.position.set(0, 1450, -200);

      const tireGeo = new THREE.CylinderGeometry(360, 360, 240, 16);
      tireGeo.rotateZ(Math.PI / 2);
      const fl = new THREE.Mesh(tireGeo, tireMat); fl.position.set(-900, 360, 1400);
      const fr = fl.clone(); fr.position.x = 900;
      const rl = fl.clone(); rl.position.z = -1400;
      const rr = fr.clone(); rr.position.z = -1400;

      vehGroup.add(body, cabin, fl, fr, rl, rr);

    } else if (veh.type === 'car_sport') {
      // スポーツクーペ (全長4400, 全幅1800, 全高1300)
      const bodyGeo = new THREE.BoxGeometry(1800, 450, 4400);
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 450;

      const cabinGeo = new THREE.BoxGeometry(1500, 550, 2200);
      const cabin = new THREE.Mesh(cabinGeo, glassMat);
      cabin.position.set(0, 950, -300);

      const tireGeo = new THREE.CylinderGeometry(320, 320, 240, 16);
      tireGeo.rotateZ(Math.PI / 2);
      const fl = new THREE.Mesh(tireGeo, tireMat); fl.position.set(-880, 320, 1300);
      const fr = fl.clone(); fr.position.x = 880;
      const rl = fl.clone(); rl.position.z = -1300;
      const rr = fr.clone(); rr.position.z = -1300;

      vehGroup.add(body, cabin, fl, fr, rl, rr);

    } else if (veh.type === 'bike') {
      // 大型バイク
      const frameGeo = new THREE.BoxGeometry(380, 600, 1600);
      const frame = new THREE.Mesh(frameGeo, bodyMat);
      frame.position.y = 650;

      const tireGeo = new THREE.CylinderGeometry(320, 320, 160, 16);
      tireGeo.rotateZ(Math.PI / 2);
      const fTire = new THREE.Mesh(tireGeo, tireMat); fTire.position.set(0, 320, 800);
      const rTire = fTire.clone(); rTire.position.z = -800;

      const steerGeo = new THREE.BoxGeometry(750, 50, 60);
      const steer = new THREE.Mesh(steerGeo, metalMat); steer.position.set(0, 1050, 600);

      vehGroup.add(frame, fTire, rTire, steer);
    }

    vehGroup.position.set(veh.posX, 0, veh.posZ);
    vehGroup.rotation.y = (veh.rotDeg || 0) * (Math.PI / 180);
    parentGroup.add(vehGroup);
  };

  // -------------------------------------------------------------
  // 開口部3Dモデリング
  // -------------------------------------------------------------
  const createOpening3D = (op, outerPts, parentGroup) => {
    const wallIndex = { front: 0, right: 1, back: 2, left: 3 }[op.wall];
    const pA = outerPts[wallIndex];
    const pB = outerPts[(wallIndex + 1) % 4];
    const angle = Math.atan2(pB.y - pA.y, pB.x - pA.x);
    const wallDir = new THREE.Vector2().subVectors(pB, pA).normalize();
    const wallNorm = new THREE.Vector2(-wallDir.y, wallDir.x);

    const pos2D = new THREE.Vector2().addVectors(pA, wallDir.clone().multiplyScalar(parseFloat(op.clearanceLeft) + 100));

    const opGroup = new THREE.Group();
    opGroup.position.set(pos2D.x, 0, pos2D.y);
    opGroup.rotation.y = -angle;

    const w = parseFloat(op.width);
    const h = parseFloat(op.height);
    const sill = parseFloat(op.sillHeight);
    const ratio = parseFloat(op.openRatio) || 0;

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.5 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.6 });

    if (op.type === 'shutter') {
      // シャッター（内付けセットバック100mm、スラット巻き上げ表現）
      const slatH = h * (1 - ratio);
      const shutterMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.4, roughness: 0.6 });
      const slatGeo = new THREE.BoxGeometry(w, slatH, 30);
      const slatMesh = new THREE.Mesh(slatGeo, shutterMat);
      slatMesh.position.set(w / 2, sill + h - slatH / 2, -100);
      opGroup.add(slatMesh);

      // シャッターBOX
      const boxGeo = new THREE.BoxGeometry(w + 100, 350, 350);
      const boxMesh = new THREE.Mesh(boxGeo, frameMat);
      boxMesh.position.set(w / 2, sill + h + 175, -100);
      opGroup.add(boxMesh);

    } else if (op.type === 'window') {
      // 引き違い窓（枠＋前後ガラス障子）
      const glassW = (w / 2) + 20;
      const g1 = new THREE.Mesh(new THREE.BoxGeometry(glassW, h - 60, 20), glassMat);
      g1.position.set(glassW / 2 + 10 + (w / 2 - 40) * ratio, sill + h / 2, 0);

      const g2 = new THREE.Mesh(new THREE.BoxGeometry(glassW, h - 60, 20), glassMat);
      g2.position.set(w - glassW / 2 - 10, sill + h / 2, 25);
      opGroup.add(g1, g2);

    } else {
      // ドア / FIX窓
      const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(w - 40, h - 40, 40), glassMat);
      doorMesh.position.set(w / 2, sill + h / 2, 0);
      opGroup.add(doorMesh);
    }

    parentGroup.add(opGroup);
  };

  // -------------------------------------------------------------
  // 内部棚3Dモデリング
  // -------------------------------------------------------------
  const createShelfUnit3D = (shelf, innerPts, parentGroup, woodMat) => {
    const wallIndex = { front: 0, right: 1, back: 2, left: 3 }[shelf.wall];
    const pA = innerPts[wallIndex];
    const pB = innerPts[(wallIndex + 1) % 4];
    const angle = Math.atan2(pB.y - pA.y, pB.x - pA.x);
    const wallDir = new THREE.Vector2().subVectors(pB, pA).normalize();
    const pos2D = new THREE.Vector2().addVectors(pA, wallDir.clone().multiplyScalar(parseFloat(shelf.clearanceLeft)));

    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(pos2D.x, 0, pos2D.y);
    shelfGroup.rotation.y = -angle;

    const w = parseFloat(shelf.width);
    const d = parseFloat(shelf.depth);
    const wallThick = d <= 600 ? 60 : 90;

    // 棚板各段
    shelf.levels.forEach((lvlH) => {
      const boardGeo = new THREE.BoxGeometry(w, 30, d);
      const board = new THREE.Mesh(boardGeo, woodMat);
      board.position.set(w / 2, lvlH - 15, -d / 2);
      shelfGroup.add(board);
    });

    // 側板・等分間仕切壁 (スパン2000mm以内自動等分)
    const numDiv = Math.ceil(w / 2000);
    const spanW = w / numDiv;
    const maxH = Math.max(...shelf.levels, 1800) + 100;

    for (let i = 0; i <= numDiv; i++) {
      const sideGeo = new THREE.BoxGeometry(wallThick, maxH, d);
      const side = new THREE.Mesh(sideGeo, woodMat);
      side.position.set(i * spanW, maxH / 2, -d / 2);
      shelfGroup.add(side);
    }

    parentGroup.add(shelfGroup);
  };

  // -------------------------------------------------------------
  // 3D寸法線描画
  // -------------------------------------------------------------
  const draw3dDimensions = (corePts, eaveH, dimGroup, scaleFactor) => {
    const lineMat = new THREE.LineBasicMaterial({ color: 0x0284c7 });
    // 前面幅寸法
    add3dDimLine(
      new THREE.Vector3(corePts[0].x, 100, corePts[0].y + 400),
      new THREE.Vector3(corePts[1].x, 100, corePts[1].y + 400),
      corePts[0].distanceTo(corePts[1]),
      dimGroup,
      lineMat,
      scaleFactor
    );
  };

  const add3dDimLine = (start, end, dist, group, mat, sf) => {
    const geo = new THREE.BufferGeometry().setFromPoints([start, end]);
    group.add(new THREE.Line(geo, mat));
  };

  // -------------------------------------------------------------
  // 積算計算ロジック
  // -------------------------------------------------------------
  const calculateEstimates = (corePts, outerPts, spans, eaveH, slope, ops) => {
    // 1. 床面積 (靴ひも公式)
    let areaMm2 = 0;
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      areaMm2 += corePts[i].x * corePts[j].y - corePts[j].x * corePts[i].y;
    }
    const floorM2 = Math.abs(areaMm2) / 2 / 1000000;
    const floorTsubo = floorM2 * 0.3025;

    // 2. 基礎長さ (外周ふかし)
    let fndLenM = 0;
    for (let i = 0; i < 4; i++) {
      fndLenM += outerPts[i].distanceTo(outerPts[(i + 1) % 4]) / 1000;
    }

    // 3. 屋根実面積
    let roofProjMm2 = 0;
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      roofProjMm2 += outerPts[i].x * outerPts[j].y - outerPts[j].x * outerPts[i].y;
    }
    const roofProjM2 = Math.abs(roofProjMm2) / 2 / 1000000;
    const slopeFactor = Math.sqrt(1 + Math.pow(slope / 10.0, 2));
    const roofRealM2 = roofProjM2 * slopeFactor;

    // 4. サッシ開口部面積
    let openM2 = 0;
    ops.forEach(op => {
      openM2 += (parseFloat(op.width) / 1000) * (parseFloat(op.height) / 1000);
    });

    // 5. 外壁面積
    const wallNames = ['正面', '右面', '後面', '左面'];
    let totalWallGross = 0;
    let details = '';

    for (let i = 0; i < 4; i++) {
      const wSpan = outerPts[i].distanceTo(outerPts[(i + 1) % 4]) / 1000;
      const wallGross = wSpan * (eaveH / 1000 + 0.3); // 平均壁高概算
      totalWallGross += wallGross;
      details += `${wallNames[i]}: ${wallGross.toFixed(2)}㎡\n`;
    }
    const netWallM2 = Math.max(0, totalWallGross - openM2);

    setCalcResults({
      floorArea: floorM2.toFixed(2),
      floorTsubo: floorTsubo.toFixed(2),
      foundationLength: fndLenM.toFixed(2),
      roofArea: roofRealM2.toFixed(2),
      openingsArea: openM2.toFixed(2),
      wallsArea: netWallM2.toFixed(2),
      wallDetails: details
    });

    // バリデーションチェック
    const errors = [];
    ops.forEach((op, idx) => {
      if (parseFloat(op.clearanceLeft) < 100) {
        errors.push(`開口部 #${idx + 1}: 左柱芯逃げ100mm以上を確保してください（現在: ${op.clearanceLeft}mm）`);
      }
    });
    setValidationErrors(errors);
  };

  // -------------------------------------------------------------
  // 2Dベクトル製図 (SVG描画)
  // -------------------------------------------------------------
  const renderSvgDrawing = () => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.innerHTML = '';
    const { wFront, wBack, dLeft, dRight, eaveHeight, foundationHeight } = dimensions;

    const svgWidth = 800 * svgZoom;
    const svgHeight = 600 * svgZoom;
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', svgHeight);

    if (currentView === 'plan') {
      svg.setAttribute('viewBox', '-4000 -7000 8000 8000');
      // 柱芯四角形
      const p0 = `${-wFront / 2},0`;
      const p1 = `${wFront / 2},0`;
      const p2 = `${wFront / 2 - (wFront - wBack) / 2},${-dRight}`;
      const p3 = `${-wFront / 2 + (wFront - wBack) / 2},${-dLeft}`;
      
      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      poly.setAttribute('points', `${p0} ${p1} ${p2} ${p3}`);
      poly.setAttribute('fill', '#f1f5f9');
      poly.setAttribute('stroke', '#0284c7');
      poly.setAttribute('stroke-width', '40');
      svg.appendChild(poly);

      // 寸法テキスト
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '0');
      text.setAttribute('y', '350');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#1e293b');
      text.setAttribute('font-size', `${180 * dimFontScale}`);
      text.setAttribute('font-weight', 'bold');
      text.textContent = `正面幅: ${wFront}mm / 奥行: L${dLeft} R${dRight}mm`;
      svg.appendChild(text);

    } else {
      // 立面図 (正面 / 裏 / 左 / 右)
      svg.setAttribute('viewBox', '-4000 -1000 8000 6000');
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', `${-wFront / 2}`);
      rect.setAttribute('y', `${5000 - eaveHeight}`);
      rect.setAttribute('width', `${wFront}`);
      rect.setAttribute('height', `${eaveHeight}`);
      rect.setAttribute('fill', '#e2e8f0');
      rect.setAttribute('stroke', '#334155');
      rect.setAttribute('stroke-width', '30');
      svg.appendChild(rect);

      // GL線
      const gl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      gl.setAttribute('x1', '-3800');
      gl.setAttribute('y1', '5000');
      gl.setAttribute('x2', '3800');
      gl.setAttribute('y2', '5000');
      gl.setAttribute('stroke', '#15803d');
      gl.setAttribute('stroke-width', '40');
      svg.appendChild(gl);

      const glText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      glText.setAttribute('x', '-3700');
      glText.setAttribute('y', '4950');
      glText.setAttribute('fill', '#15803d');
      glText.setAttribute('font-size', `${140 * dimFontScale}`);
      glText.setAttribute('font-weight', 'bold');
      glText.textContent = '▼ 設計GL ±0';
      svg.appendChild(glText);
    }
  };

  // -------------------------------------------------------------
  // プロジェクトJSON保存・復元
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

  // 画像保存 (AIパース生成用)
  const handleDownloadImage = () => {
    const { renderer } = threeRef.current;
    if (!renderer) return;
    const dataUrl = renderer.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `archix-garage-3d-${Date.now()}.png`;
    a.click();
  };

  // オフセットポリゴン計算ユーティリティ
  const getOffsetPolygon = (corePts, offset) => {
    const n = corePts.length;
    const lines = [];
    for (let i = 0; i < n; i++) {
      const pA = corePts[i];
      const pB = corePts[(i + 1) % n];
      const v = new THREE.Vector2().subVectors(pB, pA).normalize();
      const norm = new THREE.Vector2(-v.y, v.x);
      lines.push({ p: new THREE.Vector2().addVectors(pA, norm.clone().multiplyScalar(offset)), v });
    }
    const out = [];
    for (let i = 0; i < n; i++) {
      const l1 = lines[(i + n - 1) % n];
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

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 65px)', overflow: 'hidden', background: '#1e293b' }}>
      {/* 操作マニュアルモーダル */}
      <ManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />

      {/* サイドバー（パラメータ入力・積算・操作系） */}
      <div style={{
        width: 440,
        height: '100%',
        background: '#f8fafc',
        borderRight: '1px solid #e2e8f0',
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        flexShrink: 0
      }}>
        {/* ナビゲーション戻る ＆ マニュアルボタン */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setCurrentRoute('top')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}
          >
            <ArrowLeft size={16} />
            <span>サイトへ戻る</span>
          </button>
          
          <button
            onClick={() => setIsManualOpen(true)}
            className="btn-primary"
            style={{ padding: '6px 14px', fontSize: 12, borderRadius: 6 }}
          >
            <BookOpen size={15} />
            <span>📖 操作マニュアル</span>
          </button>
        </div>

        {/* JSON保存 / 読込 / 戻る / 進む */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button onClick={handleSaveJson} className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12, borderRadius: 6, justifyContent: 'center' }}>
            <Save size={14} />
            <span>設定を保存 (JSON)</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12, borderRadius: 6, justifyContent: 'center' }}>
            <FolderOpen size={14} />
            <span>設定を読込</span>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleLoadJson} accept=".json" style={{ display: 'none' }} />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleUndo} className="btn-secondary" style={{ flex: 1, padding: '5px', fontSize: 11, borderRadius: 4, justifyContent: 'center' }}>
            <Undo2 size={13} /> 元に戻す (Undo)
          </button>
          <button onClick={handleRedo} className="btn-secondary" style={{ flex: 1, padding: '5px', fontSize: 11, borderRadius: 4, justifyContent: 'center' }}>
            <Redo2 size={13} /> やり直す (Redo)
          </button>
        </div>

        {/* 柱芯寸法 */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}>
          <h3 style={{ fontSize: 13, color: '#1e293b', borderBottom: '2px solid var(--color-primary)', paddingBottom: 4, marginBottom: 10 }}>
            柱芯寸法 (mm) - 台形・変形地対応
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>正面幅 (mm)</label>
              <input 
                type="number" 
                value={dimensions.wFront} 
                step="10" 
                onChange={(e) => { setDimensions({ ...dimensions, wFront: parseFloat(e.target.value) || 0 }); pushHistory({ ...dimensions, wFront: parseFloat(e.target.value) || 0 }); }}
                style={{ width: '100%', padding: '4px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>背面幅 (mm)</label>
              <input 
                type="number" 
                value={dimensions.wBack} 
                step="10" 
                onChange={(e) => { setDimensions({ ...dimensions, wBack: parseFloat(e.target.value) || 0 }); pushHistory({ ...dimensions, wBack: parseFloat(e.target.value) || 0 }); }}
                style={{ width: '100%', padding: '4px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>左奥行 (mm)</label>
              <input 
                type="number" 
                value={dimensions.dLeft} 
                step="10" 
                onChange={(e) => { setDimensions({ ...dimensions, dLeft: parseFloat(e.target.value) || 0 }); pushHistory({ ...dimensions, dLeft: parseFloat(e.target.value) || 0 }); }}
                style={{ width: '100%', padding: '4px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>右奥行 (mm)</label>
              <input 
                type="number" 
                value={dimensions.dRight} 
                step="10" 
                onChange={(e) => { setDimensions({ ...dimensions, dRight: parseFloat(e.target.value) || 0 }); pushHistory({ ...dimensions, dRight: parseFloat(e.target.value) || 0 }); }}
                style={{ width: '100%', padding: '4px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12 }}
              />
            </div>
          </div>
          <div style={{ fontSize: 10, color: '#64748b' }}>※外壁ふかし+100mm / 内壁仕上: 柱芯+65mm</div>
        </div>

        {/* 高さ・屋根・天井仕様 */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}>
          <h3 style={{ fontSize: 13, color: '#1e293b', borderBottom: '2px solid var(--color-primary)', paddingBottom: 4, marginBottom: 10 }}>
            高さ・屋根勾配・天井仕様
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>水下軒高 (GL+ mm)</label>
              <input 
                type="number" 
                value={dimensions.eaveHeight} 
                step="10" 
                onChange={(e) => setDimensions({ ...dimensions, eaveHeight: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', padding: '4px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12 }}
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
                style={{ width: '100%', padding: '4px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12 }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>水流し方向</label>
            <select 
              value={dimensions.slopeDirection} 
              onChange={(e) => setDimensions({ ...dimensions, slopeDirection: e.target.value })}
              style={{ width: '100%', padding: '4px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12 }}
            >
              <option value="front-to-back">前高・後低 (後へ流す)</option>
              <option value="back-to-front">後高・前低 (前へ流す)</option>
              <option value="left-to-right">左高・右低 (右へ流す)</option>
              <option value="right-to-left">右高・左低 (左へ流す)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>天井仕様</label>
            <select 
              value={dimensions.ceilingType} 
              onChange={(e) => setDimensions({ ...dimensions, ceilingType: e.target.value })}
              style={{ width: '100%', padding: '4px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12 }}
            >
              <option value="open">小屋組み現し (標準仕様)</option>
              <option value="flat">フラット天井 (-320mm / PB9.5mm)</option>
              <option value="sloped">勾配天井 (屋根なり斜め)</option>
            </select>
          </div>
        </div>

        {/* 車両配置（★トラクター新設） */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--color-accent)', paddingBottom: 4, marginBottom: 10 }}>
            <h3 style={{ fontSize: 13, color: '#1e293b' }}>
              🚗 車両・トラクター配置（AIパース用）
            </h3>
            <button 
              onClick={() => {
                setVehicles([...vehicles, { id: Date.now(), type: 'tractor', posX: 0, posZ: -3000, rotDeg: 0, color: '#dc2626' }]);
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
                      <option value="tractor">🚜 農業用トラクター</option>
                      <option value="car_suv">🚙 SUV・大型ワゴン</option>
                      <option value="car_sport">🏎 スポーツカー・クーペ</option>
                      <option value="bike">🏍 大型バイク</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>カラー</label>
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

        {/* 自動積算・面積表示 */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}>
          <h3 style={{ fontSize: 13, color: '#1e293b', borderBottom: '2px solid var(--color-primary)', paddingBottom: 4, marginBottom: 10 }}>
            📊 面積・自動積算数量
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
            <div style={{ background: '#f8fafc', padding: 8, borderRadius: 4, borderLeft: '3px solid var(--color-primary)' }}>
              <div style={{ color: '#64748b', fontSize: 11 }}>① 床面積 (柱芯間)</div>
              <div style={{ fontWeight: 800, color: '#1e293b', fontSize: 14 }}>
                {calcResults.floorArea} ㎡ <span style={{ fontSize: 11, color: 'var(--color-wood)' }}>({calcResults.floorTsubo} 坪)</span>
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: 8, borderRadius: 4, borderLeft: '3px solid var(--color-primary)' }}>
              <div style={{ color: '#64748b', fontSize: 11 }}>② 基礎外周長</div>
              <div style={{ fontWeight: 800, color: '#1e293b', fontSize: 14 }}>{calcResults.foundationLength} m</div>
            </div>
            <div style={{ background: '#f8fafc', padding: 8, borderRadius: 4, borderLeft: '3px solid var(--color-primary)' }}>
              <div style={{ color: '#64748b', fontSize: 11 }}>③ 屋根実面積 (勾配加算)</div>
              <div style={{ fontWeight: 800, color: '#1e293b', fontSize: 14 }}>{calcResults.roofArea} ㎡</div>
            </div>
            <div style={{ background: '#f8fafc', padding: 8, borderRadius: 4, borderLeft: '3px solid var(--color-primary)' }}>
              <div style={{ color: '#64748b', fontSize: 11 }}>④ 純外壁面積</div>
              <div style={{ fontWeight: 800, color: '#1e293b', fontSize: 14 }}>{calcResults.wallsArea} ㎡</div>
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
          <span>表示画面を画像保存 (AIパース用)</span>
        </button>
      </div>

      {/* メインビューエリア (3D / 2D切替) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* ビュー切替タブバー */}
        <div style={{
          display: 'flex',
          background: '#0f172a',
          padding: '6px 12px 0',
          gap: 6,
          alignItems: 'center',
          borderBottom: '2px solid #334155',
          flexShrink: 0
        }}>
          {[
            { id: '3d', label: '🏠 3Dパース' },
            { id: 'plan', label: '📐 平面図' },
            { id: 'front-elev', label: '🏛 正立面図' },
            { id: 'back-elev', label: '🏛 裏立面図' },
            { id: 'left-elev', label: '🏛 左側立面図' },
            { id: 'right-elev', label: '🏛 右側立面図' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              style={{
                padding: '8px 14px',
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

          {/* ヘルパーツール */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 4 }}>
            {currentView === '3d' && (
              <button
                onClick={() => setIsSeeThrough(!isSeeThrough)}
                style={{
                  background: isSeeThrough ? 'var(--color-primary)' : '#334155',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {isSeeThrough ? <Eye size={13} /> : <EyeOff size={13} />}
                <span>透視モード: {isSeeThrough ? 'ON' : 'OFF'}</span>
              </button>
            )}

            {currentView !== '3d' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#38bdf8', fontSize: 11, fontWeight: 700 }}>
                <span>図面縮尺:</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={svgZoom}
                  onChange={(e) => setSvgZoom(parseFloat(e.target.value))}
                  style={{ width: 70 }}
                />
                <span>{(svgZoom * 100).toFixed(0)}%</span>
              </div>
            )}
          </div>
        </div>

        {/* キャンバスコンテナ */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
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

          {/* 操作インフォタグ */}
          <div style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            background: 'rgba(15, 23, 42, 0.8)',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 11,
            pointerEvents: 'none'
          }}>
            {currentView === '3d' ? '左ドラッグ: 回転 | 右ドラッグ: 移動 | ホイール: ズーム' : '2Dベクトル製図自動展開モード'}
          </div>
        </div>
      </div>
    </div>
  );
}
