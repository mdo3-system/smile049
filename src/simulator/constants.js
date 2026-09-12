/**
 * シミュレーター共通定数および判定ヘルパー
 * 【単一責任の原則 (SRP): 定数・仕様定義の責務】
 */

// 壁面識別キー（時計回り: 正面 -> 右面 -> 背面 -> 左面）
export const WALL_KEYS = ['front', 'right', 'back', 'left'];

// 壁面の日本語名称
export const WALL_NAMES_JA = {
  front: '正面',
  right: '右面',
  back: '裏面',
  left: '左面'
};

// 柱芯からのオフセット値 (mm)
export const WALL_OUTER_OFFSET = 100; // 外装ふかし（通気層・胴縁・外装仕上げ）
export const WALL_INNER_OFFSET = 65;  // 内装仕上げ（石膏ボード・合板）

// 基礎天端・土間スラブの高さ (mm)
export const SLAB_TOP_GL = 50;        // 土間コンクリート仕上面 (GL+50)

// 土間レベル（基礎を切り欠く）開口部の種別判定
export const isFloorLevelOpening = (type) => {
  return type === 'shutter' || type === 'door' || type === 'entrance' || type === 'sweeping_window';
};
