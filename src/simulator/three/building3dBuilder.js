/**
 * 3D躯体・建築構造ビルダー (Building 3D Builder)
 * 
 * 【単一責任の原則 (SRP)】
 * - 内部土間コンクリートスラブの生成
 * - 基礎立ち上がり（床付け開口部連動の切り欠き納まり）の生成
 * - 外壁ポリゴンメッシュ（開口部くり抜き、腰壁、垂れ壁、シャッター内付け2段抱き面）の生成
 * - 屋根スラブ（面一接合、破風、外壁完全連動）の生成
 * - 天井（フラット / 勾配）の生成
 */

import * as THREE from 'three';
import { WALL_OUTER_OFFSET, isFloorLevelOpening } from '../constants';

/**
 * 4頂点から四角形ポリゴンメッシュ（および輪郭エッジ線）を生成
 */
export function createQuadMesh(p1, p2, p3, p4, mat) {
  const geo = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    p1.x, p1.y, p1.z,  p2.x, p2.y, p2.z,  p3.x, p3.y, p3.z,
    p1.x, p1.y, p1.z,  p3.x, p3.y, p3.z,  p4.x, p4.y, p4.z
  ]);
  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(geo),
    new THREE.LineBasicMaterial({ color: 0x1e293b })
  ));
  return mesh;
}

/**
 * ガレージ・倉庫の3D躯体構造（土間・基礎・外壁・屋根・天井）を生成してグループに配置
 */
export function buildStructure3D({
  buildingGroup,
  dimensions,
  corePts,
  outerPts,
  innerPts,
  hPts,
  hInnerPts,
  roofThickness,
  openings = [],
  materials
}) {
  if (!buildingGroup || !materials) return;

  const { foundationHeight: foundationH, eaveHeight: eaveH, ceilingType } = dimensions;
  const { slabMat, foundationMat, wallMat, roofMat, ceilingMat, edgeLineMat } = materials;

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
}
