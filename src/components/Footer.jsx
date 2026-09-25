import React, { useState } from 'react';
import { Shield, Phone, Mail, MapPin, CheckCircle, ExternalLink, Building2 } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, NoteIcon } from './SnsIcons';
import { APP_VERSION } from '../version.js';
import CompanyInfoModal from './CompanyInfoModal';

export default function Footer({ setCurrentRoute }) {
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [companyModalTab, setCompanyModalTab] = useState('company');

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
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
              ※行政手続き・構造計算の窓口および主体は自社専任の「建築士」が行います。
            </div>

            {/* 公式SNS・Webメディアリンク */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 8,
              padding: '12px 14px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 8, letterSpacing: '0.06em' }}>
                OFFICIAL SNS & STORY MEDIA
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a
                  href="https://www.instagram.com/smile049_garage"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: 'rgba(225, 48, 108, 0.15)',
                    color: '#f472b6',
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                    border: '1px solid rgba(225, 48, 108, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  title="Instagram公式アカウント"
                >
                  <InstagramIcon size={14} />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://note.com/smile049"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: 'rgba(34, 197, 94, 0.15)',
                    color: '#86efac',
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  title="note公式アカウント（ガレージ物語連載）"
                >
                  <NoteIcon size={14} />
                  <span>note連載</span>
                </a>
                <a
                  href="https://www.youtube.com/@smile049_garage"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#fca5a5',
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  title="YouTube公式チャンネル（操作解説動画・施工動画）"
                >
                  <YoutubeIcon size={14} />
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>

          {/* 目的別プランリンク */}
          <div>
            <h4 style={{ fontSize: 15, color: '#fff', marginBottom: 16, borderBottom: '1px solid #334155', paddingBottom: 8 }}>
              目的別 4つの特化プラン
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
              <li>
                <button
                  onClick={() => { setCurrentRoute('plan-workshop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left' }}
                >
                  <span style={{ color: 'var(--color-accent)' }}>▸</span> Plan 04: 無柱大空間・ホール【スマイチワークショップ】
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
              対応エリア ＆ 施工体制
            </h4>
            <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <MapPin size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: 4 }} />
                <div>
                  <strong style={{ color: '#fff' }}>関東・埼玉県全域対応：</strong><br />
                  <span style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, display: 'block', marginTop: 2 }}>
                    さいたま市、川越市、所沢市、熊谷市、川口市、深谷市、本庄市、秩父市、東松山市、坂戸市、鶴ヶ島市、飯能市、狭山市、入間市、朝霞市、志木市、和光市、新座市、富士見市、ふじみ野市、三芳町、越谷市、春日部市、上尾市、桶川市、北本市、鴻巣市、久喜市、加須市ほか埼玉県全域。<br />
                    圏央道・関越道・東北道・外環道沿線の東京都（多摩・23区）、群馬県・栃木県・茨城県・千葉県の各エリアも迅速に対応いたします。
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={16} color="#80ed99" style={{ flexShrink: 0 }} />
                <span>クラウド電子契約対応（ご来店・押印不要でスムーズ）</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={16} color="#80ed99" style={{ flexShrink: 0 }} />
                <span>高耐震金物工法・自社専任スタッフによる構造計算実施</span>
              </div>

              {/* 運営事業者情報 */}
              <div style={{
                marginTop: 14,
                paddingTop: 14,
                borderTop: '1px solid #334155',
                fontSize: 12.5,
                color: '#94a3b8',
                lineHeight: 1.7
              }}>
                <div style={{ color: '#f1f5f9', fontWeight: 700 }}>運営事業者：株式会社 住ま居る</div>
                <div>所在地：〒350-2224 埼玉県鶴ヶ島市町屋176番地5</div>
                <div style={{ marginTop: 4, color: '#38bdf8', fontSize: 11.5 }}>
                  ※設計データやパース画像を迅速・正確に共有するため、お問合せ・ご相談は専用オンライン相談チャット（24時間受付）にて承っております。
                </div>
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
            <span>© 株式会社 住ま居る / スマイチ ガレージ プロジェクト All Rights Reserved.</span>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <button
              onClick={() => { setCompanyModalTab('privacy'); setIsCompanyModalOpen(true); }}
              style={{ color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 12, padding: 0 }}
            >
              プライバシーポリシー
            </button>
            <button
              onClick={() => { setCompanyModalTab('legal'); setIsCompanyModalOpen(true); }}
              style={{ color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 12, padding: 0 }}
            >
              特定商取引法に基づく表記
            </button>
            <button
              onClick={() => { setCompanyModalTab('company'); setIsCompanyModalOpen(true); }}
              style={{ color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 12, padding: 0 }}
            >
              運営会社概要
            </button>
            <button
              onClick={() => { setCurrentRoute('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{
                color: '#64748b',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 11,
                padding: '2px 6px',
                borderRadius: 4,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
              title="専任スタッフ専用管理パネル"
            >
              <span>👤 スタッフ管理</span>
            </button>
          </div>
        </div>
      </div>

      {/* 会社情報・規約モーダル */}
      <CompanyInfoModal 
        isOpen={isCompanyModalOpen} 
        onClose={() => setIsCompanyModalOpen(false)} 
        initialTab={companyModalTab} 
      />
    </footer>
  );
}

