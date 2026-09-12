/**
 * 建築幾何計算・構造数学モジュール
 * 【単一責任の原則 (SRP): 建築寸法・頂点座標・オフセット・角度・勾配高さの計算責務】
 */
import * as THREE from 'three';

/**
 * 4頂点の柱芯座標 (Vector2) を算出
 * p0: 正面左, p1: 正面右, p2: 背面右, p3: 背面左
 */
export const getCorePoints = (wF, wB, dL, dR, shapeType = 'regular', skewOffset = 0) => {
  const p0 = new THREE.Vector2(-wF / 2, 0);
  const p1 = new THREE.Vector2(wF / 2, 0);

  let p2, p3;
  if (shapeType === 'trapezoid_right_angle_left') {
    // 左直角台形: 左壁が正面に対して直角 (90°垂直)
    p3 = new THREE.Vector2(-wF / 2, -dL);
    p2 = new THREE.Vector2(-wF / 2 + wB, -dR);
  } else if (shapeType === 'trapezoid_right_angle_right') {
    // 右直角台形: 右壁が正面に対して直角 (90°垂直)
    p2 = new THREE.Vector2(wF / 2, -dR);
    p3 = new THREE.Vector2(wF / 2 - wB, -dL);
  } else if (shapeType === 'trapezoid_free') {
    // 自由偏芯台形: 背面中心が skewOffset だけ左右にシフト
    p2 = new THREE.Vector2(skewOffset + wB / 2, -dR);
    p3 = new THREE.Vector2(skewOffset - wB / 2, -dL);
  } else {
    // regular / 等脚台形
    const backOffset = (wF - wB) / 2;
    p2 = new THREE.Vector2(wF / 2 - backOffset, -dR);
    p3 = new THREE.Vector2(-wF / 2 + backOffset, -dL);
  }

  return [p0, p1, p2, p3];
};

/**
 * 任意多角形の平行オフセット交点群を算出 (外壁面・内壁面)
 */
export const getOffsetPoints = (corePts, offset) => {
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
    if (Math.abs(det) < 1e-6) {
      out.push(corePts[i].clone());
    } else {
      const dp = new THREE.Vector2().subVectors(l2.p, l1.p);
      const t = (dp.x * l2.v.y - dp.y * l2.v.x) / det;
      out.push(new THREE.Vector2(l1.p.x + t * l1.v.x, l1.p.y + t * l1.v.y));
    }
  }
  return out;
};

/**
 * 正面壁に対する左右壁の開き角度（内角）を算出
 */
export const calculateAngles = (corePts) => {
  if (!corePts || corePts.length < 4) return { angleLeft: 90, angleRight: 90 };
  const [p0, p1, p2, p3] = corePts;
  
  // 左壁: p0からp3へのベクトル (正面に対する開き角度)
  const dxLeft = p0.x - p3.x; // p3が左に張り出すと正
  const dyLeft = -(p3.y - p0.y);
  const angleLeft = dyLeft > 0 ? Math.round((90 + Math.atan2(dxLeft, dyLeft) * 180 / Math.PI) * 10) / 10 : 90;

  // 右壁: p1からp2へのベクトル (正面に対する開き角度)
  const dxRight = p2.x - p1.x; // p2が右に張り出すと正
  const dyRight = -(p2.y - p1.y);
  const angleRight = dyRight > 0 ? Math.round((90 + Math.atan2(dxRight, dyRight) * 180 / Math.PI) * 10) / 10 : 90;

  return { angleLeft, angleRight };
};

/**
 * 水流し勾配における任意平面座標の桁高（軒高）を算出
 */
export const getGirderHeight = (point, bounds, baseEaveH, slopeVal, dir) => {
  const slopeRatio = slopeVal / 10.0;
  let distFromLow = 0;
  if (dir === 'front-to-back') distFromLow = point.y - bounds.minY;
  else if (dir === 'back-to-front') distFromLow = bounds.maxY - point.y;
  else if (dir === 'left-to-right') distFromLow = bounds.maxX - point.x;
  else if (dir === 'right-to-left') distFromLow = point.x - bounds.minX;
  return baseEaveH + distFromLow * slopeRatio;
};

/**
 * 指定壁面の柱芯長さを取得
 */
export const getWallSpan = (wallKey, dimensions) => {
  if (wallKey === 'front') return dimensions.wFront;
  if (wallKey === 'back') return dimensions.wBack;
  if (wallKey === 'left') return dimensions.dLeft;
  if (wallKey === 'right') return dimensions.dRight;
  return 5400;
};
