import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, MessageSquare, Send, Paperclip, Sparkles, CheckCircle, 
  ArrowUpRight, ArrowLeft, RefreshCw, Download, Database, ShieldCheck, 
  ExternalLink, Calendar, Mail, FileText, Image as ImageIcon, Box,
  Layers, Maximize2, X
} from 'lucide-react';
import DocumentSlotPanel from '../components/DocumentSlotPanel';
import StoryStudioPanel from '../components/StoryStudioPanel';
import { Lock, KeyRound } from 'lucide-react';
import { getChatRooms, sendMessageToRoom, updateRoomStatus } from '../services/chatService';

const STAFF_PASSCODE = 'smile049';

export default function StaffAdminPage({ setCurrentRoute, onLoadCustomerModel }) {
  // 共有PCや一般ユーザーの誤アクセスを防ぐため、管理ページ入室時は常にパスコード認証を要求
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPasscode, setInputPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [mainAdminTab, setMainAdminTab] = useState('crm'); // 'crm' | 'storyStudio'

  // マウント時に過去のセッションストレージを念のためクリア
  useEffect(() => {
    sessionStorage.removeItem('wood_garage_staff_auth');
  }, []);

  const [rooms, setRooms] = useState(() => {
    try {
      return getChatRooms() || [];
    } catch (err) {
      console.error('Failed to load chat rooms:', err);
      return [];
    }
  });
  const [selectedRoomId, setSelectedRoomId] = useState(() => {
    try {
      const initRooms = getChatRooms();
      return initRooms?.[0]?.roomId || null;
    } catch (e) {
      return null;
    }
  });
  const [replyText, setReplyText] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [adminActiveTab, setAdminActiveTab] = useState('chat'); // 'chat' | 'documents'
  const fileInputRef = useRef(null);

  const handleLogin = (e) => {
    e?.preventDefault();
    if (inputPasscode === STAFF_PASSCODE) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setInputPasscode('');
    sessionStorage.removeItem('wood_garage_staff_auth');
  };

  const handleBackToSite = () => {
    handleLogout();
    setCurrentRoute('top');
  };


  useEffect(() => {
    const handleUpdate = () => {
      setRooms(getChatRooms());
    };
    window.addEventListener('chat_rooms_updated', handleUpdate);
    return () => window.removeEventListener('chat_rooms_updated', handleUpdate);
  }, []);

  const activeRoom = rooms.find(r => r.roomId === selectedRoomId) || rooms[0];

  const handleSendReply = (e) => {
    e?.preventDefault();
    if (!replyText.trim() || !activeRoom) return;

    sendMessageToRoom(activeRoom.roomId, {
      sender: 'staff',
      text: replyText
    });
    setReplyText('');
  };

  // AIフォトリアルパース生成・送付アクション（Stable Diffusion / ControlNet 連携模倣）
  const handleSendAiRender = () => {
    if (!activeRoom) return;
    setIsAiGenerating(true);

    // AIパース生成処理をシミュレート (実際には画像アップロードまたはサーバーレスAPI)
    setTimeout(() => {
      // サンプルパース画像用キャンバス生成 (高精細なウッドガレージパース風)
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 680;
      const ctx = canvas.getContext('2d');

      // 背景・青空グラデーション
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 400);
      skyGrad.addColorStop(0, '#38bdf8');
      skyGrad.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 1024, 680);

      // 地面・アスファルト
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, 400, 1024, 280);

      // ガレージ建物本体（木造無垢パース表現）
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(200, 180, 624, 280);

      // 木目ルーバー・シャッター
      ctx.fillStyle = '#b45309';
      ctx.fillRect(260, 240, 360, 220);
      ctx.fillStyle = '#78350f';
      for (let y = 250; y < 450; y += 14) {
        ctx.fillRect(260, y, 360, 2);
      }

      // 屋根・軒
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(180, 180);
      ctx.lineTo(844, 150);
      ctx.lineTo(844, 175);
      ctx.lineTo(180, 205);
      ctx.closePath();
      ctx.fill();

      // パースタイトル透かし
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('【AI Photoreal Perspective】木造自由設計ガレージ', 220, 140);
      ctx.font = '16px sans-serif';
      ctx.fillText(`Client: ${activeRoom.customerName} / Stable Diffusion v1.5 ControlNet Depth`, 220, 480);

      const renderDataUrl = canvas.toDataURL('image/png');

      sendMessageToRoom(activeRoom.roomId, {
        sender: 'staff',
        text: `お待たせいたしました！3DデータをもとにAIフォトリアルパース（外観昼景）を作成いたしました。木造の質感とシャッターの納まりをご確認ください。`,
        attachments: [
          {
            name: `${activeRoom.customerName}_フォトリアルパース.png`,
            type: 'image',
            size: '3.8MB',
            url: renderDataUrl,
            isAiRender: true
          }
        ]
      });

      updateRoomStatus(activeRoom.roomId, 'AIパース提案済');
      setIsAiGenerating(false);
    }, 1200);
  };

  // 自社顧客管理CRMへの自動移管
  const handleCrmTransfer = () => {
    if (!activeRoom) return;
    if (confirm(`${activeRoom.customerName} の商談データを「自社顧客管理CRM」へ登録・移管しますか？`)) {
      updateRoomStatus(activeRoom.roomId, '契約・CRM移管済');
      alert(`【CRM自動連携完了】\n${activeRoom.customerName} の顧客情報・3D仕様パラメータ・合意図面を自社CRMデータベースへ正常に登録・移管いたしました。`);
    }
  };

  // 顧客の3Dデータをシミュレーターで開く
  const handleOpenCustomer3D = () => {
    if (!activeRoom || !activeRoom.modelData) {
      alert('この依頼には3Dデータが添付されています（標準モデルで開きます）。');
    }
    if (onLoadCustomerModel && activeRoom.modelData) {
      onLoadCustomerModel(activeRoom.modelData);
    }
    setCurrentRoute('simulator');
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 80px)',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0',
          maxWidth: 420,
          width: '100%',
          padding: '36px 32px',
          textAlign: 'center'
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#f1f5f9',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Lock size={26} color="#0f172a" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
            専任スタッフ管理認証
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 24 }}>
            本画面は専任スタッフ・管理者専用です。<br />
            閲覧するにはスタッフ用パスコードを入力してください。
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  value={inputPasscode}
                  onChange={(e) => { setInputPasscode(e.target.value); setAuthError(false); }}
                  placeholder="スタッフ用パスコード"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: 'var(--radius-md)',
                    border: authError ? '2px solid #ef4444' : '1px solid #cbd5e1',
                    fontSize: 15,
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: '#f8fafc'
                  }}
                />
              </div>
              {authError && (
                <div style={{ color: '#ef4444', fontSize: 12, marginTop: 6, textAlign: 'left', fontWeight: 600 }}>
                  ✕ パスコードが正しくありません
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                fontSize: 15,
                background: '#0f172a',
                borderColor: '#0f172a'
              }}
            >
              <span>認証して入室する</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentRoute('top')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: 13,
                cursor: 'pointer',
                marginTop: 6
              }}
            >
              ← 一般トップページへ戻る
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 65px)',
      background: '#f1f5f9',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 管理画面トップバー */}
      <div style={{
        background: '#0f172a',
        color: '#ffffff',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={handleBackToSite}
            style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
          >
            <ArrowLeft size={16} />
            <span>サイトへ戻る</span>
          </button>
          <div style={{ height: 16, width: 1, background: '#334155' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} color="#38bdf8" />
            <h2 style={{ fontSize: 16, margin: 0, fontWeight: 700 }}>
              専任スタッフ・管理パネル
            </h2>
            <span style={{ fontSize: 11, background: '#1e293b', color: '#38bdf8', padding: '2px 8px', borderRadius: 4 }}>
              Xserver 連携運用モード
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setRooms(getChatRooms())}
            style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
          >
            <RefreshCw size={14} />
            <span>データ更新</span>
          </button>

          <button
            onClick={handleLogout}
            style={{
              color: '#f87171',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '4px 10px',
              borderRadius: 4,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
            title="管理セッションを終了"
          >
            <span>🔒 ログアウト</span>
          </button>
        </div>
      </div>

      {/* 管理画面メイン切り替えナビゲーションバー */}
      <div style={{
        background: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '0 24px'
      }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', gap: 16 }}>
          <button
            onClick={() => setMainAdminTab('crm')}
            style={{
              padding: '12px 18px',
              fontSize: 13.5,
              fontWeight: 700,
              background: 'transparent',
              border: 'none',
              borderBottom: mainAdminTab === 'crm' ? '3px solid #38bdf8' : '3px solid transparent',
              color: mainAdminTab === 'crm' ? '#38bdf8' : '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s ease'
            }}
          >
            <MessageSquare size={16} />
            <span>顧客相談・パース依頼管理 (CRM)</span>
          </button>

          <button
            onClick={() => setMainAdminTab('storyStudio')}
            style={{
              padding: '12px 18px',
              fontSize: 13.5,
              fontWeight: 700,
              background: 'transparent',
              border: 'none',
              borderBottom: mainAdminTab === 'storyStudio' ? '3px solid #80ed99' : '3px solid transparent',
              color: mainAdminTab === 'storyStudio' ? '#80ed99' : '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={16} />
            <span>ガレージ連載・Story Studio (Instagram / note / NanoBanana2)</span>
          </button>
        </div>
      </div>

      {/* タブ1: CRM顧客一覧 ＆ チャット管理 */}
      {mainAdminTab === 'crm' && (
        <div style={{
          flex: 1,
          maxWidth: 1300,
          width: '100%',
          margin: '0 auto',
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          gap: 20
        }}>
        {/* 左: 依頼・顧客リスト */}
        <div style={{
          background: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h3 style={{ fontSize: 14, color: '#1e293b', fontWeight: 700, margin: 0 }}>
              パース依頼・問い合わせ一覧 ({rooms.length}件)
            </h3>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {rooms.map((room) => {
              const isSelected = room.roomId === selectedRoomId;
              return (
                <div
                  key={room.roomId}
                  onClick={() => setSelectedRoomId(room.roomId)}
                  style={{
                    padding: '14px 18px',
                    borderBottom: '1px solid #f1f5f9',
                    background: isSelected ? 'var(--color-primary-soft)' : '#ffffff',
                    borderLeft: isSelected ? '4px solid var(--color-primary)' : '4px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
                      {room.customerName}
                    </span>
                    <span style={{
                      fontSize: 10.5,
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontWeight: 700,
                      background: room.crmTransferred ? '#dcfce7' : '#e0f2fe',
                      color: room.crmTransferred ? '#15803d' : '#0369a1'
                    }}>
                      {room.status}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
                    {room.planType}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
                    <span>{room.createdAt}</span>
                    <span>{room.messages.length}件のやり取り</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右: 個別チャット対応 ＆ アクションパネル */}
        {activeRoom ? (
          <div style={{
            background: '#ffffff',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {/* 顧客サマリー＆アクションバー */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ fontSize: 17, color: '#0f172a', margin: 0, fontWeight: 800 }}>
                    {activeRoom.customerName}
                  </h3>
                  <span style={{ fontSize: 12, color: '#64748b' }}>({activeRoom.email})</span>
                  {activeRoom.crmTransferred && (
                    <span style={{ fontSize: 11, background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle size={12} /> CRM移管完了
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  プラン種別：<strong>{activeRoom.planType}</strong>
                </div>
              </div>

              {/* スタッフ専用アクションボタン群 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {/* 3Dモデルで開く */}
                <button
                  onClick={handleOpenCustomer3D}
                  className="btn-secondary"
                  style={{ padding: '7px 12px', fontSize: 12, borderRadius: 6 }}
                >
                  <Box size={14} />
                  <span>3Dで開いて確認</span>
                </button>

                {/* AIパース作成・送付 */}
                <button
                  onClick={handleSendAiRender}
                  className="btn-accent"
                  disabled={isAiGenerating}
                  style={{ padding: '7px 14px', fontSize: 12, borderRadius: 6 }}
                >
                  <Sparkles size={14} />
                  <span>{isAiGenerating ? 'AIパース生成中...' : '✨ AIパースを生成して送付'}</span>
                </button>

                {/* CRMへ移管 */}
                <button
                  onClick={handleCrmTransfer}
                  style={{
                    padding: '7px 14px',
                    fontSize: 12,
                    borderRadius: 6,
                    background: activeRoom.crmTransferred ? '#e2e8f0' : '#1e293b',
                    color: activeRoom.crmTransferred ? '#64748b' : '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontWeight: 700
                  }}
                  disabled={activeRoom.crmTransferred}
                >
                  <Database size={14} />
                  <span>{activeRoom.crmTransferred ? 'CRM登録済' : '自社CRMへ登録・移管'}</span>
                </button>
              </div>
            </div>

            {/* チャットタイムライン ＆ 重要図書スロット 切り替えサブタブ */}
            <div style={{
              display: 'flex',
              background: '#f1f5f9',
              borderBottom: '1px solid #e2e8f0',
              padding: '0 20px'
            }}>
              <button
                type="button"
                onClick={() => setAdminActiveTab('chat')}
                style={{
                  padding: '12px 18px',
                  fontSize: 13,
                  fontWeight: adminActiveTab === 'chat' ? 700 : 500,
                  color: adminActiveTab === 'chat' ? 'var(--color-primary-dark)' : '#64748b',
                  borderBottom: adminActiveTab === 'chat' ? '3px solid var(--color-primary)' : '3px solid transparent',
                  background: 'none',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <MessageSquare size={15} />
                <span>💬 トークタイムライン ({activeRoom.messages.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setAdminActiveTab('documents')}
                style={{
                  padding: '12px 18px',
                  fontSize: 13,
                  fontWeight: adminActiveTab === 'documents' ? 700 : 500,
                  color: adminActiveTab === 'documents' ? 'var(--color-primary-dark)' : '#64748b',
                  borderBottom: adminActiveTab === 'documents' ? '3px solid var(--color-primary)' : '3px solid transparent',
                  background: 'none',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Layers size={15} />
                <span>📂 重要ドキュメント・図書スロット ({
                  (activeRoom.documents?.perspectives?.length || 0) +
                  (activeRoom.documents?.sitePlans?.length || 0) +
                  (activeRoom.documents?.sitePhotos?.length || 0)
                })</span>
              </button>
            </div>

            {adminActiveTab === 'documents' ? (
              <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
                <DocumentSlotPanel 
                  room={activeRoom} 
                  isStaff={true} 
                  onPreviewImage={(url) => setPreviewImage(url)} 
                />
              </div>
            ) : (
              <>
                {/* チャットタイムライン */}
                <div style={{
                  flex: 1,
                  padding: '20px',
                  overflowY: 'auto',
                  background: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  maxHeight: '480px'
                }}>
                  {activeRoom.messages.map((msg) => {
                    const isStaff = msg.sender === 'staff';
                    const isSystem = msg.sender === 'system';

                    if (isSystem) {
                      return (
                        <div key={msg.id} style={{
                          background: '#f1f5f9',
                          border: '1px dashed #cbd5e1',
                          borderRadius: 8,
                          padding: '8px 12px',
                          fontSize: 12,
                          color: '#475569',
                          textAlign: 'center'
                        }}>
                          {msg.text}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isStaff ? 'flex-end' : 'flex-start',
                          maxWidth: '80%',
                          alignSelf: isStaff ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>
                          {isStaff ? '専任スタッフ' : activeRoom.customerName} • {msg.time}
                        </div>

                        <div style={{
                          background: isStaff ? 'var(--color-primary)' : '#ffffff',
                          color: isStaff ? '#ffffff' : '#1e293b',
                          padding: '12px 16px',
                          borderRadius: 12,
                          border: isStaff ? 'none' : '1px solid #e2e8f0',
                          fontSize: 13.5,
                          lineHeight: 1.6,
                          boxShadow: 'var(--shadow-sm)'
                        }}>
                          {msg.text}

                          {/* 添付ファイル（画像はサムネイルカード＋拡大表示） */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {msg.attachments.map((att, aIdx) => {
                                const isImg = att.type === 'image' || att.isAiRender;
                                return (
                                  <div key={aIdx} style={{
                                    background: isStaff ? 'rgba(255,255,255,0.18)' : '#f1f5f9',
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    border: isStaff ? '1px solid rgba(255,255,255,0.25)' : '1px solid #e2e8f0'
                                  }}>
                                    {/* 画像インラインサムネイルカード */}
                                    {isImg && att.url && (
                                      <div
                                        onClick={() => setPreviewImage(att.url)}
                                        style={{
                                          cursor: 'pointer',
                                          position: 'relative',
                                          maxHeight: 180,
                                          overflow: 'hidden',
                                          background: '#0f172a'
                                        }}
                                      >
                                        <img
                                          src={att.url}
                                          alt={att.name}
                                          style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block',
                                            objectFit: 'cover'
                                          }}
                                        />
                                        <div style={{
                                          position: 'absolute',
                                          bottom: 6,
                                          right: 6,
                                          background: 'rgba(15, 23, 42, 0.75)',
                                          color: '#ffffff',
                                          padding: '2px 8px',
                                          borderRadius: 4,
                                          fontSize: 11,
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 4
                                        }}>
                                          <Maximize2 size={11} />
                                          <span>拡大表示</span>
                                        </div>
                                      </div>
                                    )}

                                    <div style={{
                                      padding: '6px 10px',
                                      fontSize: 12,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      gap: 10
                                    }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                                        {isImg ? <ImageIcon size={14} /> : <FileText size={14} />}
                                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                          {att.name}
                                        </span>
                                      </div>
                                      {att.url && (
                                        <a href={att.url} download={att.name} style={{ color: isStaff ? '#a7f3d0' : 'var(--color-primary)', fontWeight: 700, fontSize: 11, whiteSpace: 'nowrap' }}>
                                          ダウンロード
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 返信入力フォーム */}
                <form onSubmit={handleSendReply} style={{
                  padding: '14px 20px',
                  borderTop: '1px solid #e2e8f0',
                  background: '#ffffff',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center'
                }}>
                  <input
                    type="text"
                    placeholder={`${activeRoom.customerName} へ返信メッセージを入力...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '10px 20px', fontSize: 14, borderRadius: 8 }}
                  >
                    <Send size={15} />
                    <span>返信する</span>
                  </button>
                </form>
              </>
            )}
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', color: '#94a3b8' }}>
            顧客を選択してください。
          </div>
        )}
      </div>
      )}

      {/* タブ2: ガレージ連載・Story Studio (Instagram / note / NanoBanana2) */}
      {mainAdminTab === 'storyStudio' && (
        <div style={{
          flex: 1,
          maxWidth: 1300,
          width: '100%',
          margin: '0 auto',
          padding: '24px 20px'
        }}>
          <StoryStudioPanel />
        </div>
      )}

      {/* 全画面画像プレビューモーダル */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '85vh',
              background: '#0f172a',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              background: '#1e293b',
              color: '#ffffff'
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ImageIcon size={16} color="#38bdf8" />
                高精細パース・現況写真 プレビュー
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <a
                  href={previewImage}
                  download="garage_preview.jpg"
                  style={{
                    color: '#38bdf8',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Download size={14} />
                  高画質保存
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 4 }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div style={{ overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#020617' }}>
              <img
                src={previewImage}
                alt="Enlarged preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '75vh',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

