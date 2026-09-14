/**
 * Google Analytics 4 (GA4) 計測ユーティリティ
 * 測定ID: G-EV2QGP2C62
 */

export const GA_MEASUREMENT_ID = 'G-EV2QGP2C62';

/**
 * GA4 gtag が安全に呼び出せるかチェックして実行する
 */
export const gtag = (...args) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  } else {
    // 開発時・未ロード時などのフォールバックログ
    // console.debug('[GA4 Mock]', ...args);
  }
};

/**
 * SPA仮想ページビューの送信
 * @param {string} pagePath - 表示中のパス (例: /simulator, /plan-hobby)
 * @param {string} pageTitle - ページタイトル
 */
export const trackPageView = (pagePath, pageTitle) => {
  try {
    gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      page_location: typeof window !== 'undefined' ? window.location.href : '',
      send_to: GA_MEASUREMENT_ID
    });
  } catch (err) {
    console.warn('[GA4] trackPageView error:', err);
  }
};

/**
 * カスタムイベントの送信
 * @param {string} eventName - イベント名 (例: generate_lead, simulator_start)
 * @param {object} eventParams - 追加パラメータ
 */
export const trackEvent = (eventName, eventParams = {}) => {
  try {
    gtag('event', eventName, {
      ...eventParams,
      send_to: GA_MEASUREMENT_ID
    });
  } catch (err) {
    console.warn('[GA4] trackEvent error:', err);
  }
};

/**
 * 主要イベントのヘルパー関数
 */
export const Analytics = {
  // 1. 最重要コンバージョン：パース作成依頼送信完了（リード獲得）
  trackLeadGenerated: (planType, extra = {}) => {
    trackEvent('generate_lead', {
      event_category: 'conversion',
      event_label: planType,
      plan_type: planType,
      value: 1,
      currency: 'JPY',
      ...extra
    });
    trackEvent('perspective_request_submit', {
      plan_type: planType,
      ...extra
    });
  },

  // 2. パース作成依頼モーダルの表示（購入意欲・検討段階）
  trackPerspectiveModalOpen: (source, extra = {}) => {
    trackEvent('perspective_modal_open', {
      source,
      ...extra
    });
  },

  // 3. 3Dシミュレーター体験開始
  trackSimulatorStart: (source, planName = '') => {
    trackEvent('simulator_start', {
      source,
      plan_name: planName
    });
  },

  // 4. プランプリセット選択・読み込み
  trackPlanSelect: (planId, planName) => {
    trackEvent('plan_select', {
      plan_id: planId,
      plan_name: planName
    });
  },

  // 5. 操作マニュアル閲覧（迷ったユーザーの動向）
  trackManualOpen: (context = 'unknown') => {
    trackEvent('manual_open', {
      context
    });
  },

  // 6. 相談チャット起動
  trackChatOpen: (source) => {
    trackEvent('chat_open', {
      source
    });
  },

  // 7. 外部リンク・電話タップ
  trackContactClick: (type, target) => {
    trackEvent('contact_click', {
      contact_type: type, // 'tel', 'line', 'map' etc.
      target
    });
  }
};
