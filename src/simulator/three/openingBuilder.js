/**
 * 3D開口部・建具ビルダー (Opening Builder)
 * 
 * 【単一責任の原則 (SRP)】
 * - シャッター（ボックス、ガイドレール、スラット、開閉比率連動）の3D Mesh生成
 * - 引き違い窓、Fix窓（サッシ枠、ガラス透明マテリアル）の3D Mesh生成
 * - 出入口ドア、片引き戸（土間付け・半外付け）の3D Mesh生成
 * - 壁芯座標および開口部配置パラメータに基づく3Dグループ配置
 */

import * as THREE from 'three';
import { WALL_OUTER_OFFSET, isFloorLevelOpening } from '../constants';

/**
 * 引き違い窓メッシュ生成 (data/gemini-code 完全準拠)
 * 四方枠（上枠・下枠・左右縦枠）＋前後段違いの2枚引き違い障子（ガラス＋召し合わせ框）
 */
export function createSlidingWindowMesh(width, height, {
  sashFrameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.25 }),
  windowGlassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.08, metalness: 0.15, transparent: true, opacity: 0.65, side: THREE.DoubleSide }),
  edgeLineMat
} = {}) {
  const group = new THREE.Group();
  const frameDepth = 65;
  const frameThick = 40;

  // 1. 上枠
  const topFrame = new THREE.Mesh(new THREE.BoxGeometry(width, frameThick, frameDepth), sashFrameMat);
  topFrame.position.set(0, height / 2 - frameThick / 2, 0);
  group.add(topFrame);

  // 2. 下枠
  const bottomFrame = new THREE.Mesh(new THREE.BoxGeometry(width, frameThick, frameDepth), sashFrameMat);
  bottomFrame.position.set(0, -height / 2 + frameThick / 2, 0);
  group.add(bottomFrame);

  // 3. 左縦枠
  const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThick, height - frameThick * 2, frameDepth), sashFrameMat);
  leftFrame.position.set(-width / 2 + frameThick / 2, 0, 0);
  group.add(leftFrame);

  // 4. 右縦枠
  const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThick, height - frameThick * 2, frameDepth), sashFrameMat);
  rightFrame.position.set(width / 2 - frameThick / 2, 0, 0);
  group.add(rightFrame);

  // 障子寸法（左右2枚で中央をオーバーラップ +30mm）
  const paneW = (width - frameThick * 2 + 30) / 2;
  const paneH = height - frameThick * 2;

  // 5. 左障子 (屋外側手前 Z: +10)
  const paneLGroup = new THREE.Group();
  const glassL = new THREE.Mesh(new THREE.BoxGeometry(paneW, paneH, 8), windowGlassMat);
  paneLGroup.add(glassL);
  
  // 召し合わせ框（中央の縦框）
  const barL = new THREE.Mesh(new THREE.BoxGeometry(28, paneH, 22), sashFrameMat);
  barL.position.set(paneW / 2 - 14, 0, 0);
  paneLGroup.add(barL);
  
  // 左端框
  const leftBarL = new THREE.Mesh(new THREE.BoxGeometry(22, paneH, 20), sashFrameMat);
  leftBarL.position.set(-paneW / 2 + 11, 0, 0);
  paneLGroup.add(leftBarL);

  paneLGroup.position.set(-width / 4 + 7, 0, 10);
  group.add(paneLGroup);

  // 6. 右障子 (屋内側奥 Z: -10)
  const paneRGroup = new THREE.Group();
  const glassR = new THREE.Mesh(new THREE.BoxGeometry(paneW, paneH, 8), windowGlassMat);
  paneRGroup.add(glassR);

  // 召し合わせ框（中央の縦框）
  const barR = new THREE.Mesh(new THREE.BoxGeometry(28, paneH, 22), sashFrameMat);
  barR.position.set(-paneW / 2 + 14, 0, 0);
  paneRGroup.add(barR);

  // 右端框
  const rightBarR = new THREE.Mesh(new THREE.BoxGeometry(22, paneH, 20), sashFrameMat);
  rightBarR.position.set(paneW / 2 - 11, 0, 0);
  paneRGroup.add(rightBarR);

  paneRGroup.position.set(width / 4 - 7, 0, -10);
  group.add(paneRGroup);

  return group;
}

/**
 * Fix窓メッシュ生成 (data/gemini-code 完全準拠)
 * 四方枠（上枠・下枠・左右枠）＋はめ殺しガラス
 */
export function createFixWindowMesh(width, height, {
  sashFrameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.25 }),
  windowGlassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.08, metalness: 0.15, transparent: true, opacity: 0.65, side: THREE.DoubleSide })
} = {}) {
  const group = new THREE.Group();
  const frameDepth = 60;
  const frameThick = 35;

  const topFrame = new THREE.Mesh(new THREE.BoxGeometry(width, frameThick, frameDepth), sashFrameMat);
  topFrame.position.set(0, height / 2 - frameThick / 2, 0);
  group.add(topFrame);

  const bottomFrame = new THREE.Mesh(new THREE.BoxGeometry(width, frameThick, frameDepth), sashFrameMat);
  bottomFrame.position.set(0, -height / 2 + frameThick / 2, 0);
  group.add(bottomFrame);

  const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThick, height - frameThick * 2, frameDepth), sashFrameMat);
  leftFrame.position.set(-width / 2 + frameThick / 2, 0, 0);
  group.add(leftFrame);

  const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThick, height - frameThick * 2, frameDepth), sashFrameMat);
  rightFrame.position.set(width / 2 - frameThick / 2, 0, 0);
  group.add(rightFrame);

  // 透明ガラス
  const glass = new THREE.Mesh(new THREE.BoxGeometry(width - frameThick * 2, height - frameThick * 2, 8), windowGlassMat);
  glass.position.set(0, 0, 0);
  group.add(glass);

  return group;
}


