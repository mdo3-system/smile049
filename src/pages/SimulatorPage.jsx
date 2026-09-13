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
import EstimateDetailModal from '../components/EstimateDetailModal';
import { APP_VERSION } from '../version.js';
import { WALL_KEYS, WALL_NAMES_JA, WALL_OUTER_OFFSET, WALL_INNER_OFFSET, isFloorLevelOpening } from '../simulator/constants';
import { getCorePoints, getOffsetPoints, calculateAngles, getGirderHeight, getWallSpan } from '../simulator/geometry/buildingGeometry';
import { calculateBuildingQuantities } from '../simulator/pricing/costEstimator';
import { renderSvgDrawings } from '../simulator/svg/svgDrawingEngine';
import { buildOpenings3D } from '../simulator/three/openingBuilder';
import { buildShelves3D, buildVehicles3D, buildCornerCutZone3D } from '../simulator/three/furnitureBuilder';
import { buildDimensions3D } from '../simulator/three/dimension3dBuilder';
import { createSimulatorMaterials } from '../simulator/three/materials';
import { buildStructure3D } from '../simulator/three/building3dBuilder';

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
  // 概算見積書モーダル (7大枠 ＆ 薄墨オプション)
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);

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

  // 車両配置リスト (SUV / スポーツ / バイク / トラクター)
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      type: 'car_suv',
      posX: 0,
      posZ: -3000,
      rotDeg: 0,
      color: '#2563eb'
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
      renderSvgDrawings({
        svgElement: svgRef.current,
        currentView,
        dimensions,
        openings,
        vehicles,
        dimFontScale
      });
    }
  }, [currentView, dimensions, openings, shelfUnits, vehicles, svgZoom, dimFontScale]);

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
      const span = getWallSpan(op.wall, dimensions);
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

    const { wFront: wF, wBack: wB, dLeft: dL, dRight: dR, eaveHeight: eaveH, roofSlope: slope, slopeDirection: slopeDir, shapeType, skewOffset } = dimensions;

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

    // マテリアルセット生成 (【単一責任の原則】materialsモジュールへ委譲)
    const materials = createSimulatorMaterials({ isSeeThrough });

    // 見積計算式の更新 & バリデーション
    updateCalculations(corePts, outerPts, hPts, roofThickness, slope);
    validateAllOpenings();

    // 1〜5. 躯体・建築構造（土間スラブ・基礎・外壁・屋根・天井）
    buildStructure3D({
      buildingGroup,
      dimensions,
      corePts,
      outerPts,
      innerPts,
      hPts,
      hInnerPts,
      roofThickness,
      openings,
      materials
    });

    // 6. 開口部 (シャッター内付け、引き違い窓、FIX窓、ドア)
    buildOpenings3D({
      openings,
      corePts,
      buildingGroup,
      edgeLineMat: materials.edgeLineMat,
      shutterBoxMat: materials.shutterBoxMat,
      shutterMat: materials.shutterMat,
      sashFrameMat: materials.sashFrameMat,
      windowGlassMat: materials.windowGlassMat,
      doorFrameMat: materials.doorFrameMat,
      doorPanelMat: materials.doorPanelMat
    });


    // 7. 内部棚・間仕切りユニット
    buildShelves3D({
      shelfUnits,
      corePts,
      buildingGroup,
      woodMat: materials.woodMat,
      edgeLineMat: materials.edgeLineMat
    });

    // 8. 車両・スケールモデル (SUV / スポーツ / バイク / ★トラクター)
    buildVehicles3D({
      vehicles,
      buildingGroup
    });

    // 8.5 敷地障害物・隅欠き（凸凹）ゾーンの可視化
    buildCornerCutZone3D({
      dimensions,
      corePts,
      buildingGroup
    });

    // 9. 3D寸法線・文字スプライト (gemini-code 完全復元)
    if (show3dDimensions) {
      buildDimensions3D({
        dimGroup: threeRef.current.dimGroup,
        dimensions,
        corePts,
        outerPts,
        hPts,
        roofThickness,
        dim3dFontScale
      });
    }

  };



  // -------------------------------------------------------------
  // 積算計算 & 計算式表示 (【単一責任の原則】costEstimatorモジュールへ委譲)
  // -------------------------------------------------------------
  const updateCalculations = (corePts, outerPts, hPts, roofThickness, slopeVal) => {
    const quantities = calculateBuildingQuantities(corePts, outerPts, hPts, dimensions, openings);
    setCalculations(quantities);
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

      {/* 概算見積書モーダル (7大枠 ＆ 薄墨オプション) */}
      <EstimateDetailModal 
        isOpen={isEstimateModalOpen} 
        onClose={() => setIsEstimateModalOpen(false)} 
        quantities={calculations}
        dimensions={dimensions}
        openings={openings}
        onOpenParseRequest={() => setIsParseRequestOpen(true)}
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

        {/* 右: アクション（見積書 / パース依頼 / 相談 / マニュアル / 全画面切替） */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => setIsEstimateModalOpen(true)}
            className="btn-secondary"
            style={{ padding: '5px 8px', fontSize: 11.5, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}
            title="概算建築御見積書（7大枠・薄墨オプション）を確認"
          >
            <FileText size={13} color="var(--color-primary)" />
            <span>見積書(7大枠)</span>
          </button>

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

        {/* 5. 車両配置 (SUV / スポーツ / バイク / トラクター) */}
        <div className={`control-section ${activeMobileTab === 'vehicles' ? 'mobile-show' : 'mobile-hide'}`} style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--color-accent)', paddingBottom: 4, marginBottom: 8 }}>
            <h3 style={{ fontSize: 13, color: '#1e293b' }}>🚙 車両・バイク配置</h3>
            <button
              onClick={() => {
                setVehicles([...vehicles, { id: Date.now(), type: 'car_suv', posX: 0, posZ: -3000, rotDeg: 0, color: '#2563eb' }]);
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

            {/* 概算御見積書モーダル表示ボタン */}
            <button
              type="button"
              onClick={() => setIsEstimateModalOpen(true)}
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: 6,
                padding: '10px 14px',
                fontSize: 12.5,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <FileText size={15} color="#38bdf8" />
              <span>📄 概算御見積書（7大枠・薄墨オプション）を確認</span>
            </button>
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

