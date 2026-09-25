import React, { useRef, useState } from 'react';
import { 
  X, Printer, Download, Sparkles, CheckCircle2, ShieldCheck, 
  HelpCircle, ChevronRight, FileText, ArrowRight, Building2, User
} from 'lucide-react';
import { generate7CategoriesEstimate } from '../simulator/pricing/costEstimator';

export default function EstimateDetailModal({ isOpen, onClose, quantities, dimensions, openings, onOpenParseRequest }) {
  const printRef = useRef(null);
  const [customerName, setCustomerName] = useState('');
  const [estimateDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
  });
  const [estimateNo] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`;
  });

  if (!isOpen) return null;

  const estimate = generate7CategoriesEstimate(quantities, dimensions, openings);
  const { grandTotal, categories } = estimate;

  const taxAmount = Math.round(grandTotal * 0.1);
  const totalWithTax = grandTotal + taxAmount;

  const handlePrint = () => {
    // 印刷用スタイルを動的に注入してA4縦でモーダルコンテンツのみ印刷
    const styleId = 'smile049-print-style';
    let existing = document.getElementById(styleId);
    if (!existing) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @media print {
          @page { size: A4 portrait; margin: 12mm 12mm 14mm 12mm; }
          body > * { display: none !important; }
          body { background: #fff !important; }
          #estimate-print-area {
            display: block !important;
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow: visible !important;
            background: #fff !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            font-size: 11pt;
            font-family: 'Noto Sans JP', sans-serif;
            color: #000 !important;
          }
          #estimate-print-area table { page-break-inside: auto; }
          #estimate-print-area tr { page-break-inside: avoid; }
          #estimate-no-print { display: none !important; }
        }
      `;
      document.head.appendChild(style);
    }
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      zIndex: 2100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        width: '100%',
        maxWidth: '920px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0'
      }}>
        {/* モーダルヘッダー */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #334155'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={22} color="#38bdf8" />
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: '0.02em' }}>
                概算建築御見積書（7大枠・内訳積算書）
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#94a3b8' }}>
                スマイチ 木造自由設計ガレージ・倉庫 プラットフォーム
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Printer size={14} />
              <span>印刷 / PDF出力</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* 見積書本体スクロールエリア */}
        <div id="estimate-print-area" ref={printRef} style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* 宛先・見積番号・発行日 ヘッダー */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 20,
            gap: 16,
            flexWrap: 'wrap'
          }}>
            {/* 宛先入力 */}
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <User size={13} />
                <span>宛先（お客様名）<span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: 4 }}>※ PDF出力前に入力してください</span></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="text"
                  placeholder="例：田中 さおり　様"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1.5px solid #cbd5e1',
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#0f172a',
                    background: '#fafafa',
                    outline: 'none'
                  }}
                />
                <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>御中 / 様</span>
              </div>
              {customerName && (
                <div style={{ marginTop: 6, fontSize: 16, fontWeight: 800, color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: 4 }}>
                  {customerName}　御中 / 様
                </div>
              )}
            </div>

            {/* 見積番号・日付・発行者 */}
            <div style={{ textAlign: 'right', fontSize: 12, color: '#475569', lineHeight: 1.8 }}>
              <div><span style={{ fontWeight: 700 }}>見積番号：</span>{estimateNo}</div>
              <div><span style={{ fontWeight: 700 }}>発行日：</span>{estimateDate}</div>
              <div><span style={{ fontWeight: 700 }}>有効期限：</span>発行日より30日間</div>
              <div style={{ marginTop: 6, fontWeight: 700, color: '#0f172a' }}>株式会社 住ま居る</div>
              <div style={{ fontSize: 11 }}>〒350-2224 埼玉県鶴ヶ島市町屋176番地5</div>
              <div style={{ fontSize: 11 }}>https://smile049.jp/</div>
            </div>
          </div>

          {/* 見積サマリーカード */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '2px solid var(--color-primary)',
            borderRadius: 12,
            padding: '20px 24px',
            marginBottom: 20,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16
          }}>
            <div>
              <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>
                概算御見積金額（7大枠合計）
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--color-primary-dark)', letterSpacing: '-0.02em' }}>
                  ¥{totalWithTax.toLocaleString()}
                </span>
                <span style={{ fontSize: 14, color: '#475569', fontWeight: 600 }}>
                  (税込)
                </span>
                <span style={{ fontSize: 13, color: '#94a3b8', marginLeft: 6 }}>
                  [税抜 ¥{grandTotal.toLocaleString()}]
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-wood)', marginTop: 4, fontWeight: 700 }}>
                ※敷地形状・建物寸法に合わせてリアルタイム積算中
              </div>
            </div>

            {/* 建築規模諸元 */}
            <div style={{
              background: '#ffffff',
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '6px 16px',
              fontSize: 12
            }}>
              <div>
                <span style={{ color: '#64748b' }}>延床面積: </span>
                <strong>{quantities?.floorAreaM2?.toFixed(2) || '25.00'} ㎡ ({quantities?.tsubo?.toFixed(2) || '7.56'} 坪)</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>基礎外周: </span>
                <strong>{quantities?.totalFoundM?.toFixed(2) || '20.00'} m</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>屋根実面積: </span>
                <strong>{quantities?.roofRealM2?.toFixed(2) || '28.00'} ㎡</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>外壁純面積: </span>
                <strong>{quantities?.totalNetWallM2?.toFixed(2) || '45.00'} ㎡</strong>
              </div>
            </div>
          </div>

          {/* 凡例バー（通常項目 vs 薄墨オプション） */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '8px 16px',
            marginBottom: 16,
            fontSize: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, background: 'var(--color-primary)', borderRadius: 3, display: 'inline-block' }}></span>
                <strong style={{ color: '#0f172a' }}>選択中・標準積算項目</strong>（合計に加算）
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, background: '#e2e8f0', border: '1px dashed #94a3b8', borderRadius: 3, display: 'inline-block' }}></span>
                <span style={{ color: '#64748b', fontWeight: 600 }}>薄墨（未選択・オプション参考項目）</span>（金額の目安を提示）
              </span>
            </div>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              外壁・屋根: ガルバリウム鋼板 / 軒出0仕様
            </span>
          </div>

          {/* 7大枠テーブルリスト */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: 10,
                  overflow: 'hidden',
                  background: '#ffffff'
                }}
              >
                {/* 大枠ヘッダー */}
                <div style={{
                  background: '#f1f5f9',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #cbd5e1'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      background: 'var(--color-primary)',
                      color: '#ffffff',
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 4
                    }}>
                      枠 {cat.id}
                    </span>
                    <strong style={{ fontSize: 14, color: '#0f172a' }}>
                      {cat.title}
                    </strong>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                    枠小計: ¥{cat.selectedCost.toLocaleString()} (税抜)
                  </div>
                </div>

                {/* 明細行 */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                      <th style={{ padding: '8px 16px', width: '45%' }}>工事項目・仕様内容</th>
                      <th style={{ padding: '8px 12px', width: '25%' }}>規格・数量</th>
                      <th style={{ padding: '8px 12px', width: '15%', textAlign: 'right' }}>金額（税抜）</th>
                      <th style={{ padding: '8px 16px', width: '15%', textAlign: 'center' }}>適用ステータス</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.items.map((item, idx) => {
                      const isGhost = item.ghost;
                      return (
                        <tr 
                          key={idx}
                          style={{
                            borderBottom: idx < cat.items.length - 1 ? '1px solid #f1f5f9' : 'none',
                            background: isGhost ? '#fafafa' : '#ffffff',
                            color: isGhost ? '#94a3b8' : '#1e293b'
                          }}
                        >
                          <td style={{ padding: '9px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {isGhost ? (
                                <span style={{
                                  fontSize: 10,
                                  background: '#f1f5f9',
                                  color: '#64748b',
                                  border: '1px dashed #cbd5e1',
                                  padding: '1px 5px',
                                  borderRadius: 4,
                                  whiteSpace: 'nowrap'
                                }}>
                                  薄墨・オプション
                                </span>
                              ) : (
                                <span style={{
                                  fontSize: 10,
                                  background: '#e0f2fe',
                                  color: '#0369a1',
                                  padding: '1px 5px',
                                  borderRadius: 4,
                                  fontWeight: 700,
                                  whiteSpace: 'nowrap'
                                }}>
                                  標準適用
                                </span>
                              )}
                              <span style={{ fontWeight: isGhost ? 500 : 700 }}>
                                {item.name}
                              </span>
                            </div>
                            {item.note && (
                              <div style={{ fontSize: 11, color: isGhost ? '#94a3b8' : '#64748b', marginTop: 2, paddingLeft: isGhost ? 85 : 55 }}>
                                {item.note}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '9px 12px', color: isGhost ? '#94a3b8' : '#475569' }}>
                            {item.spec}
                          </td>
                          <td style={{
                            padding: '9px 12px',
                            textAlign: 'right',
                            fontWeight: isGhost ? 500 : 800,
                            color: isGhost ? '#94a3b8' : '#0f172a'
                          }}>
                            {isGhost ? `+¥${item.cost.toLocaleString()}` : `¥${item.cost.toLocaleString()}`}
                          </td>
                          <td style={{ padding: '9px 16px', textAlign: 'center' }}>
                            {isGhost ? (
                              <span style={{ color: '#94a3b8', fontSize: 11 }}>
                                未選択 (追加参考)
                              </span>
                            ) : (
                              <span style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                <CheckCircle2 size={13} />
                                見積計上
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* 必須注記事項 */}
          <div style={{
            marginTop: 24,
            padding: '14px 18px',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 8,
            fontSize: 12,
            color: '#92400e',
            lineHeight: 1.6
          }}>
            <div style={{ fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={16} />
              <span>御見積書の留意事項・免責事項</span>
            </div>
            <div>
              ※掲載モデルは、3Ｄシミュレーション・自動見積もりでは表現しきれない多数のオプション項目が含まれております。あらかじめご承知おきください。
            </div>
            <div style={{ marginTop: 4 }}>
              ※地盤状況（軟弱地盤での杭工事等）、準防火地域の延焼ラインサッシ仕様、現地進入路の幅員（2t車小分け運搬等）により最終確定金額が変動いたします。専任スタッフによる現地調査・建築確認申請精査の上で確定見積書を提示いたします。
            </div>
          </div>
        </div>

        {/* モーダルフッターアクション */}
        <div style={{
          padding: '14px 24px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '9px 18px', fontSize: 13, borderRadius: 8 }}
          >
            閉じる
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenParseRequest) onOpenParseRequest();
              }}
              className="btn-accent"
              style={{
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 800,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Sparkles size={16} />
              <span>この仕様でフォトリアルパースを依頼（無料）</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
