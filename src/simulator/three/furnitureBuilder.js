/**
 * 3Dスケールモデル・家具ビルダー (Furniture & Vehicle Builder)
 * 
 * 【単一責任の原則 (SRP)】
 * - 内部棚・間仕切りユニット（支柱、段数別棚板、金具）の3D Mesh生成
 * - スケール車両モデル（農業用トラクター、SUV、スポーツカー、バイク）の3D Mesh生成
 * - 敷地障害物・隅欠き（凸凹L字）可視化ゾーンの3D Mesh生成
 */

import * as THREE from 'three';
import { WALL_INNER_OFFSET } from '../constants';

/**
 * 各種スケール車両モデルの3Dメッシュ生成
 */
export function createVehicleMesh(type, bodyColorHex) {
  const group = new THREE.Group();
  const bodyColor = new THREE.Color(bodyColorHex || '#dc2626');
  const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.3, metalness: 0.3 });
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.8, roughness: 0.2 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.1, transparent: true, opacity: 0.7 });

  if (type === 'tractor') {
    // 🚜 農業用トラクター (ControlNet Depth/Canny完全認識仕様)
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
}

/**
 * 内部棚・間仕切りユニットの3Dメッシュ配置
 */
export function buildShelves3D({
  shelfUnits,
  corePts,
  buildingGroup,
  woodMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 }),
  edgeLineMat
}) {
  if (!shelfUnits || !buildingGroup) return;

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

    // 縦仕切り板
    for (let i = 0; i <= numDivisions; i++) {
      const pPart = shelfPos.clone().add(wallDir.clone().multiplyScalar(-unit.width / 2 + i * span));
      const pGeo = new THREE.BoxGeometry(partitionThickness, partitionH, unit.depth);
      const pMesh = new THREE.Mesh(pGeo, woodMat);
      pMesh.position.set(pPart.x, partitionCenterY, pPart.y);
      pMesh.rotation.y = shelfAngle;
      if (edgeLineMat) {
        pMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(pGeo), edgeLineMat));
      }
      buildingGroup.add(pMesh);
    }

    // 各段の棚板
    unit.levels.forEach(levelGL => {
      const boardCenterY = levelGL - shelfThickness / 2;
      const bGeo = new THREE.BoxGeometry(unit.width, shelfThickness, unit.depth);
      const bMesh = new THREE.Mesh(bGeo, woodMat);
      bMesh.position.set(shelfPos.x, boardCenterY, shelfPos.y);
      bMesh.rotation.y = shelfAngle;
      if (edgeLineMat) {
        bMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(bGeo), edgeLineMat));
      }
      buildingGroup.add(bMesh);
    });
  });
}

/**
 * 車両スケールモデルの3D配置
 */
export function buildVehicles3D({ vehicles, buildingGroup }) {
  if (!vehicles || !buildingGroup) return;

  vehicles.forEach(veh => {
    const vMesh = createVehicleMesh(veh.type, veh.color);
    vMesh.position.set(veh.posX, 0, veh.posZ);
    vMesh.rotation.y = (veh.rotDeg || 0) * (Math.PI / 180);
    buildingGroup.add(vMesh);
  });
}

/**
 * 敷地障害物・隅欠き（凸凹）ゾーンの可視化
 */
export function buildCornerCutZone3D({ dimensions, corePts, buildingGroup }) {
  if (!dimensions.cornerCutEnabled || !buildingGroup) return;

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