/**
 * 建物壁面の全開口部を3D空間に配置
 */
export function buildOpenings3D({
  openings,
  corePts,
  buildingGroup,
  edgeLineMat,
  shutterBoxMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5, roughness: 0.5 }),
  shutterMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.4, roughness: 0.6 }),
  sashFrameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.25 }),
  windowGlassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.08, metalness: 0.15, transparent: true, opacity: 0.65, side: THREE.DoubleSide }),
  doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.2 }),
  doorPanelMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.2 }),
  insideOffset = 80
}) {
  if (!openings || !buildingGroup) return;

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

      // シャッターボックス
      const boxGeo = new THREE.BoxGeometry(op.width, 240, 240);
      const boxMesh = new THREE.Mesh(boxGeo, shutterBoxMat);
      boxMesh.position.set(shutterPos.x, op.topHeightGL - 120, shutterPos.y);
      boxMesh.rotation.y = angle;
      buildingGroup.add(boxMesh);

      // ガイドレール (左右)
      [-1, 1].forEach(side => {
        const railPos = shutterPos.clone().add(wallDir.clone().multiplyScalar(side * (op.width / 2 - 15)));
        const railGeo = new THREE.BoxGeometry(30, fullH, 40);
        const railMesh = new THREE.Mesh(railGeo, shutterBoxMat);
        railMesh.position.set(railPos.x, bottomY + fullH / 2, railPos.y);
        railMesh.rotation.y = angle;
        buildingGroup.add(railMesh);
      });

      // スラット (開閉比率連動)
      if (currentH > 20) {
        const sGeo = new THREE.BoxGeometry(op.width - 20, currentH, 20);
        const sMesh = new THREE.Mesh(sGeo, shutterMat);
        sMesh.position.set(shutterPos.x, currentCenterY, shutterPos.y);
        sMesh.rotation.y = angle;
        if (edgeLineMat) {
          sMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(sGeo), edgeLineMat));
        }
        buildingGroup.add(sMesh);
      }
    } else {
      const semiOuterPos = corePos.clone().add(outNorm.clone().multiplyScalar(WALL_OUTER_OFFSET + 10));

      if (op.type === 'window') {
        const winMesh = createSlidingWindowMesh(op.width, fullH, { sashFrameMat, windowGlassMat, edgeLineMat });
        winMesh.position.set(semiOuterPos.x, bottomY + fullH / 2, semiOuterPos.y);
        winMesh.rotation.y = angle;
        buildingGroup.add(winMesh);
      } else if (op.type === 'fix') {
        const fixMesh = createFixWindowMesh(op.width, fullH, { sashFrameMat, windowGlassMat });
        fixMesh.position.set(semiOuterPos.x, bottomY + fullH / 2, semiOuterPos.y);
        fixMesh.rotation.y = angle;
        buildingGroup.add(fixMesh);
      } else if (op.type === 'sliding_door') {
        // 片引き戸 (土間付け・半外付け)
        const doorGroup = new THREE.Group();
        const frameGeo = new THREE.BoxGeometry(op.width, fullH, 50);
        const frameMesh = new THREE.Mesh(frameGeo, doorFrameMat);
        doorGroup.add(frameMesh);
        const panelGeo = new THREE.BoxGeometry(op.width - 60, fullH - 60, 28);
        const panelMesh = new THREE.Mesh(panelGeo, doorPanelMat);
        panelMesh.position.set(0, 0, 5);
        doorGroup.add(panelMesh);
        doorGroup.position.set(semiOuterPos.x, bottomY + fullH / 2, semiOuterPos.y);
        doorGroup.rotation.y = angle;
        buildingGroup.add(doorGroup);
      } else {
        // 框ドア (片開き・土間付け・半外付け)
        const doorGroup = new THREE.Group();
        const frameGeo = new THREE.BoxGeometry(op.width, fullH, 50);
        const frameMesh = new THREE.Mesh(frameGeo, doorFrameMat);
        doorGroup.add(frameMesh);
        const panelGeo = new THREE.BoxGeometry(op.width - 60, fullH - 60, 30);
        const panelMesh = new THREE.Mesh(panelGeo, doorPanelMat);
        doorGroup.add(panelMesh);

        // ドアノブ / レバーハンドル
        const handleGeo = new THREE.CylinderGeometry(8, 8, 120, 16);
        const handleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.2 });
        const handleMesh = new THREE.Mesh(handleGeo, handleMat);
        handleMesh.rotation.z = Math.PI / 2;
        handleMesh.position.set(op.width / 2 - 80, 0, 25);
        doorGroup.add(handleMesh);

        doorGroup.position.set(semiOuterPos.x, bottomY + fullH / 2, semiOuterPos.y);
        doorGroup.rotation.y = angle;
        buildingGroup.add(doorGroup);
      }
    }
  });
}

