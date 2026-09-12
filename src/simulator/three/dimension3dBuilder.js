/**
 * 3D寸法線・スプライトビルダー (3D Dimension Builder)
 * 
 * 【単一責任の原則 (SRP)】
 * - 3D空間における寸法線（主線・引き出し線・両端刻みティック線）の生成
 * - 高解像度Canvasテクスチャによる文字スプライト（角丸バッジ、枠線、文字）の生成
 * - 建物の柱芯間口・奥行・軒高・最高高・基礎高の3D寸法アノテーション配置
 */

import * as THREE from 'three';

/**
 * テキストスプライト生成
 */
export function makeTextSprite(message, scaleFactor = 1.0) {
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
}

/**
 * 1本の3D寸法線セグメント（主線・引き出し線・ティック・文字スプライト）を生成してグループに追加
 */
export function addDimensionSegment({
  dimGroup,
  pA,
  pB,
  labelText,
  offsetVec,
  scaleFactor = 1.0
}) {
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
}

/**
 * 建物の3D全寸法線アノテーションを構築
 */
export function buildDimensions3D({
  dimGroup,
  dimensions,
  corePts,
  outerPts,
  hPts,
  roofThickness,
  dim3dFontScale = 1.0
}) {
  if (!dimGroup) return;

  const { wFront: wF, wBack: wB, dLeft: dL, dRight: dR, eaveHeight: eaveH, foundationHeight: foundationH } = dimensions;

  // 正面間口
  const pFrontL = new THREE.Vector3(corePts[0].x, 20, corePts[0].y);
  const pFrontR = new THREE.Vector3(corePts[1].x, 20, corePts[1].y);
  addDimensionSegment({
    dimGroup,
    pA: pFrontL,
    pB: pFrontR,
    labelText: `正面芯: ${wF}mm (外寸:${wF + 200})`,
    offsetVec: new THREE.Vector3(0, 0, 700),
    scaleFactor: dim3dFontScale
  });

  // 左奥行
  const pLeftB = new THREE.Vector3(corePts[3].x, 20, corePts[3].y);
  addDimensionSegment({
    dimGroup,
    pA: pLeftB,
    pB: pFrontL,
    labelText: `左奥行芯: ${dL}mm`,
    offsetVec: new THREE.Vector3(-700, 0, 0),
    scaleFactor: dim3dFontScale
  });

  // 右奥行
  const pRightB = new THREE.Vector3(corePts[2].x, 20, corePts[2].y);
  addDimensionSegment({
    dimGroup,
    pA: pFrontR,
    pB: pRightB,
    labelText: `右奥行芯: ${dR}mm`,
    offsetVec: new THREE.Vector3(700, 0, 0),
    scaleFactor: dim3dFontScale
  });

  // 背面間口
  addDimensionSegment({
    dimGroup,
    pA: pLeftB,
    pB: pRightB,
    labelText: `背面芯: ${wB}mm`,
    offsetVec: new THREE.Vector3(0, 0, -700),
    scaleFactor: dim3dFontScale
  });

  // 高さ関連寸法
  const minH = Math.min(...hPts);
  const minIdx = hPts.indexOf(minH);
  const pMin = outerPts[minIdx];

  const maxH = Math.max(...hPts);
  const maxIdx = hPts.indexOf(maxH);
  const pMax = outerPts[maxIdx];

  const offsetLow = new THREE.Vector3(-1200, 0, 0);
  const pGL = new THREE.Vector3(pMin.x, 0, pMin.y);
  const pFound = new THREE.Vector3(pMin.x, foundationH, pMin.y);
  addDimensionSegment({
    dimGroup,
    pA: pGL,
    pB: pFound,
    labelText: `基礎高: ${foundationH}mm`,
    offsetVec: offsetLow,
    scaleFactor: dim3dFontScale
  });

  const pGirderLow = new THREE.Vector3(pMin.x, minH, pMin.y);
  addDimensionSegment({
    dimGroup,
    pA: pGL,
    pB: pGirderLow,
    labelText: `軒高: ${eaveH}mm`,
    offsetVec: new THREE.Vector3(-2200, 0, 0),
    scaleFactor: dim3dFontScale
  });

  const pRoofLowTop = new THREE.Vector3(pMin.x, minH + roofThickness, pMin.y);
  addDimensionSegment({
    dimGroup,
    pA: pGirderLow,
    pB: pRoofLowTop,
    labelText: `屋根厚: ${roofThickness}mm`,
    offsetVec: offsetLow,
    scaleFactor: dim3dFontScale
  });

  const maxHeightVal = Math.round(maxH + roofThickness);
  const pGLHigh = new THREE.Vector3(pMax.x, 0, pMax.y);
  const pRoofHighTop = new THREE.Vector3(pMax.x, maxHeightVal, pMax.y);
  addDimensionSegment({
    dimGroup,
    pA: pGLHigh,
    pB: pRoofHighTop,
    labelText: `最高高: ${maxHeightVal}mm`,
    offsetVec: new THREE.Vector3(1400, 0, 0),
    scaleFactor: dim3dFontScale
  });
}
