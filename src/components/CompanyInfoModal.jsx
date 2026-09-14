import React, { useState } from 'react';
import { X, Building2, Shield, FileText, MessageSquare, MapPin, CheckCircle2 } from 'lucide-react';

export default function CompanyInfoModal({ isOpen, onClose, initialTab = 'company' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 14,
        width: '100%',
        maxWidth: 680,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        {/* モーダルヘッダー */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Building2 size={20} color="var(--color-primary)" />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
              運営企業・法定表記
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              padding: 4,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* タブナビゲーション */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          background: '#ffffff',
          padding: '0 20px'
        }}>
          {[
            { id: 'company', label: '運営会社概要', icon: Building2 },
            { id: 'privacy', label: 'プライバシーポリシー', icon: Shield },
            { id: 'legal', label: '特定商取引法に基づく表記', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '12px 14px',
                  fontSize: 13,
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? 'var(--color-primary)' : '#64748b',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* モーダルコンテンツ（スクロール可能） */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, fontSize: 13.5, color: '#334155', lineHeight: 1.8 }}>
          
          {/* ① 会社概要タブ */}
          {activeTab === 'company' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '16px 20px' }}>
                <h4 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: 6 }}>
                  会社情報
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ textAlign: 'left', padding: '10px 0', color: '#64748b', width: 140 }}>事業者名</th>
                      <td style={{ padding: '10px 0', fontWeight: 700, color: '#0f172a' }}>株式会社 住ま居る</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ textAlign: 'left', padding: '10px 0', color: '#64748b' }}>プロジェクト</th>
                      <td style={{ padding: '10px 0', color: '#0f172a' }}>木造自由設計ガレージ・倉庫 プラットフォーム【スマイチ (smile049.jp)】</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ textAlign: 'left', padding: '10px 0', color: '#64748b' }}>本社所在地</th>
                      <td style={{ padding: '10px 0', color: '#0f172a' }}>
                        〒350-2227 埼玉県鶴ヶ島市町屋176番地5
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ textAlign: 'left', padding: '10px 0', color: '#64748b' }}>事業内容</th>
                      <td style={{ padding: '10px 0', color: '#0f172a' }}>
                        ・木造建築・オーダーガレージ・倉庫の企画、3D意匠設計、自動積算システムの開発<br />
                        ・許認可申請代行、構造安全計算（金物工法）、建築工事一括請負・施工管理
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ textAlign: 'left', padding: '10px 0', color: '#64748b' }}>対応エリア</th>
                      <td style={{ padding: '10px 0', color: '#0f172a' }}>
                        埼玉県全域（鶴ヶ島・川越・さいたま・所沢・熊谷ほか）、東京都、千葉県、神奈川県、群馬県、栃木県、茨城県
                      </td>
                    </tr>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '10px 0', color: '#64748b' }}>お問合せ窓口</th>
                      <td style={{ padding: '10px 0', color: '#0f172a' }}>
                        本Webサイト「無料相談チャット」または専用依頼フォーム（24時間受付）
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <MessageSquare size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 12.5, color: '#1e40af', lineHeight: 1.6 }}>
                  <strong>【お問合せ・ご連絡について】</strong><br />
                  3D設計データやフォトリアルパース、敷地図面・求積図の円滑な共有および少人数専任スタッフによる丁寧な設計確認のため、お客様とのご連絡は専用オンライン相談チャットにて承っております。お電話での営業・勧誘等は固くお断り申し上げます。
                </div>
              </div>
            </div>
          )}

          {/* ② プライバシーポリシータブ */}
          {activeTab === 'privacy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>個人情報保護方針</h4>
              <p>
                株式会社 住ま居る（以下「当社」）は、スマイチプラットフォームをご利用いただくお客様の個人情報の重要性を認識し、個人情報保護法に基づき適切に取り扱います。
              </p>
              <div>
                <strong style={{ color: '#0f172a' }}>1. 取得する情報</strong><br />
                パース作成依頼、無料相談チャット、資料請求等に際し、お名前、メールアドレス、電話番号、建築地情報、3Dモデルデータを取得いたします。
              </div>
              <div>
                <strong style={{ color: '#0f172a' }}>2. 利用目的</strong><br />
                ・3Dパースの作成、積算見積書のご提示、建築相談への対応<br />
                ・現地調査、法規確認、確認申請、設計・施工に関するご連絡<br />
                ・当社サービスの品質向上およびアフターサポート
              </div>
              <div>
                <strong style={{ color: '#0f172a' }}>3. 第三者提供の制限</strong><br />
                法令に基づく場合を除き、お客様の事前の同意なく個人情報を第三者へ開示・提供することはありません。
              </div>
              <div>
                <strong style={{ color: '#0f172a' }}>4. 安全管理措置</strong><br />
                お客様の個人情報への不正アクセス、紛失、破壊、改ざん及び漏洩を防止するため、適切なセキュリティ対策を実施いたします。
              </div>
            </div>
          )}

          {/* ③ 特定商取引法に基づく表記タブ */}
          {activeTab === 'legal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>特定商取引法に基づく表記</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '9px 0', color: '#64748b', width: 140 }}>販売事業者</th>
                    <td style={{ padding: '9px 0', fontWeight: 700, color: '#0f172a' }}>株式会社 住ま居る</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '9px 0', color: '#64748b' }}>所在地</th>
                    <td style={{ padding: '9px 0', color: '#0f172a' }}>〒350-2227 埼玉県鶴ヶ島市町屋176番地5</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '9px 0', color: '#64748b' }}>連絡先窓口</th>
                    <td style={{ padding: '9px 0', color: '#0f172a' }}>本サイト内「無料相談チャット」窓口（24時間受付）</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '9px 0', color: '#64748b' }}>役務・商品の対価</th>
                    <td style={{ padding: '9px 0', color: '#0f172a' }}>3Dシミュレーション・概算見積もり・パース作成は完全無料。本契約施工費用は個別設計図書および御見積書記載の通り。</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '9px 0', color: '#64748b' }}>代金の支払方法</th>
                    <td style={{ padding: '9px 0', color: '#0f172a' }}>銀行振込、提携建築ローン、各種事業者向け融資等（契約時・着工時・上棟時・完成引渡時の分割払い）</td>
                  </tr>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '9px 0', color: '#64748b' }}>契約・キャンセル</th>
                    <td style={{ padding: '9px 0', color: '#0f172a' }}>建築請負契約締結後のキャンセルにつきましては、工事進捗・資材発注状況に応じた所定の清算規定に基づきます。</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* モーダルフッター */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          background: '#f8fafc'
        }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '6px 16px', fontSize: 13, borderRadius: 6 }}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
