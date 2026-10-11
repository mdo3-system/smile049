import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send, MessageCircle } from 'lucide-react';
import { buildShareUrl } from '../utils/shareUtils';

export default function ShareModal({ isOpen, onClose, designState, floorArea = 0, approxCost = 0 }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = buildShareUrl(designState);

  const costText = approxCost > 0 ? `（概算本体約${Math.round(approxCost / 10000)}万円）` : '';
  const areaText = floorArea > 0 ? `【${floorArea}㎡】` : '';
  const defaultShareText = `【スマイチ3Dシミュレーター】私だけの木造自由設計ガレージ${areaText}${costText}をデザインしてみました！敷地に合わせてミリ単位でカスタマイズ＆リアルタイム見積もり体験ができます👇`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleShareX = () => {
    const text = encodeURIComponent(`${defaultShareText}\n${shareUrl}\n#木造ガレージ #ガレージ設計 #スマイチ #埼玉ガレージ`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareLine = () => {
    const text = encodeURIComponent(`${defaultShareText}\n${shareUrl}`);
    window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareMail = () => {
    const subject = encodeURIComponent('【スマイチ3Dガレージ】設計モデルの共有');
    const body = encodeURIComponent(`${defaultShareText}\n\n設計確認URL:\n${shareUrl}\n\n※このURLを開くだけで、ブラウザ上で3Dモデルと概算見積もり内訳が自動再現されます。`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        maxWidth: 540,
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* ヘッダー */}
        <div style={{
          background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
          color: '#ffffff',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Share2 size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>設計結果を保存・URLで共有</h3>
              <p style={{ margin: 0, fontSize: 11, color: '#d8f3dc', marginTop: 2 }}>
                家族に見せたり、スマホ・SNSでいつでもモデルを再開できます
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 6,
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ボディ */}
        <div style={{ padding: 20 }}>
          {/* URL コピーボックス */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
              🔗 あなたの設計専用 URL（登録不要・即時復元）
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                readOnly
                value={shareUrl}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: 12,
                  color: '#1e293b',
                  fontFamily: 'monospace',
                  outline: 'none'
                }}
                onClick={(e) => e.target.select()}
              />
              <button
                onClick={handleCopy}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: copied ? '#16a34a' : 'var(--color-primary)',
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 6px rgba(45, 106, 79, 0.25)'
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'コピー完了！' : 'URLコピー'}</span>
              </button>
            </div>
            {copied && (
              <p style={{ margin: '6px 0 0 0', fontSize: 11.5, color: '#16a34a', fontWeight: 700 }}>
                ✓ クリップボードにコピーしました！LINEやメモ帳にそのまま貼り付けできます。
              </p>
            )}
          </div>

          {/* SNS共有ボタン群 */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8 }}>
              📢 ワンタップでSNS・メッセージ送信
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {/* LINE */}
              <button
                onClick={handleShareLine}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  padding: '12px 6px',
                  borderRadius: 10,
                  border: '1px solid #06c755',
                  background: '#f0fdf4',
                  color: '#06c755',
                  fontWeight: 700,
                  fontSize: 11.5,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <MessageCircle size={22} color="#06c755" />
                <span>LINEで送る</span>
              </button>

              {/* X (Twitter) */}
              <button
                onClick={handleShareX}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  padding: '12px 6px',
                  borderRadius: 10,
                  border: '1px solid #000000',
                  background: '#f8fafc',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: 11.5,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 900, lineHeight: '22px' }}>𝕏</span>
                <span>Xで投稿</span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleShareFacebook}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  padding: '12px 6px',
                  borderRadius: 10,
                  border: '1px solid #1877f2',
                  background: '#eff6ff',
                  color: '#1877f2',
                  fontWeight: 700,
                  fontSize: 11.5,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 900, lineHeight: '22px' }}>f</span>
                <span>Facebook</span>
              </button>

              {/* メール */}
              <button
                onClick={handleShareMail}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  padding: '12px 6px',
                  borderRadius: 10,
                  border: '1px solid #64748b',
                  background: '#f1f5f9',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: 11.5,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <Send size={18} color="#475569" />
                <span>メール送信</span>
              </button>
            </div>
          </div>

          {/* メリット解説 */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            padding: 12,
            fontSize: 12,
            color: '#475569',
            lineHeight: 1.6
          }}>
            <strong style={{ color: '#1e293b', display: 'block', marginBottom: 4 }}>
              💡 このURLで共有できること
            </strong>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              <li>柱芯4辺の寸法、水下軒高、屋根勾配、天井仕様</li>
              <li>シャッター・サッシ・ドアの開口部位置と幅・高さ</li>
              <li>内部棚の段数・車両配置（SUV・トラクターなど）</li>
              <li>開いた端末で<strong>本体工事7項目＆概算御見積書</strong>もそのまま確認可能</li>
            </ul>
          </div>
        </div>

        {/* フッター */}
        <div style={{
          padding: '12px 20px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: 13, borderRadius: 8 }}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
