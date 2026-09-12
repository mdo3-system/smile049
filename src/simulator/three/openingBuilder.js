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
 * 引き違い窓メッシュ生成
 */
export function createSlidingWindowMesh(width, height) {
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
}

/**
 * Fix窓メッシュ生成
 */
export function createFixWindowMesh(width, height) {
  const group = new THREE.Group();
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.5 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.65 });

  group.add(new THREE.Mesh(new THREE.BoxGeometry(width, height, 60), frameMat));
  group.add(new THREE.Mesh(new THREE.BoxGeometry(width - 60, height - 60, 20), glassMat));
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
        if (edgeLineMat) {
          doorMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(doorGeo), edgeLineMat));
        }
        buildingGroup.add(doorMesh);
      }
    }
  });
}
