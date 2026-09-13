/**
 * 2Dベクトル製図エンジン (SVG Drawing Engine)
 * 
 * 【単一責任の原則 (SRP)】
 * - 平面図・正立面図・裏立面図・左側立面図・右側立面図のSVGベクター製図
 * - 建築図面基準の寸法線（引出線・矢印/ティック・数値ラベル背景付き）生成
 * - 設計GL地盤線、基礎コンクリート（床付け開口部連動切り欠き）、柱芯線（赤一点鎖線）、屋根スラブ、建具開口部、車両フットプリントの描画
 */

import * as THREE from 'three';
import { WALL_OUTER_OFFSET, isFloorLevelOpening } from '../constants';
import { getCorePoints, getOffsetPoints, getGirderHeight } from '../geometry/buildingGeometry';

/**
 * 2D寸法線のSVG要素文字列を生成
 * @param {Array<string>} elements SVG要素文字列配列
 * @param {number} x1 始点X
 * @param {number} y1 始点Y
 * @param {number} x2 終点X
 * @param {number} y2 終点Y
 * @param {string} text ラベル文字列
 * @param {number} offset オフセット量
 * @param {boolean} isVertical 垂直寸法かどうか
 * @param {number} baseFontSize 基本フォントサイズ
 * @param {number} tickLen ティック長
 */
export function drawDim2D(elements, x1, y1, x2, y2, text, offset, isVertical = false, baseFontSize = 135, tickLen = 40) {
  const nx = isVertical ? offset : 0;
  const ny = isVertical ? 0 : offset;
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

  let tx = midX;
  let ty = midY;
  if (isVertical) tx = sx + (offset > 0 ? (bgW / 2 + 35) : -(bgW / 2 + 35));
  else ty = sy + (offset > 0 ? (bgH / 2 + 35) : -(bgH / 2 + 35));

  elements.push(`<rect x="${tx - bgW / 2}" y="${ty - bgH / 2}" width="${bgW}" height="${bgH}" fill="rgba(255, 255, 255, 0.96)" stroke="#0284c7" stroke-width="3" rx="10"/>`);
  elements.push(`<text x="${tx}" y="${ty}" fill="#0f172a" font-size="${baseFontSize}" font-weight="bold" text-anchor="middle" dominant-baseline="central">${text}</text>`);
}

/**
 * 2D図面のSVGデータ（viewBoxとinnerHTML）を生成する純粋関数
 */
