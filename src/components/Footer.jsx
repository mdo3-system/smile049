import React from 'react';
import { Shield, Phone, Mail, MapPin, CheckCircle, ExternalLink } from 'lucide-react';
import { APP_VERSION } from '../version.js';


export default function Footer({ setCurrentRoute }) {

  return (
    <footer style={{
      background: '#202a36',
      color: '#e2e8f0',
      paddingTop: 60,
      paddingBottom: 40,
      borderTop: '4px solid var(--color-primary)'
    }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 40,
          marginBottom: 50
        }}>
          {/* 会社・プロジェクト概要 */}
          <div>
            <div style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: 4,
              background: 'rgba(64, 145, 108, 0.25)',
              color: '#80ed99',
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 12
            }}>
              建築士によるワンストップ設計・施工
            </div>
            <h3 style={{ fontSize: 20, color: '#fff', marginBottom: 14 }}>
              木造自由設計ガレージ・倉庫
            </h3>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.8, marginBottom: 16 }}>
              規格サイズに土地を合わせるのではなく、敷地に合わせて自分で描くガレージ。
              木造ならではの断熱・調湿を考えた仕様で、結露や湿気にも配慮しながら、安心の構造計算と確認申請一括対応でお届けします。
            </p>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              ※行政手続き・構造計算の窓口および主体は自社専任の「建築士」が行います。
            </div>
          </div>

          {/* 目的別プランリンク */}
          <div>
            <h4 style={{ fontSize: 15, color: '#fff', marginBottom: 16, borderBottom: '1px solid #334155', paddingBottom: 8 }}>
              目的別 3つの特化プラン
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <li>
                <button
                  onClick={() => { setCurrentRoute('plan-hobby'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left' }}
                >
                  <span style={{ color: 'var(--color-accent)' }}>▸</span> Plan 01: 大人の秘密基地【愛車・ホビー】
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentRoute('plan-storage'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left' }}
                >
                  <span style={{ color: 'var(--color-accent)' }}>▸</span> Plan 02: 隙間・変形地活用【特注ストッカー】
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentRoute('plan-agri'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left' }}
                >
                  <span style={{ color: 'var(--color-accent)' }}>▸</span> Plan 03: 農機具・大型倉庫【アグリシェッド】
                </button>
              </li>
              <li style={{ marginTop: 10 }}>
                <button
                  onClick={() => { setCurrentRoute('simulator'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ color: '#5eead4', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <span style={{ color: '#5eead4' }}>★</span> 無料3Dシミュレーター＋自動見積もり
                </button>
              </li>
            </ul>
          </div>

          {/* 対応エリア・運営情報 */}
          <div>
            <h4 style={{ fontSize: 15, color: '#fff', marginBottom: 16, borderBottom: '1px solid #334155', paddingBottom: 8 }}>
              対応エリア ＆ 運営案内
            </h4>
            <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <MapPin size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: 4 }} />
                <span>
                  <strong>対応エリア：</strong>埼玉県内全域および近隣エリア<br />
                  <small style={{ color: '#94a3b8' }}>（圏央道・関越自動車道・東北自動車道の各ICから30分圏内を中心に対応）</small>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={16} color="#80ed99" style={{ flexShrink: 0 }} />
                <span>クラウド電子契約対応（来店・押印不要）</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={16} color="#80ed99" style={{ flexShrink: 0 }} />
                <span>金物工法・建築士による構造計算実施</span>
              </div>
            </div>
          </div>
        </div>

        {/* 最下部 コピーライト */}
        <div style={{
          borderTop: '1px solid #334155',
          paddingTop: 24,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12,
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>© 住ま居る / スマイチ ガレージ プロジェクト All Rights Reserved.</span>
            <span style={{
              background: '#334155',
              color: '#94a3b8',
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 4,
              fontWeight: 700
            }}>
              v{APP_VERSION}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            <span>プライバシーポリシー</span>
            <span>特定商取引法に基づく表記</span>
            <span>運営会社概要</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

