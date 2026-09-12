/**
 * 建築積算・数量計算・概算見積もりモジュール
 * 【単一責任の原則 (SRP): 建築数量算出および概算工事費用の計算責務】
 */

/**
 * 柱芯座標、外壁座標、軒高、開口部リストから各種建築数量と概算費用を算出
 */
export const calculateBuildingQuantities = (corePts, outerPts, hPts, dimensions, openings) => {
  const { wFront: wF, wBack: wB, dLeft: dL, dRight: dR, roofSlope: slopeVal, foundationHeight: foundationH } = dimensions;

  // 1. 床面積 (グリーンの定理によるポリゴン面積)
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
    const hAM = (hA - foundationH) / 1000;
    const hBM = (hB - foundationH) / 1000;
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

  return {
    floorFormula,
    floorVal,
    floorAreaM2,
    tsubo,
    foundFormula,
    foundVal,
    totalFoundM,
    roofFormula,
    roofVal,
    roofRealM2,
    openingsFormula,
    openingsVal,
    totalOpM2,
    wallsFormula,
    wallsVal,
    totalNetWallM2,
    approxCost
  };
};
