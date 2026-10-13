import React, { useRef, useState } from 'react';
import { 
  X, Printer, ShieldCheck, FileText, User, 
  Lock, Eye, AlertCircle, Wrench, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';
import { generate7CategoriesEstimate, MARKUP_RATE } from '../simulator/pricing/costEstimator';

export default function EstimateDetailModal({ isOpen, onClose, quantities, dimensions, openings, onOpenParseRequest }) {
  const printRef = useRef(null);
  const [customerName, setCustomerName] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showCatalogDetails, setShowCatalogDetails] = useState(true);

  const [estimateDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  });
  const [estimateNo] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
  });

  const [isAdjustArea, setIsAdjustArea] = useState(false);

  if (!isOpen) return null;

  const estimate = generate7CategoriesEstimate(quantities, { ...dimensions, isAdjustArea }, openings);

  const {
    mainWorksItems,
    mainWorksTotalCost,
    mainWorksTotalPrice,
    profitAmount,
    profitRate,
    taxAmount,
    mainWorksTotalPriceWithTax,
    additionalWorksItems
  } = estimate;

  const handlePrint = () => {
    const styleId = 'smile049-print-style';
    let existing = document.getElementById(styleId);
    if (!existing) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @media print {
          @page { size: A4 portrait; margin: 10mm 12mm 12mm 12mm; }
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
            font-size: 10pt;
            font-family: 'Noto Sans JP', sans-serif;
            color: #000 !important;
          }
          #estimate-print-area table { page-break-inside: auto; }
          #estimate-print-area tr { page-break-inside: avoid; }
          .no-print { display: none !important; }
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
        maxWidth: '960px',
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
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #334155'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={22} color="#38bdf8" />
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, letterSpacing: '0.02em' }}>
                概算建築御見積書（本体工事積算 ＆ 付帯工事内訳）
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: '#94a3b8' }}>
                木造自由設計ガレージ・倉庫 スマイチ（リアルタイム自動算定システム）
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* 管理者モード切替スイッチ（一般ユーザーには完全非表示：URLに?admin=1または/adminページ時のみ表示） */}
            {(typeof window !== 'undefined' && (window.location.search.includes('admin') || window.location.pathname.includes('admin'))) && (
              <button
                type="button"
                onClick={() => setIsAdminMode(!isAdminMode)}
                style={{
                  background: isAdminMode ? '#dc2626' : 'rgba(255,255,255,0.12)',
                  border: isAdminMode ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  padding: '5px 11px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.2s ease'
                }}
                title="原価と見積額の両建て表示切り替え（社内・管理者用）"
              >
                <Lock size={13} />
                <span>{isAdminMode ? '管理者モード：ON (原価表示中)' : '管理者モード切替'}</span>
              </button>
            )}

            {/* 大手4社比較表ボタン */}
            <a
              href="/maker-comparison.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid #38bdf8',
                color: '#38bdf8',
                padding: '5px 11px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              title="大手主要4社との構造・実質総額徹底比較シートを別タブで開く（A4横印刷・PDF出力対応）"
            >
              <FileText size={13} color="#38bdf8" />
              <span>4社比較表 (A4)</span>
            </a>

            <button
              type="button"
              onClick={handlePrint}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Printer size={14} />
              <span>御見積印刷 / PDF</span>
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

          {/* 宛先・見積番号・発行日 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 20,
            gap: 16,
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div className="no-print" style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <User size={13} />
                <span>宛先（お客様名）<span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: 4 }}>※ 印刷前に入力可能</span></span>
              </div>
              <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="text"
                  placeholder="例：山田 太郎　様"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1.5px solid #cbd5e1',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#0f172a',
                    background: '#fafafa',
                    outline: 'none'
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>御中 / 様</span>
              </div>
              {customerName ? (
                <div style={{ marginTop: 6, fontSize: 16, fontWeight: 800, color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: 4 }}>
                  {customerName}　御中 / 様
                </div>
              ) : (
                <div style={{ marginTop: 6, fontSize: 16, fontWeight: 800, color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: 4 }}>
                  お客様　御中 / 様
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right', fontSize: 12, color: '#475569', lineHeight: 1.8 }}>
              <div><span style={{ fontWeight: 700 }}>見積番号：</span>{estimateNo}</div>
              <div><span style={{ fontWeight: 700 }}>発行日：</span>{estimateDate}</div>
              <div><span style={{ fontWeight: 700 }}>有効期限：</span>発行日より30日間</div>
              <div style={{ marginTop: 4, fontWeight: 700, color: '#0f172a' }}>株式会社 住ま居る</div>
              <div style={{ fontSize: 11 }}>〒350-2224 埼玉県鶴ヶ島市町屋176番地5</div>
              <div style={{ fontSize: 11 }}>建築士事務所：埼玉県知事 第(5)10278号 ／ 建設業：埼玉県知事 (般-8)第66822号</div>
            </div>
          </div>

          {/* 管理者モード専用アラートバー */}
          {isAdminMode && (
            <div style={{
              background: '#fef2f2',
              border: '1.5px dashed #ef4444',
              borderRadius: 8,
              padding: '10px 16px',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12.5,
              color: '#991b1b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lock size={15} color="#dc2626" />
                <strong>【社内閲覧中】管理者モード（乗率 1.33 / 想定粗利率 約{profitRate}%）</strong>
              </div>
              <div>
                原価合計: <strong>¥{mainWorksTotalCost.toLocaleString()}</strong> ➔ 
                粗利額: <strong style={{ color: '#dc2626' }}>¥{profitAmount.toLocaleString()}</strong>
              </div>
            </div>
          )}

          {/* 見積サマリーカード */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '2px solid var(--color-primary)',
            borderRadius: 12,
            padding: '18px 24px',
            marginBottom: 22,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16
          }}>
            <div>
              <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>
                本体工事 御見積金額（必ず発生する工事・税抜）
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--color-primary-dark)', letterSpacing: '-0.02em' }}>
                  ¥{mainWorksTotalPriceWithTax.toLocaleString()}
                </span>
                <span style={{ fontSize: 14, color: '#475569', fontWeight: 600 }}>
                  (税込)
                </span>
                <span style={{ fontSize: 13, color: '#64748b', marginLeft: 6 }}>
                  [税抜 ¥{mainWorksTotalPrice.toLocaleString()}]
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#b45309', marginTop: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                <AlertCircle size={14} />
                <span>※本体工事以外の付帯・追加工事は、現地調査・ヒアリング後に【別途】算定となります</span>
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
                <span style={{ color: '#64748b' }}>床面積: </span>
                <strong>{quantities?.floorAreaM2?.toFixed(2) || '20.00'} ㎡ ({quantities?.tsubo?.toFixed(2) || '6.05'} 坪)</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>基礎全周長: </span>
                <strong>{quantities?.totalFoundM?.toFixed(2) || '18.00'} m</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>屋根実面積: </span>
                <strong>{quantities?.roofRealM2?.toFixed(2) || '24.00'} ㎡</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>純外壁面積: </span>
                <strong>{quantities?.totalNetWallM2?.toFixed(2) || '48.00'} ㎡</strong>
              </div>
            </div>
          </div>

          {/* 用途地域・申請区分オプション */}
          <div className="no-print" style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            padding: '10px 16px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12.5
          }}>
            <span style={{ color: '#475569', fontWeight: 600 }}>
              敷地の用途地域（建築確認申請 区分）：
            </span>
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontWeight: 700, color: isAdjustArea ? '#b45309' : '#1e293b' }}>
              <input 
                type="checkbox" 
                checked={isAdjustArea} 
                onChange={e => setIsAdjustArea(e.target.checked)} 
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <span>市街化調整区域（適合協議 ＋2万円加算）</span>
            </label>
          </div>


          {/* =========================================================================
              セクション 1: 【A. 本体工事（必ずかかるもの）】
             ========================================================================= */}
          <div style={{ marginBottom: 26 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
              paddingBottom: 6,
              borderBottom: '2px solid var(--color-primary)'
            }}>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ background: 'var(--color-primary)', color: '#fff', fontSize: 11, padding: '2px 7px', borderRadius: 4 }}>必須</span>
                <span>A. 本体工事（必ずかかる基本工事・7項目）</span>
              </h4>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                小計: <strong>¥{mainWorksTotalPrice.toLocaleString()}</strong> (税抜)
              </span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, border: '1px solid #cbd5e1', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left', borderBottom: '1.5px solid #cbd5e1' }}>
                  <th style={{ padding: '9px 12px', width: '22%' }}>工事項目</th>
                  <th style={{ padding: '9px 12px', width: '38%' }}>仕様・数量・算出基準</th>
                  {isAdminMode && (
                    <>
                      <th style={{ padding: '9px 10px', width: '13%', textAlign: 'right', color: '#991b1b', background: '#fee2e2' }}>仕入原価</th>
                      <th style={{ padding: '9px 10px', width: '11%', textAlign: 'right', color: '#991b1b', background: '#fee2e2' }}>粗利 (約25%)</th>
                    </>
                  )}
                  <th style={{ padding: '9px 14px', width: isAdminMode ? '16%' : '40%', textAlign: 'right' }}>御見積金額 (税抜)</th>
                </tr>
              </thead>
              <tbody>
                {mainWorksItems.map((item, idx) => {
                  const profit = item.price - item.cost;
                  return (
                    <React.Fragment key={item.id}>
                      <tr style={{
                        borderBottom: idx < mainWorksItems.length - 1 ? '1px solid #e2e8f0' : 'none',
                        background: idx % 2 === 0 ? '#ffffff' : '#fcfcfc'
                      }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>
                          <span style={{ color: 'var(--color-primary)', marginRight: 5 }}>{item.num}</span>
                          <span>{item.name}</span>
                        </td>
                        <td style={{ padding: '10px 12px', color: '#334155' }}>
                          <div style={{ fontWeight: 600 }}>{item.spec}</div>
                          {isAdminMode && item.calcBasis && (
                            <div style={{ fontSize: 11, color: '#991b1b', marginTop: 3, background: '#fef2f2', padding: '2px 6px', borderRadius: 4, display: 'inline-block' }}>
                              【内部算定基準】{item.calcBasis}
                            </div>
                          )}
                          {item.id === 2 && item.catalogList?.length > 0 && (
                            <button
                              type="button"
                              className="no-print"
                              onClick={() => setShowCatalogDetails(!showCatalogDetails)}
                              style={{
                                marginTop: 4,
                                background: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                borderRadius: 4,
                                padding: '2px 8px',
                                fontSize: 11,
                                color: '#0369a1',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              <span>三和シャッター＆LIXIL明細 ({item.catalogList.length}点)</span>
                              {showCatalogDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                          )}
                        </td>

                        {isAdminMode && (
                          <>
                            <td style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 600, color: '#991b1b', background: '#fef2f2' }}>
                              ¥{item.cost.toLocaleString()}
                            </td>
                            <td style={{ padding: '10px 10px', textAlign: 'right', fontSize: 11.5, color: '#b91c1c', background: '#fef2f2' }}>
                              +¥{profit.toLocaleString()}
                            </td>
                          </>
                        )}

                        <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: 13.5 }}>
                          ¥{item.price.toLocaleString()}
                        </td>
                      </tr>

                      {/* 開口部カタログ内訳展開 */}
                      {item.id === 2 && showCatalogDetails && item.catalogList?.length > 0 && (
                        <tr>
                          <td colSpan={isAdminMode ? 5 : 3} style={{ background: '#f8fafc', padding: '10px 16px', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>🚪【シャッター・サッシ開口部 規格内訳明細】</span>
                              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>設置数量: 計 {item.catalogList.length} 箇所</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {item.catalogList.map((catItem, cIdx) => (
                                <div key={cIdx} style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '6px 12px',
                                  background: '#ffffff',
                                  borderRadius: 5,
                                  border: '1px solid #e2e8f0',
                                  fontSize: 12
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{
                                      background: catItem.maker === '三和シャッター' ? '#e0e7ff' : '#ffedd5',
                                      color: catItem.maker === '三和シャッター' ? '#3730a3' : '#9a3412',
                                      padding: '2px 6px',
                                      borderRadius: 4,
                                      fontWeight: 700,
                                      fontSize: 11
                                    }}>
                                      {catItem.maker}
                                    </span>
                                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{catItem.product}</span>
                                    <span style={{ fontSize: 11, color: '#64748b' }}>× {catItem.qty || 1}式</span>
                                  </div>
                                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <span style={{ color: '#64748b', fontSize: 11.5 }}>カタログ定価: ¥{catItem.listPrice.toLocaleString()}</span>
                                    {isAdminMode && (
                                      <span style={{ color: '#b91c1c', fontWeight: 600, fontSize: 11.5 }}>仕入原価: ¥{catItem.cost.toLocaleString()}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: '#f1f5f9', borderTop: '2px solid #cbd5e1', fontWeight: 800 }}>
                  <td style={{ padding: '10px 12px' }}>本体工事 合計</td>
                  <td style={{ padding: '10px 12px', fontSize: 11.5, color: '#64748b' }}>
                    {isAdminMode ? '※原価に所定の乗率（1.33）を按分適用' : '※標準仕様・建物規模に基づく概算算定'}
                  </td>
                  {isAdminMode && (
                    <>
                      <td style={{ padding: '10px 10px', textAlign: 'right', color: '#991b1b', background: '#fee2e2' }}>
                        ¥{mainWorksTotalCost.toLocaleString()}
                      </td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', color: '#991b1b', background: '#fee2e2' }}>
                        ¥{profitAmount.toLocaleString()} ({profitRate}%)
                      </td>
                    </>
                  )}
                  <td style={{ padding: '10px 14px', textAlign: 'right', color: 'var(--color-primary-dark)', fontSize: 15 }}>
                    ¥{mainWorksTotalPrice.toLocaleString()} (税抜)
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* =========================================================================
              セクション 2: 【B. 付帯工事・追加工事（別途費用一覧）】
             ========================================================================= */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
              paddingBottom: 6,
              borderBottom: '2px solid #ea580c'
            }}>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#9a3412', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ background: '#ea580c', color: '#fff', fontSize: 11, padding: '2px 7px', borderRadius: 4 }}>別途</span>
                <span>B. 付帯工事・追加工事（現地調査・ヒアリング後に確定する別途費用）</span>
              </h4>
              <span style={{ fontSize: 11.5, color: '#c2410c', fontWeight: 700 }}>
                ※敷地条件・ご要望に応じ加算
              </span>
            </div>

            <div style={{
              background: '#fffaf0',
              border: '1px solid #fed7aa',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 12,
              color: '#9a3412',
              lineHeight: 1.6,
              marginBottom: 10
            }}>
              <strong>【重要なお知らせ】</strong><br />
              以下の工事および諸費用は、土地の高低差・既存障害物・地盤の硬さ・電気引込距離・ご希望設備によって大きく変動するため、<strong>現地調査およびヒアリングを経て初めて確定する別途費用</strong>となります。契約後に予期せぬ請求が発生しないよう、事前に項目をすべて明示しております。
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, border: '1px solid #fed7aa', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#fff7ed', color: '#9a3412', textAlign: 'left', borderBottom: '1.5px solid #fed7aa' }}>
                  <th style={{ padding: '8px 12px', width: '25%' }}>別途工事・諸費用項目</th>
                  <th style={{ padding: '8px 12px', width: '45%' }}>工事内容および適用条件</th>
                  <th style={{ padding: '8px 12px', width: '30%', textAlign: 'right' }}>概算参考費用・ステータス</th>
                </tr>
              </thead>
              <tbody>
                {additionalWorksItems.map((item, idx) => (
                  <tr 
                    key={item.id}
                    style={{
                      borderBottom: idx < additionalWorksItems.length - 1 ? '1px solid #ffedd5' : 'none',
                      background: idx % 2 === 0 ? '#ffffff' : '#fffdfa'
                    }}
                  >
                    <td style={{ padding: '9px 12px', fontWeight: 700, color: '#7c2d12' }}>
                      ・{item.name}
                    </td>
                    <td style={{ padding: '9px 12px', color: '#475569', fontSize: 12 }}>
                      {item.desc}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: '#c2410c', fontSize: 12 }}>
                        {item.approxRange}
                      </div>
                      <div style={{ fontSize: 10.5, color: '#9a3412', marginTop: 2 }}>
                        {item.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 備考・免責注記 */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '12px 16px',
            fontSize: 11.5,
            color: '#64748b',
            lineHeight: 1.7,
            marginBottom: 20
          }}>
            <strong>【お見積りに関する備考】</strong><br />
            1. 本御見積書は、3Dシミュレーターにて入力された設計寸法に基づき、所定の積算基準によりリアルタイムに自動算出した概算金額です。<br />
            2. 本書記載の「A. 本体工事」以外の工事（B. 付帯工事・追加工事）につきましては、現地確認およびお客様との仕様お打ち合わせ完了後に、正式な本見積書にてご提示申し上げます。<br />
            3. 特殊な狭小進入路（4tトラック進入不可等）や軟弱地盤判定等がある場合は、別途割増費用が発生する可能性がございます。
          </div>

          {/* フッターアクション */}
          <div className="no-print" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 14,
            borderTop: '1px solid #e2e8f0',
            gap: 12,
            flexWrap: 'wrap'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '9px 18px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              閉じる
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenParseRequest) onOpenParseRequest();
              }}
              className="btn-accent"
              style={{
                padding: '10px 24px',
                fontSize: 14,
                fontWeight: 800,
                boxShadow: '0 4px 14px rgba(224, 122, 95, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <ShieldCheck size={17} />
              <span>この寸法で見積もりを依頼する</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
