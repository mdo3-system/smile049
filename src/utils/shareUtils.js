/**
 * 3Dシミュレーター設計データ URLエンコード・共有ユーティリティ (shareUtils.js)
 * 
 * 顧客が作成したガレージモデル（寸法・開口部・棚・車両・環境設定）を
 * 短く安全なURLクエリ文字列に変換し、LINE/X/Facebook/メール等でワンクリック共有可能にします。
 */

/**
 * 設計ステートをURLセーフな文字列に圧縮エンコード
 */
export function encodeDesignToParam(designState) {
  try {
    const compact = {
      d: designState.dimensions,
      o: designState.openings,
      s: designState.shelfUnits,
      v: designState.vehicles,
      g: designState.groundType || 'asphalt',
      k: designState.skyType || 'gradient'
    };
    const jsonStr = JSON.stringify(compact);
    // UTF-8対応のBase64エンコード & URL Safe置換
    const base64 = btoa(unescape(encodeURIComponent(jsonStr)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return base64;
  } catch (err) {
    console.error('Failed to encode design to param:', err);
    return '';
  }
}

/**
 * URLクエリ文字列から設計ステートを復元
 */
export function decodeDesignFromParam(paramStr) {
  try {
    if (!paramStr) return null;
    let base64 = paramStr.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonStr = decodeURIComponent(escape(atob(base64)));
    const parsed = JSON.parse(jsonStr);
    return {
      dimensions: parsed.d || parsed.dimensions,
      openings: parsed.o || parsed.openings,
      shelfUnits: parsed.s || parsed.shelfUnits,
      vehicles: parsed.v || parsed.vehicles,
      groundType: parsed.g || parsed.groundType || 'asphalt',
      skyType: parsed.k || parsed.skyType || 'gradient'
    };
  } catch (err) {
    console.warn('Failed to decode design from URL param:', err);
    return null;
  }
}

/**
 * 現在の設計状態からフル共有URLを構築
 */
export function buildShareUrl(designState) {
  const param = encodeDesignToParam(designState);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://smile049.jp';
  return `${origin}/simulator?design=${param}`;
}
