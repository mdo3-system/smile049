import React, { useState, useRef } from 'react';
import { 
  FileText, Image as ImageIcon, Upload, Download, Eye, Plus, 
  Trash2, ShieldCheck, CheckCircle2, Layers, AlertCircle, Compass,
  Maximize2, X, FileCode, Check
} from 'lucide-react';
import { addDocumentToSlot, removeDocumentFromSlot } from '../services/chatService';

export default function DocumentSlotPanel({ room, isStaff = false, onPreviewImage }) {
  const [activeSlotTab, setActiveSlotTab] = useState('all'); // 'all' | 'perspectives' | 'sitePlans' | 'sitePhotos'
  const [uploadCategory, setUploadCategory] = useState('sitePlans');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNote, setUploadNote] = useState('');
  const fileInputRef = useRef(null);

  if (!room) return null;

  const docs = room.documents || { perspectives: [], sitePlans: [], sitePhotos: [] };
  const perspectives = docs.perspectives || [];
  const sitePlans = docs.sitePlans || [];
  const sitePhotos = docs.sitePhotos || [];

  // ファイルアップロードハンドラー（CAD, 画像, PDF）
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
    const isCad = ['dxf', 'dwg', 'jww', 'fcbz'].includes(ext);
    const isPdf = ext === 'pdf';

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileUrl = event.target.result;
      const sizeStr = `${(file.size / 1024).toFixed(0)}KB`;

      // スロットに保存
      addDocumentToSlot(room.roomId, uploadCategory, {
        name: file.name,
        size: sizeStr,
        url: isImage ? fileUrl : (isPdf ? fileUrl : null),
        type: isImage ? 'image' : (isCad ? 'cad' : (isPdf ? 'pdf' : 'file')),
        extension: ext,
        memo: uploadNote || (isCad ? '敷地・配置CAD図面' : isPdf ? '公図・登記簿・申請図書' : isImage ? '現況写真' : '添付資料')
      });

      setUploadNote('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsUploading(false);
    };

    if (isImage || isPdf) {
      reader.readAsDataURL(file);
    } else {
      // CADやバイナリの場合もDataURLで保存（シミュレーター内ダウンロード用）
      reader.readAsDataURL(file);
    }
  };

  const getExtensionBadge = (ext = '') => {
    const e = ext.toUpperCase();
    let bg = '#64748b';
    if (['DXF', 'DWG', 'JWW', 'FCBZ'].includes(e)) bg = '#2563eb';
    else if (e === 'PDF') bg = '#dc2626';
    else if (['JPG', 'JPEG', 'PNG', 'WEBP'].includes(e)) bg = '#059669';
    return (
      <span style={{
        background: bg,
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 800,
        padding: '2px 6px',
        borderRadius: 4,
        letterSpacing: '0.04em'
      }}>
        {e || 'FILE'}
      </span>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      background: '#f8fafc',
      padding: '16px',
      borderRadius: 12,
      border: '1px solid #e2e8f0'
    }}>
      {/* スロットヘッダー */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: 12
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={18} color="var(--color-primary)" />
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
              重要ドキュメント・図書スロット
            </h4>
            <span style={{ fontSize: 11, background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>
              タイムライン分離・常時最新保管
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#64748b' }}>
            敷地配置図・登記簿公図・CADデータ・最新パース図・現況写真をバージョン管理し常時閲覧・差し替えできます。
          </p>
        </div>

        {/* アップロードボタン */}
        <button
          type="button"
          onClick={() => setIsUploading(!isUploading)}
          className="btn-primary"
          style={{
            padding: '7px 14px',
            fontSize: 12,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Upload size={14} />
          <span>図面・写真・CADを追加</span>
        </button>
      </div>

      {/* 新規追加フォームモーダル/ドロワー */}
      {isUploading && (
        <div style={{
          background: '#ffffff',
          border: '2px dashed var(--color-primary)',
          borderRadius: 10,
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-primary-dark)' }}>
              📥 スロットへのファイル格納（CAD / PDF / 画像）
            </span>
            <button 
              type="button" 
              onClick={() => setIsUploading(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="slotCategory" 
                value="sitePlans" 
                checked={uploadCategory === 'sitePlans'}
                onChange={() => setUploadCategory('sitePlans')}
              />
              📐 敷地・申請図書 (配置図・CAD・公図等)
            </label>
            <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="slotCategory" 
                value="sitePhotos" 
                checked={uploadCategory === 'sitePhotos'}
                onChange={() => setUploadCategory('sitePhotos')}
              />
              📸 現地・現況写真 (道路・全景・杭等)
            </label>
            {isStaff && (
              <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="slotCategory" 
                  value="perspectives" 
                  checked={uploadCategory === 'perspectives'}
                  onChange={() => setUploadCategory('perspectives')}
                />
                🏛 最新パース図 (専任スタッフ納品)
              </label>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="図面・写真の補足メモ（例: 境界杭実測 / 進入路4.5m / CADデータ）"
              value={uploadNote}
              onChange={(e) => setUploadNote(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: 12,
                borderRadius: 6,
                border: '1px solid #cbd5e1'
              }}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".dxf,.dwg,.jww,.fcbz,.pdf,.jpg,.jpeg,.png,.webp,.json"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary"
              style={{ padding: '8px 14px', fontSize: 12, borderRadius: 6, whiteSpace: 'nowrap' }}
            >
              ファイル選択 (.dxf, .pdf, 画像等)
            </button>
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>
            ※対応形式: CAD (.dxf, .dwg, .jww, .fcbz), PDF (.pdf), 画像 (.jpg, .png), 3Dモデル (.json)
          </div>
        </div>
      )}

      {/* 3大スロットタブ切替 */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>
        <button
          type="button"
          onClick={() => setActiveSlotTab('all')}
          style={{
            padding: '5px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: activeSlotTab === 'all' ? 700 : 500,
            background: activeSlotTab === 'all' ? '#0f172a' : '#e2e8f0',
            color: activeSlotTab === 'all' ? '#ffffff' : '#475569',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          すべて表示 ({perspectives.length + sitePlans.length + sitePhotos.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSlotTab('perspectives')}
          style={{
            padding: '5px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: activeSlotTab === 'perspectives' ? 700 : 500,
            background: activeSlotTab === 'perspectives' ? 'var(--color-primary)' : '#e2e8f0',
            color: activeSlotTab === 'perspectives' ? '#ffffff' : '#475569',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          🏛 パース図 ({perspectives.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSlotTab('sitePlans')}
          style={{
            padding: '5px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: activeSlotTab === 'sitePlans' ? 700 : 500,
            background: activeSlotTab === 'sitePlans' ? '#2563eb' : '#e2e8f0',
            color: activeSlotTab === 'sitePlans' ? '#ffffff' : '#475569',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          📐 敷地・申請図書・CAD ({sitePlans.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSlotTab('sitePhotos')}
          style={{
            padding: '5px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: activeSlotTab === 'sitePhotos' ? 700 : 500,
            background: activeSlotTab === 'sitePhotos' ? '#059669' : '#e2e8f0',
            color: activeSlotTab === 'sitePhotos' ? '#ffffff' : '#475569',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          📸 現地・現況写真 ({sitePhotos.length})
        </button>
      </div>

      {/* スロット表示グリッド */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        
        {/* ① 🏛 最新パース図スロット */}
        {(activeSlotTab === 'all' || activeSlotTab === 'perspectives') && perspectives.map((p) => (
          <div key={p.id} style={{
            background: '#ffffff',
            borderRadius: 10,
            border: '1px solid #cbd5e1',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ position: 'relative', height: 160, background: '#0f172a' }}>
              <img 
                src={p.url || '/assets/plans/plan01.jpg'} 
                alt={p.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: 8,
                left: 8,
                background: 'rgba(15, 23, 42, 0.85)',
                color: '#38bdf8',
                fontSize: 11,
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                🏛 パース図 {p.version || '最新'}
              </div>
              <button
                type="button"
                onClick={() => onPreviewImage && onPreviewImage(p.url || '/assets/plans/plan01.jpg')}
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '4px 8px',
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer'
                }}
              >
                <Maximize2 size={12} />
                拡大閲覧
              </button>
            </div>

            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.name}
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                更新: {p.updatedAt} • {p.size || '1.2MB'}
              </div>
              {p.memo && (
                <div style={{ fontSize: 11, color: '#0369a1', background: '#f0f9ff', padding: '4px 6px', borderRadius: 4, marginTop: 4 }}>
                  {p.memo}
                </div>
              )}
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: '#94a3b8' }}>ガルバ・軒出0仕様</span>
                <a 
                  href={p.url || '/assets/plans/plan01.jpg'} 
                  download={p.name}
                  style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Download size={13} />
                  保存
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* ② 📐 敷地・申請図書スロット */}
        {(activeSlotTab === 'all' || activeSlotTab === 'sitePlans') && sitePlans.map((s) => (
          <div key={s.id} style={{
            background: '#ffffff',
            borderRadius: 10,
            border: '1px solid #cbd5e1',
            padding: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 10
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {getExtensionBadge(s.extension)}
                  <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>{s.category || '敷地・申請図書'}</span>
                </div>
                <span style={{ fontSize: 10, color: '#94a3b8' }}>{s.version || 'v1.0'}</span>
              </div>

              <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', wordBreak: 'break-all' }}>
                {s.name}
              </div>

              {s.memo && (
                <div style={{ fontSize: 11, color: '#334155', background: '#f8fafc', padding: '6px', borderRadius: 4, marginTop: 6, border: '1px solid #f1f5f9' }}>
                  {s.memo}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{s.updatedAt} ({s.size})</span>
              <div style={{ display: 'flex', gap: 8 }}>
                {s.url && (
                  <a
                    href={s.url}
                    download={s.name}
                    style={{ fontSize: 11, color: '#2563eb', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}
                  >
                    <Download size={13} />
                    ダウンロード
                  </a>
                )}
                {isStaff && (
                  <button
                    type="button"
                    onClick={() => removeDocumentFromSlot(room.roomId, 'sitePlans', s.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 2 }}
                    title="スロットから削除"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* ③ 📸 現地・現況写真スロット */}
        {(activeSlotTab === 'all' || activeSlotTab === 'sitePhotos') && sitePhotos.map((ph) => (
          <div key={ph.id} style={{
            background: '#ffffff',
            borderRadius: 10,
            border: '1px solid #cbd5e1',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ position: 'relative', height: 140, background: '#0f172a' }}>
              <img 
                src={ph.url || '/assets/plans/plan02.jpg'} 
                alt={ph.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: 8,
                left: 8,
                background: 'rgba(5, 150, 105, 0.85)',
                color: '#ffffff',
                fontSize: 10,
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: 4
              }}>
                📸 現地現況写真
              </div>
              <button
                type="button"
                onClick={() => onPreviewImage && onPreviewImage(ph.url || '/assets/plans/plan02.jpg')}
                style={{
                  position: 'absolute',
                  bottom: 6,
                  right: 6,
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  padding: '3px 6px',
                  fontSize: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  cursor: 'pointer'
                }}
              >
                <Maximize2 size={11} />
                拡大
              </button>
            </div>

            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {ph.name}
              </div>
              {ph.caption && (
                <div style={{ fontSize: 11, color: '#475569' }}>
                  {ph.caption}
                </div>
              )}
              <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#94a3b8' }}>
                <span>{ph.updatedAt}</span>
                {ph.url && (
                  <a href={ph.url} download={ph.name} style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                    保存
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