export function generateSvgDrawingData({
  currentView,
  dimensions,
  openings = [],
  vehicles = [],
  dimFontScale = 1.0
}) {
  const {
    wFront: wF,
    wBack: wB,
    dLeft: dL,
    dRight: dR,
    eaveHeight: eaveH,
    foundationHeight: foundationH,
    roofSlope: slope,
    slopeDirection: slopeDir,
    shapeType,
    skewOffset
  } = dimensions;

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

  const helperDrawDim = (x1, y1, x2, y2, text, offset, isVertical = false) => {
    drawDim2D(elements, x1, y1, x2, y2, text, offset, isVertical, baseFontSize, tickLen);
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
          <rect x="${-vW / 2}" y="${-vL / 2}" width="${vW}" height="${vL}" rx="60" fill="rgba(30, 41, 59, 0.15)" stroke="#0f172a" stroke-width="4"/>
          <polygon points="0,${-vL / 2 + 80} -50,${-vL / 2 + 200} 50,${-vL / 2 + 200}" fill="#0f172a"/>
          <text x="0" y="20" font-size="100" font-weight="bold" fill="#0f172a" text-anchor="middle">${label}</text>
        </g>
      `);
    });

    const offFront = Math.max(650, baseFontSize * 4.0);
    const offSide = Math.max(750, baseFontSize * 4.5);

    helperDrawDim(sc0.x, sc0.y, sc1.x, sc1.y, `正面 柱芯: ${wF}mm`, offFront);
    helperDrawDim(sc1.x, sc1.y, sc2.x, sc2.y, `右奥行 柱芯: ${dR}mm`, offSide, true);
    helperDrawDim(sc3.x, sc3.y, sc2.x, sc2.y, `背面 柱芯: ${wB}mm`, -offFront);
    helperDrawDim(sc0.x, sc0.y, sc3.x, sc3.y, `左奥行 柱芯: ${dL}mm`, -offSide, true);

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
      floorOps.sort((a, b) => a.clearanceLeft - b.clearanceLeft).forEach(fOp => {
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

      if (op.type === 'shutter') {
        elements.push(`<rect x="${opLeftX}" y="${opTopY}" width="${opW}" height="${opH}" fill="#334155" stroke="#1e293b" stroke-width="4"/>`);
        // 等間隔の細いグレーの横線（スラット線 5〜10本）
        const numLines = Math.max(6, Math.min(10, Math.round(opH / 240)));
        const stepY = opH / (numLines + 1);
        for (let i = 0; i < numLines; i++) {
          const lineY = opTopY + stepY * (i + 1);
          elements.push(`<line x1="${opLeftX + 4}" y1="${lineY}" x2="${opLeftX + opW - 4}" y2="${lineY}" stroke="#64748b" stroke-width="2"/>`);
        }
        elements.push(`<text x="${opLeftX + opW / 2}" y="${opTopY + opH / 2}" fill="#fff" font-size="${baseFontSize * 0.85}" font-weight="bold" text-anchor="middle" dominant-baseline="central" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">シャッター ${op.width}×${op.height}</text>`);
      } else if (op.type === 'window') {
        // 引き違い窓: 外枠＋ガラス＋中央召し合わせ框
        elements.push(`<rect x="${opLeftX}" y="${opTopY}" width="${opW}" height="${opH}" fill="#1e293b" stroke="#0f172a" stroke-width="4"/>`);
        elements.push(`<rect x="${opLeftX + 25}" y="${opTopY + 25}" width="${opW - 50}" height="${opH - 50}" fill="#bae6fd" stroke="#38bdf8" stroke-width="2"/>`);
        elements.push(`<line x1="${opLeftX + opW / 2}" y1="${opTopY + 25}" x2="${opLeftX + opW / 2}" y2="${opTopY + opH - 25}" stroke="#1e293b" stroke-width="8"/>`);
        elements.push(`<text x="${opLeftX + opW / 2}" y="${opTopY + opH / 2}" fill="#0f172a" font-size="${baseFontSize * 0.75}" font-weight="bold" text-anchor="middle" dominant-baseline="central">${op.width}×${op.height}</text>`);
      } else {
        const fillC = (op.type === 'door' || op.type === 'sliding_door') ? '#475569' : '#38bdf8';
        elements.push(`<rect x="${opLeftX}" y="${opTopY}" width="${opW}" height="${opH}" fill="${fillC}" stroke="#1e293b" stroke-width="4"/>`);
        elements.push(`<text x="${opLeftX + opW / 2}" y="${opTopY + opH / 2}" fill="#fff" font-size="${baseFontSize * 0.85}" font-weight="bold" text-anchor="middle" dominant-baseline="central">${op.width}×${op.height}</text>`);
      }
    });


    // 寸法線
    const offH1 = Math.max(500, baseFontSize * 3.8);
    const offH2 = offH1 + Math.max(450, baseFontSize * 3.2);
    helperDrawDim(coreX1, baseGL_Y, coreX2, baseGL_Y, `柱芯間口: ${wSpan}mm`, offH1);
    helperDrawDim(outerX1, baseGL_Y, outerX2, baseGL_Y, `仕上全幅: ${totalW}mm`, offH2);
    helperDrawDim(outerX1, baseGL_Y, coreX1, baseGL_Y, `${WALL_OUTER_OFFSET}`, 220);
    helperDrawDim(coreX2, baseGL_Y, outerX2, baseGL_Y, `${WALL_OUTER_OFFSET}`, 220);

    const offV1 = Math.max(550, baseFontSize * 4.2);
    const offV2 = offV1 + Math.max(550, baseFontSize * 4.2);
    helperDrawDim(outerX1, baseGL_Y, outerX1, fFoundY, `基礎高: ${foundationH}mm`, -offV1, true);
    helperDrawDim(outerX1, baseGL_Y, outerX1, fGirdY1, `左軒高: ${Math.round(hL)}mm`, -offV2, true);
    helperDrawDim(outerX2, baseGL_Y, outerX2, fGirdY2, `右軒高: ${Math.round(hR)}mm`, offV1, true);

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
      floorOps.sort((a, b) => a.clearanceLeft - b.clearanceLeft).forEach(fOp => {
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

      if (op.type === 'shutter') {
        elements.push(`<rect x="${opLeftX}" y="${opTopY}" width="${opW}" height="${opH}" fill="#334155" stroke="#1e293b" stroke-width="4"/>`);
        elements.push(`<text x="${opLeftX + opW / 2}" y="${opTopY + opH / 2}" fill="#fff" font-size="${baseFontSize * 0.85}" font-weight="bold" text-anchor="middle" dominant-baseline="central">シャッター ${op.width}×${op.height}</text>`);
      } else if (op.type === 'window') {
        // 引き違い窓: 外枠＋ガラス＋中央召し合わせ框
        elements.push(`<rect x="${opLeftX}" y="${opTopY}" width="${opW}" height="${opH}" fill="#1e293b" stroke="#0f172a" stroke-width="4"/>`);
        elements.push(`<rect x="${opLeftX + 25}" y="${opTopY + 25}" width="${opW - 50}" height="${opH - 50}" fill="#bae6fd" stroke="#38bdf8" stroke-width="2"/>`);
        elements.push(`<line x1="${opLeftX + opW / 2}" y1="${opTopY + 25}" x2="${opLeftX + opW / 2}" y2="${opTopY + opH - 25}" stroke="#1e293b" stroke-width="8"/>`);
        elements.push(`<text x="${opLeftX + opW / 2}" y="${opTopY + opH / 2}" fill="#0f172a" font-size="${baseFontSize * 0.75}" font-weight="bold" text-anchor="middle" dominant-baseline="central">${op.width}×${op.height}</text>`);
      } else {
        const fillC = (op.type === 'door' || op.type === 'sliding_door') ? '#475569' : '#38bdf8';
        elements.push(`<rect x="${opLeftX}" y="${opTopY}" width="${opW}" height="${opH}" fill="${fillC}" stroke="#1e293b" stroke-width="4"/>`);
        elements.push(`<text x="${opLeftX + opW / 2}" y="${opTopY + opH / 2}" fill="#fff" font-size="${baseFontSize * 0.85}" font-weight="bold" text-anchor="middle" dominant-baseline="central">${op.width}×${op.height}</text>`);
      }
    });


    // 寸法線
    const offH1 = Math.max(500, baseFontSize * 3.8);
    const offH2 = offH1 + Math.max(450, baseFontSize * 3.2);
    helperDrawDim(coreX1, baseGL_Y, coreX2, baseGL_Y, `柱芯奥行: ${dSide}mm`, offH1);
    helperDrawDim(outerX1, baseGL_Y, outerX2, baseGL_Y, `仕上全奥行: ${totalD}mm`, offH2);
    helperDrawDim(outerX1, baseGL_Y, coreX1, baseGL_Y, `${WALL_OUTER_OFFSET}`, 220);
    helperDrawDim(coreX2, baseGL_Y, outerX2, baseGL_Y, `${WALL_OUTER_OFFSET}`, 220);

    const offV1 = Math.max(550, baseFontSize * 4.2);
    const offV2 = offV1 + Math.max(550, baseFontSize * 4.2);
    helperDrawDim(outerX1, baseGL_Y, outerX1, sFoundY, `基礎高: ${foundationH}mm`, -offV1, true);
    helperDrawDim(outerX1, baseGL_Y, outerX1, sGirdY1, `手前軒高: ${Math.round(hA)}mm`, -offV2, true);
    helperDrawDim(outerX2, baseGL_Y, outerX2, sGirdY2, `奥側軒高: ${Math.round(hB)}mm`, offV1, true);

    const titleY = Math.min(sRoofY1, sRoofY2) - 500;
    elements.push(`<text x="0" y="${titleY}" font-size="${baseFontSize * 1.3}" font-weight="bold" fill="#0f172a" text-anchor="middle">${isLeft ? '左側立面図' : '右側立面図'} (勾配: ${slope}寸 / ふかし各100mm)</text>`);

    vbMinX = outerX1 - offV2 - 1400;
    vbW = totalD + offV2 * 2 + 2800;
    vbMinY = titleY - 300;
    vbH = baseGL_Y + offH2 + 1000 - vbMinY;
  }

  return {
    viewBox: `${vbMinX} ${vbMinY} ${vbW} ${vbH}`,
    innerHtml: elements.join('\n')
  };
}

/**
 * 指定されたSVG DOM要素へ2D製図を反映する関数
 */
export function renderSvgDrawings({
  svgElement,
  currentView,
  dimensions,
  openings = [],
  vehicles = [],
  dimFontScale = 1.0
}) {
  if (!svgElement) return;
  svgElement.innerHTML = '';
  const { viewBox, innerHtml } = generateSvgDrawingData({
    currentView,
    dimensions,
    openings,
    vehicles,
    dimFontScale
  });
  svgElement.setAttribute('viewBox', viewBox);
  svgElement.innerHTML = innerHtml;
}
