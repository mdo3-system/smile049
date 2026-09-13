import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, QrCode, FileText, Lock, MessageSquare, ArrowRight } from 'lucide-react';
import { createParseRequest } from '../services/chatService';

export default function ParseRequestModal({ isOpen, onClose, currentModelData, onOpenChat }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [planType, setPlanType] = useState('Plan 01: 愛車・ホビーガレージ');
  const [memo, setMemo] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert('お名前とメールアドレスをご入力ください。');
      return;
    }

    const room = createParseRequest({
      customerName: `${name} 様`,
      email,
      planType,
      modelData: currentModelData,
      memo
    });

    setCreatedRoom(room);
    setIsSubmitted(true);
  };

  const handleGoToChat = () => {
    onClose();
    if (onOpenChat && createdRoom) {
      onOpenChat(createdRoom.roomId);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16
    }} onClick={onClose}>
      <div 
        style={{
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: 580,
          borderRadius: 20,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
          color: '#ffffff',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={20} color="#fde047" />
            </div>
            <div>
              <h3 style={{ fontSize: 17, margin: 0, fontWeight: 700 }}>
                AIフォトリアルパース 作成依頼（無料）
              </h3>
              <div style={{ fontSize: 11.5, opacity: 0.85 }}>
                作成中の3Dデータをもとに、専任スタッフが社内PC（Stable Diffusion）で写真のようなパースを生成
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#fff', opacity: 0.8, padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* 完了画面 (マジックリンク ＆ QR案内) */}
        {isSubmitted && createdRoom ? (
          <div style={{ padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'var(--color-primary-soft)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <div>
              <h4 style={{ fontSize: 20, color: 'var(--text-main)', marginBottom: 8 }}>
                パース作成の受付が完了しました！
              </h4>
              <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                ご登録のメールアドレス宛に、専用トークルームへの<strong>ワンタップ・マジックリンク</strong>をお送りしました。<br />
                パスワード不要で、いつでもこのリンクからチャットを開けます。
              </p>
            </div>

            {/* スマホ連携QRコード枠 */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              textAlign: 'left',
              width: '100%',
              maxWidth: 440
            }}>
              <div style={{ background: '#ffffff', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1' }}>
                <QrCode size={48} color="#0f172a" />
              </div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                <strong style={{ color: '#0f172a' }}>📱 スマホで今すぐ続きを見る</strong><br />
                このQRコードをカメラで読み取ると、外出先でもチャット・パース確認が可能です。
              </div>
            </div>

            <button
              onClick={handleGoToChat}
              className="btn-accent"
              style={{ width: '100%', maxWidth: 440, padding: '14px', fontSize: 15 }}
            >
              <MessageSquare size={18} />
              <span>今すぐ相談トークルームを開く</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          /* 入力フォーム */
          <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '80vh', overflowY: 'auto' }}>
            
            {/* 生成イメージ見本カード (3Dモデル ➡️ ガルバリウム鋼板フォトリアル完成パース) */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: 10,
              padding: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 6
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: '#1e293b' }}>
                  🎨 パース生成イメージ見本 (ガルバリウム鋼板・軒出0仕様)
                </span>
                <span style={{ fontSize: 10, background: '#e2e8f0', color: '#475569', padding: '1px 6px', borderRadius: 4 }}>
                  社内PC作成例
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ position: 'relative', borderRadius: 6, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <img 
                    src="/assets/plans/plan01.jpg" 
                    alt="Plan01 ホビーガレージ完成見本" 
                    style={{ width: '100%', height: 95, objectFit: 'cover', display: 'block' }} 
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: 9.5, padding: '2px 6px', textAlign: 'center' }}>
                    Plan 01 愛車・バイクガレージ
                  </div>
                </div>
                <div style={{ position: 'relative', borderRadius: 6, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <img 
                    src="/assets/plans/plan02.jpg" 
                    alt="Plan02 大型ガレージ完成見本" 
                    style={{ width: '100%', height: 95, objectFit: 'cover', display: 'block' }} 
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: 9.5, padding: '2px 6px', textAlign: 'center' }}>
                    Plan 02 大型2台用ガレージ (車)
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 9.5, color: '#64748b', lineHeight: 1.4 }}>
                ※掲載モデルは、3Ｄシミュレーション・自動見積もりでは表現しきれない多数のオプション項目が含まれております。あらかじめご承知おきください。
              </div>
            </div>

            {/* 3Dデータ自動添付バッジ */}
            <div style={{
              background: 'var(--color-primary-soft)',
              border: '1px solid #b7e4c7',
              borderRadius: 8,
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 12,
              color: 'var(--color-primary-dark)'
            }}>
              <FileText size={18} color="var(--color-primary)" />
              <div>
                <strong>現在設計中の3Dモデルデータ（JSON）を自動添付しました</strong><br />
                <span style={{ fontSize: 11, color: '#40916c' }}>寸法・屋根勾配・開口部・棚・車両配置がそのまま専任スタッフに届きます。</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  お名前 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例：山田 太郎"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  メールアドレス <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  お電話番号（任意）
                </label>
                <input
                  type="tel"
                  placeholder="090-1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  用途プラン
                </label>
                <select
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                >
                  <option value="Plan 01: 愛車・ホビーガレージ">Plan 01: 愛車・ホビーガレージ</option>
                  <option value="Plan 02: 狭小・変形地ストッカー">Plan 02: 狭小・変形地ストッカー</option>
                  <option value="Plan 03: 農機具・大型アグリシェッド">Plan 03: 農機具・大型アグリシェッド</option>
                  <option value="その他特注ガレージ">その他特注ガレージ・倉庫</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                ご要望・敷地の状況など（任意）
              </label>
              <textarea
                rows={3}
                placeholder="例：敷地が台形で角に建てたい。大型バイクを2台置いた時のパースを見たい、など"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, resize: 'none' }}
              />
            </div>

            <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={13} />
              <span>面倒なパスワード設定は不要です。送信後に専用マジックリンクが発行されます。</span>
            </div>

            <button
              type="submit"
              className="btn-accent"
              style={{ width: '100%', padding: '14px', fontSize: 16, marginTop: 4 }}
            >
              <Send size={18} />
              <span>フォトリアルパース作成を依頼する（無料）</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
