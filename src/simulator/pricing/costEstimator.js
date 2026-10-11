/**
 * 建築積算・数量計算・精密原価/見積もりモジュール (costEstimator.js)
 * 
 * ユーザー指定積算基準（原価 × 1.33 = 見積額）に基づく精密積算エンジン
 * 
 * 【工事区分】
 * A. 本体工事（必ずかかるもの）
 *   ① 木工事 (17㎡:42万, 36㎡:62万按分)
 *   ② 開口部・サッシ工事 (三和シャッター & LIXILカタログ定価マスタ)
 *   ③ 屋根工事 (19㎡:18万, 38㎡:37万按分)
 *   ④ 外壁工事 (68㎡:45万, 149㎡:78万按分)
 *   ⑤ 基礎工事 (@1.2万円/m)
 *   ⑥ 建材工事 (17㎡:6万, 36㎡:17万按分)
 *   ⑦ 申請手続き費用 (確認申請図書作成・提出代行)
 * 
 * B. 付帯工事・追加工事（現地調査・ヒアリングで確定する別途費用）
 *   ・解体工事・整地工事
 *   ・電気工事
 *   ・空調工事
 *   ・土間打設工事
 *   ・給排水衛生設備工事
 *   ・地盤調査費用
 *   ・測量・行政調査費用
 */

// 乗率定数 (原価 × 1.33 ＝ 見積額、粗利率約24.8%)
export const MARKUP_RATE = 1.33;

/**
 * 柱芯座標、外壁座標、軒高、開口部リストから建築数量と精密費用を算出
 */
export const calculateBuildingQuantities = (corePts, outerPts, hPts, dimensions, openings = []) => {
  const { wFront: wF, wBack: wB, dLeft: dL, dRight: dR, roofSlope: slopeVal, foundationHeight: foundationH } = dimensions;

  // 1. 床面積 (グリーンの定理によるポリゴン面積)
  let floorMm2 = 0;
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    floorMm2 += corePts[i].x * corePts[j].y - corePts[j].x * corePts[i].y;
  }
  const floorAreaM2 = Math.abs(floorMm2) / 2 / 1000000;
  const tsubo = floorAreaM2 * 0.3025;
  const floorFormula = `[(間口平均 ${((wF + wB) / 2).toFixed(0)}mm) × (奥行平均 ${((dL + dR) / 2).toFixed(0)}mm)]`;
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

  // 精密積算（本体工事原価 × 1.33）
  const estimate = generate7CategoriesEstimate({
    floorAreaM2,
    tsubo,
    totalFoundM,
    roofRealM2,
    totalOpM2,
    totalNetWallM2
  }, dimensions, openings);

  const approxCost = estimate.mainWorksTotalPrice; // 本体工事見積合計（税抜）

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
    approxCost,
    detailedEstimate: estimate
  };
};

/**
 * ユーザー指定原価基準による本体工事7項目 ＆ 付帯工事（別途費用）生成
 */
