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

/**
 * 概算見積書 7大枠 ＆ 薄墨（該当外・未選択オプション）データ生成
 * 
 * 7大枠：
 * ① 本体工事
 * ② 基礎工事
 * ③ シャッター・開口部工事
 * ④ コンクリート土間工事
 * ⑤ 電気工事
 * ⑥ ユニック・揚重・運搬費
 * ⑦ 調査・申請費
 */
export const generate7CategoriesEstimate = (quantities, dimensions, openings = []) => {
  const { floorAreaM2 = 25, tsubo = 7.5, totalFoundM = 20, roofRealM2 = 28, totalOpM2 = 8, totalNetWallM2 = 45 } = quantities || {};

  // ① 本体工事 (木造在来軸組 + 外壁・屋根ガルバリウム軒出0)
  const mainStructureCost = Math.round(tsubo * 220000);
  const exteriorRoofCost = Math.round(roofRealM2 * 18000 + totalNetWallM2 * 9000);
  const cat1Total = mainStructureCost + exteriorRoofCost;

  // ② 基礎工事 (外周長×25,000円)
  const cat2Total = Math.round(totalFoundM * 25000);

  // ③ シャッター・開口部工事
  let shutterCost = 0;
  let windowCost = 0;
  let doorCost = 0;
  (openings || []).forEach(op => {
    if (op.type === 'shutter') shutterCost += (op.width > 3500 ? 280000 : 190000);
    else if (op.type === 'door') doorCost += 75000;
    else if (op.type === 'window') windowCost += 42000;
  });
  if (openings.length === 0) {
    shutterCost = 190000; // 標準1台分
  }
  const cat3Total = shutterCost + windowCost + doorCost;

  // ④ コンクリート土間工事 (8,500円/㎡)
  const cat4Total = Math.round(floorAreaM2 * 8500);

  // ⑤ 電気工事 (基本一式)
  const cat5Total = 160000;

  // ⑥ ユニック・揚重・運搬費
  const cat6Total = 120000;

  // ⑦ 調査・申請費 (基本地盤調査・設計製図)
  const cat7Total = 110000;

  const grandTotal = cat1Total + cat2Total + cat3Total + cat4Total + cat5Total + cat6Total + cat7Total;

  const categories = [
    {
      id: 1,
      title: '① 本体工事（木造躯体・外壁屋根ガルバリウム鋼板）',
      selectedCost: cat1Total,
      items: [
        { name: `木造軸組躯体工（土台・柱・梁・母屋・金物一式）`, spec: `${tsubo.toFixed(1)}坪`, cost: mainStructureCost, selected: true },
        { name: `外壁・屋根ガルバリウム鋼板張り（軒出0シャープ仕様）`, spec: `外壁${totalNetWallM2.toFixed(1)}㎡ + 屋根${roofRealM2.toFixed(1)}㎡`, cost: exteriorRoofCost, selected: true },
        { name: `内装OSB合板化粧仕上げ（壁・天井素地現し）`, spec: '室内全面', cost: 240000, selected: false, ghost: true, note: '※DIY施工も可能' },
        { name: `高性能断熱材施工（グラスウール＋透湿気密シート）`, spec: '壁・屋根充填', cost: 360000, selected: false, ghost: true, note: '※エアコン効率向上' }
      ]
    },
    {
      id: 2,
      title: '② 基礎工事（鉄筋コンクリート基礎）',
      selectedCost: cat2Total,
      items: [
        { name: `RC造布基礎工事（根切り・砕石転圧・型枠・配筋・生コン打設）`, spec: `全周 ${totalFoundM.toFixed(1)}m`, cost: cat2Total, selected: true },
        { name: `深基礎・高基礎割増（敷地高低差300mm超の場合）`, spec: '高低差対応', cost: 160000, selected: false, ghost: true, note: '※現地調査後に確定' },
        { name: `柱脚金物補強・独立基礎（柱追加箇所）`, spec: '1箇所あたり', cost: 45000, selected: false, ghost: true, note: '※間取り変更時' }
      ]
    },
    {
      id: 3,
      title: '③ シャッター・開口部工事',
      selectedCost: cat3Total,
      items: [
        { name: `ガレージ用軽量手動シャッター（耐風圧仕様）`, spec: `${(openings.filter(o => o.type === 'shutter').length || 1)}台`, cost: shutterCost, selected: true },
        ...(doorCost > 0 ? [{ name: `アルミ框ドア（片開き・防犯シリンダー鍵付）`, spec: `${openings.filter(o => o.type === 'door').length}箇所`, cost: doorCost, selected: true }] : []),
        ...(windowCost > 0 ? [{ name: `アルミサッシ引き違い窓（型板ガラス・網戸付）`, spec: `${openings.filter(o => o.type === 'window').length}箇所`, cost: windowCost, selected: true }] : []),
        { name: `電動リモコン化オプション（静音開閉・スマホ連動）`, spec: '1台あたり', cost: 180000, selected: false, ghost: true, note: '※車内から雨に濡れず開閉' },
        { name: `オーバースライダー木目調シャッター変更`, spec: '高速開閉タイプ', cost: 380000, selected: false, ghost: true, note: '※プレミアム外観' },
        { name: `高断熱ペアガラス窓（アルゴンガス入・防犯合わせ）`, spec: '1窓あたり', cost: 48000, selected: false, ghost: true, note: '※結露防止' }
      ]
    },
    {
      id: 4,
      title: '④ コンクリート土間工事',
      selectedCost: cat4Total,
      items: [
        { name: `床土間コンクリート打設（厚120mm・ワイヤーメッシュ・金ゴテ仕上）`, spec: `${floorAreaM2.toFixed(1)}㎡ (${tsubo.toFixed(1)}坪)`, cost: cat4Total, selected: true },
        { name: `ガレージ床専用 高耐久防塵塗装（エポキシクリア仕上）`, spec: 'オイル・タイヤ痕防止', cost: 98000, selected: false, ghost: true, note: '※ショールーム風光沢' },
        { name: `乗り入れ段差解消コンクリートスロープ打設`, spec: '前面道路接続', cost: 65000, selected: false, ghost: true, note: '※段差に応じて調整' }
      ]
    },
    {
      id: 5,
      title: '⑤ 電気設備工事',
      selectedCost: cat5Total,
      items: [
        { name: `基本電気配線工事（分電盤・LED照明器具・2口コンセント・スイッチ）`, spec: '基本一式', cost: cat5Total, selected: true },
        { name: `EV（電気自動車）専用 200V充電コンセント設置`, spec: '屋外防雨型', cost: 48000, selected: false, ghost: true, note: '※EV・PHEV対応' },
        { name: `人感センサー連動 外部防犯スポットライトLED`, spec: '夜間自動点灯', cost: 28000, selected: false, ghost: true, note: '※防犯・夜間視認性' },
        { name: `動力200V増設・エアコン専用先行配管回路`, spec: '200V回路', cost: 55000, selected: false, ghost: true, note: '※工房・エアコン用' }
      ]
    },
    {
      id: 6,
      title: '⑥ ユニック・揚重・運搬費',
      selectedCost: cat6Total,
      items: [
        { name: `構造プレカット材・外壁長尺ガルバリウム運搬費 ＆ クレーン揚重代`, spec: '建方揚重一式', cost: cat6Total, selected: true },
        { name: `狭小地・4t進入困難路 小運搬割増（2t車小分け・手運び）`, spec: '進入路特殊対応', cost: 68000, selected: false, ghost: true, note: '※進入路4m未満の場合' }
      ]
    },
    {
      id: 7,
      title: '⑦ 調査・申請費',
      selectedCost: cat7Total,
      items: [
        { name: `現地地盤調査（スウェーデン式サウンディング試験）＆ 製図作成`, spec: '調査一式', cost: cat7Total, selected: true },
        { name: `建築確認申請 代行手数料（10㎡超・用途地域確認・完了検査）`, spec: '行政申請代行', cost: 260000, selected: false, ghost: true, note: '※都市計画区域等で必須' },
        { name: `防火・準防火地域 延焼ライン耐火建築確認図書作成`, spec: '防火仕様設計', cost: 120000, selected: false, ghost: true, note: '※指定地域の場合のみ' }
      ]
    }
  ];

  return {
    grandTotal,
    categories
  };
};