export const generate7CategoriesEstimate = (quantities, dimensions, openings = []) => {
  const { 
    floorAreaM2 = 20, 
    totalFoundM = 18, 
    roofRealM2 = 24, 
    totalNetWallM2 = 48 
  } = quantities || {};

  // =========================================================================
  // 【A. 本体工事 原価計算 (Cost)】
  // =========================================================================

  // ① 木工事：17㎡で42万円、36㎡で62万円の按分
  // 傾き = 200,000 / 19 ≒ 10,526円/㎡
  const woodSlope = (620000 - 420000) / (36 - 17);
  const costWood = Math.max(260000, Math.round(420000 + (floorAreaM2 - 17) * woodSlope));

  // ② 開口部・サッシ工事 (三和シャッター & LIXILカタログ定価マスタ)
  let costOpenings = 0;
  let catalogList = [];
  
  const shutterOps = openings.filter(o => o.type === 'shutter');
  const doorOps = openings.filter(o => o.type === 'door');
  const windowOps = openings.filter(o => o.type === 'window');

  // シャッター（三和シャッターカタログ定価準拠、原価掛率0.55）
  if (shutterOps.length === 0) {
    // 標準1台
    const listPrice = 260000;
    const cost = Math.round(listPrice * 0.55); // 143,000円
    costOpenings += cost;
    catalogList.push({
      maker: '三和シャッター',
      product: 'ガレージ用軽量手動シャッター（W2.7m×H2.4m耐風圧仕様）',
      listPrice,
      cost,
      qty: 1
    });
  } else {
    shutterOps.forEach((op, idx) => {
      let listPrice = 260000;
      let name = '軽量手動シャッター（W2.7m×H2.4m）';
      if (op.width > 3500) {
        listPrice = 420000;
        name = `ワイド手動シャッター（W${(op.width/1000).toFixed(1)}m特注）`;
      } else if (op.width > 2800) {
        listPrice = 330000;
        name = `中型手動シャッター（W${(op.width/1000).toFixed(1)}m）`;
      }
      const cost = Math.round(listPrice * 0.55);
      costOpenings += cost;
      catalogList.push({
        maker: '三和シャッター',
        product: `${name}`,
        listPrice,
        cost,
        qty: 1
      });
    });
  }

  // ドア（LIXIL ロンカラーガラスドア/框ドア、定価92,000円、原価掛率0.50）
  doorOps.forEach((op) => {
    const listPrice = 92000;
    const cost = Math.round(listPrice * 0.50); // 46,000円
    costOpenings += cost;
    catalogList.push({
      maker: 'LIXIL',
      product: 'アルミ框ドア ロンカラーガラスドア（片開き・防犯シリンダー）',
      listPrice,
      cost,
      qty: 1
    });
  });

  // 窓（LIXIL アトモスII/デュオPG 引違い窓、定価58,000円、原価掛率0.50）
  windowOps.forEach((op) => {
    let listPrice = 58000;
    let name = 'アルミサッシ 引違い窓 2枚建（W1.6m×H0.9m・網戸付）';
    if (op.width <= 900) {
      listPrice = 38000;
      name = '小窓アルミサッシ（W0.7m×H0.7m・網戸付）';
    } else if (op.height >= 1700) {
      listPrice = 86000;
      name = '掃き出しテラス窓（W1.6m×H1.8m）';
    }
    const cost = Math.round(listPrice * 0.50);
    costOpenings += cost;
    catalogList.push({
      maker: 'LIXIL',
      product: name,
      listPrice,
      cost,
      qty: 1
    });
  });

  // ③ 屋根工事：19㎡で18万円、38㎡で37万円の按分
  // 傾き = 190,000 / 19 = 10,000円/㎡
  const costRoof = Math.max(120000, Math.round(180000 + (roofRealM2 - 19) * 10000));

  // ④ 外壁工事：68㎡で45万円、149㎡で78万円（按分傾き約4,074円/㎡）
  const wallSlope = (780000 - 450000) / (149 - 68);
  const costWall = Math.max(280000, Math.round(450000 + (totalNetWallM2 - 68) * wallSlope));

  // ⑤ 基礎工事：＠1.2万円/ｍ
  const costFoundation = Math.max(120000, Math.round(totalFoundM * 12000));

  // ⑥ 建材工事：17㎡で6万円、36㎡で17万円の按分
  // 傾き = 110,000 / 19 ≒ 5,789円/㎡
  const materialSlope = (170000 - 60000) / (36 - 17);
  const costBuildingMaterial = Math.max(40000, Math.round(60000 + (floorAreaM2 - 17) * materialSlope));

  // ⑦ 申請手続き費用 (建築確認申請図書作成・行政提出代行)
  const costPermit = 180000;

  // =========================================================================
  // 【A. 本体工事 見積額計算 (Price = 原価 × 1.33)】
  // =========================================================================
  const priceWood = Math.round(costWood * MARKUP_RATE);
  const priceOpenings = Math.round(costOpenings * MARKUP_RATE);
  const priceRoof = Math.round(costRoof * MARKUP_RATE);
  const priceWall = Math.round(costWall * MARKUP_RATE);
  const priceFoundation = Math.round(costFoundation * MARKUP_RATE);
  const priceBuildingMaterial = Math.round(costBuildingMaterial * MARKUP_RATE);
  const pricePermit = Math.round(costPermit * MARKUP_RATE);

  // 原価合計 & 見積合計
  const mainWorksTotalCost = costWood + costOpenings + costRoof + costWall + costFoundation + costBuildingMaterial + costPermit;
  const mainWorksTotalPrice = priceWood + priceOpenings + priceRoof + priceWall + priceFoundation + priceBuildingMaterial + pricePermit;
  const profitAmount = mainWorksTotalPrice - mainWorksTotalCost;
  const profitRate = ((profitAmount / mainWorksTotalPrice) * 100).toFixed(1);

  // 本体工事7大項目データ
  const mainWorksItems = [
    {
      id: 1,
      num: '①',
      name: '木工事',
      spec: `床面積 ${floorAreaM2.toFixed(1)}㎡ (土台・柱・梁・筋交い・構造金物一式)`,
      calcBasis: '床面積按分（17㎡:42万 / 36㎡:62万基準）',
      cost: costWood,
      price: priceWood,
      isCore: true
    },
    {
      id: 2,
      num: '②',
      name: '開口部・サッシ工事',
      spec: `三和シャッター${shutterOps.length || 1}台 ＋ LIXIL建具${doorOps.length + windowOps.length}箇所`,
      calcBasis: 'LIXIL＆三和シャッター公式カタログ定価マスタ連動',
      cost: costOpenings,
      price: priceOpenings,
      catalogList,
      isCore: true
    },
    {
      id: 3,
      num: '③',
      name: '屋根工事',
      spec: `屋根実面積 ${roofRealM2.toFixed(1)}㎡ (ガルバリウム鋼板立平葺き・防水ルーフィング)`,
      calcBasis: '屋根実面積按分（19㎡:18万 / 38㎡:37万基準）',
      cost: costRoof,
      price: priceRoof,
      isCore: true
    },
    {
      id: 4,
      num: '④',
      name: '外壁工事',
      spec: `純外壁面積 ${totalNetWallM2.toFixed(1)}㎡ (ガルバリウム鋼板角波・透湿防水シート・役物)`,
      calcBasis: '純外壁面積按分（68㎡:45万 / 149㎡:78万基準）',
      cost: costWall,
      price: priceWall,
      isCore: true
    },
    {
      id: 5,
      num: '⑤',
      name: '基礎工事',
      spec: `外周長 ${totalFoundM.toFixed(1)}m (鉄筋コンクリート布基礎・アンカーボルト緊結)`,
      calcBasis: '外周メートル単価 ＠1.2万円/m',
      cost: costFoundation,
      price: priceFoundation,
      isCore: true
    },
    {
      id: 6,
      num: '⑥',
      name: '建材工事',
      spec: `床面積 ${floorAreaM2.toFixed(1)}㎡ (下地合板・耐水ボード・留付副資材一式)`,
      calcBasis: '床面積按分（17㎡:6万 / 36㎡:17万基準）',
      cost: costBuildingMaterial,
      price: priceBuildingMaterial,
      isCore: true
    },
    {
      id: 7,
      num: '⑦',
      name: '申請手続き費用',
      spec: '専任建築士による確認申請図書作成・構造チェック・行政提出代行一式',
      calcBasis: '建築士事務所直営ワンストップ定額',
      cost: costPermit,
      price: pricePermit,
      isCore: true
    }
  ];

  // =========================================================================
  // 【B. 付帯工事・追加工事（現地調査・ヒアリングで確定する別途費用）】
  // =========================================================================
  const additionalWorksItems = [
    {
      id: 'add_01',
      name: '解体工事・整地工事',
      desc: '既存の物置・ブロック塀・樹木の解体撤去、残土すき取り、砕石地盤整地',
      status: '別途・現地調査後にお見積り',
      approxRange: '約15万 〜 45万円（状況による）'
    },
    {
      id: 'add_02',
      name: '電気工事',
      desc: '敷地内からの幹線引込、屋内分電盤新設、LED照明、2口コンセント、スイッチ配線',
      status: '別途・ご要望仕様に応じお見積り',
      approxRange: '約12万 〜 25万円（標準ガレージ配線）'
    },
    {
      id: 'add_03',
      name: '空調工事',
      desc: '換気設備、ガレージ用エアコン設置、専用200V電源配管工事',
      status: '別途・ご要望に応じお見積り',
      approxRange: '約8万 〜 20万円'
    },
    {
      id: 'add_04',
      name: '土間打設工事',
      desc: '床土間コンクリート打設（厚120mm・ワイヤーメッシュ配筋・金ゴテ仕上げ）',
      status: '別途・床仕上げご希望時にお見積り',
      approxRange: `約${Math.round(floorAreaM2 * 8500 / 10000)}万円 (${floorAreaM2.toFixed(1)}㎡ @8,500円/㎡)`
    },
    {
      id: 'add_05',
      name: '給排水衛生設備工事',
      desc: '洗車用外部散水栓、スロップシンク（手洗い流し）、給排水配管接続工事',
      status: '別途・水回りご希望時にお見積り',
      approxRange: '約10万 〜 30万円'
    },
    {
      id: 'add_06',
      name: '地盤調査費用',
      desc: 'スウェーデン式サウンディング（SWS）試験による地耐力測定・判定書作成',
      status: '別途・建築確認申請時に実施',
      approxRange: '約4万 〜 7万円'
    },
    {
      id: 'add_07',
      name: '測量・行政調査費用',
      desc: '敷地境界確認測量、市街化調整区域適合証明調査、農地転用調査等の特殊手続き',
      status: '別途・敷地法規条件に応じお見積り',
      approxRange: '約10万 〜 25万円'
    }
  ];

  const taxAmount = Math.round(mainWorksTotalPrice * 0.1);
  const mainWorksTotalPriceWithTax = mainWorksTotalPrice + taxAmount;

  return {
    markupRate: MARKUP_RATE,
    mainWorksItems,
    mainWorksTotalCost,
    mainWorksTotalPrice,
    profitAmount,
    profitRate,
    taxAmount,
    mainWorksTotalPriceWithTax,
    additionalWorksItems
  };
};
