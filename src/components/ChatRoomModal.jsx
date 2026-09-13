import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Paperclip, Image as ImageIcon, FileText, CheckCheck, 
  Sparkles, Download, ArrowLeft, User, Shield, Info, Maximize2 
} from 'lucide-react';
import { getChatRooms, sendMessageToRoom, getCurrentUserRoomId } from '../services/chatService';

export default function ChatRoomModal({ isOpen, onClose, initialRoomId }) {
  const [roomId, setRoomId] = useState(initialRoomId || getCurrentUserRoomId());
  const [rooms, setRooms] = useState(getChatRooms());
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialRoomId) setRoomId(initialRoomId);
  }, [initialRoomId]);

  useEffect(() => {
    const handleUpdate = () => {
      setRooms(getChatRooms());
    };
    window.addEventListener('chat_rooms_updated', handleUpdate);
    return () => window.removeEventListener('chat_rooms_updated', handleUpdate);
  }, []);

  const currentRoom = rooms.find(r => r.roomId === roomId) || rooms[0];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, currentRoom?.messages]);

  if (!isOpen || !currentRoom) return null;

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !selectedFile) return;

    const attachments = [];
    if (selectedFile) {
      attachments.push({
        name: selectedFile.name,
        type: selectedFile.type.startsWith('image/') ? 'image' : 'file',
        size: `${(selectedFile.size / 1024).toFixed(0)}KB`,
        url: URL.createObjectURL(selectedFile)
      });
    }

    sendMessageToRoom(currentRoom.roomId, {
      sender: 'customer',
      text: inputText,
      attachments
    });

    setInputText('');
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050,
      padding: '0'
    }} onClick={onClose}>
      <div 
        style={{
          backgroundColor: '#ebeef1',
          width: '100%',
          maxWidth: 540,
          height: '100%',
          maxHeight: '92vh',
          borderRadius: 20,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* チャットヘッダー (LINEライクなダークグリーン) */}
        <div style={{
          background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
          color: '#ffffff',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#ffffff',
              color: 'var(--color-primary-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16
            }}>
              住
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h3 style={{ fontSize: 16, margin: 0, fontWeight: 700 }}>
                  専任スタッフ・設計サポート窓口
                </h3>
                <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.25)', padding: '2px 6px', borderRadius: 10 }}>
                  公式
                </span>
              </div>
              <div style={{ fontSize: 11, opacity: 0.85, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>{currentRoom.customerName} 専用ルーム</span>
                <span>•</span>
                <span style={{ color: '#a7f3d0' }}>{currentRoom.status}</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} style={{ color: '#fff', opacity: 0.85, padding: 4 }}>
            <X size={22} />
          </button>
        </div>

        {/* サブステータスバー */}
        <div style={{
          background: '#ffffff',
          padding: '8px 16px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12,
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Shield size={14} color="var(--color-primary)" />
            <span>プラン: <strong>{currentRoom.planType}</strong></span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-wood)', fontWeight: 700 }}>
            ワンタップ・マジックリンク接続中
          </div>
        </div>

        {/* メッセージエリア */}
        <div style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          background: '#e4e8ec'
        }}>
          {currentRoom.messages.map((msg) => {
            const isMe = msg.sender === 'customer';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid #cbd5e1',
                  borderRadius: 12,
                  padding: '10px 14px',
                  fontSize: 12,
                  color: '#475569',
                  lineHeight: 1.6,
                  textAlign: 'center',
                  margin: '4px 20px'
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <Sparkles size={14} color="var(--color-primary)" />
                    <span>システム通知</span>
                  </div>
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
                  alignItems: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  alignSelf: isMe ? 'flex-end' : 'flex-start'
                }}
              >
                {!isMe && (
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 3, marginLeft: 6, fontWeight: 700 }}>
                    住ま居る 専任スタッフ
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, flexDirection: isMe ? 'row-reverse' : 'row' }}>
                  {/* メッセージバブル */}
                  <div style={{
                    background: isMe ? '#86efac' : '#ffffff',
                    color: isMe ? '#052e16' : '#1e293b',
                    padding: '10px 14px',
                    borderRadius: 16,
                    borderTopRightRadius: isMe ? 2 : 16,
                    borderTopLeftRadius: isMe ? 16 : 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    wordBreak: 'break-word'
                  }}>
                    {msg.text}

                    {/* 添付ファイル */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {msg.attachments.map((att, aIdx) => {
                          const isImg = att.type === 'image' || att.isAiRender;
                          return (
                            <div
                              key={aIdx}
                              style={{
                                background: isMe ? 'rgba(255,255,255,0.85)' : '#f8fafc',
                                border: '1px solid #cbd5e1',
                                borderRadius: 10,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 6
                              }}
                            >
                              {/* 画像の場合はインラインプレビュー表示 */}
                              {isImg && att.url && (
                                <div 
                                  onClick={() => setPreviewImage(att.url)}
                                  style={{ 
                                    cursor: 'pointer', 
                                    position: 'relative',
                                    overflow: 'hidden',
                                    maxHeight: 220,
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
                                      objectFit: 'cover',
                                      transition: 'transform 0.2s ease'
                                    }} 
                                  />
                                  <div style={{
                                    position: 'absolute',
                                    bottom: 6,
                                    right: 6,
                                    background: 'rgba(15, 23, 42, 0.75)',
                                    color: '#ffffff',
                                    padding: '3px 8px',
                                    borderRadius: 6,
                                    fontSize: 11,
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                  }}>
                                    <Maximize2 size={12} />
                                    <span>拡大・保存</span>
                                  </div>
                                </div>
                              )}

                              <div style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                                  {isImg ? (
                                    <ImageIcon size={16} color="var(--color-primary)" />
                                  ) : (
                                    <FileText size={16} color="var(--color-wood)" />
                                  )}
                                  <span style={{ fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                    {att.name}
                                  </span>
                                  {att.size && <small style={{ color: '#94a3b8' }}>({att.size})</small>}
                                </div>

                                {!isImg && att.url && (
                                  <button
                                    onClick={() => setPreviewImage(att.url)}
                                    style={{
                                      padding: '3px 8px',
                                      borderRadius: 4,
                                      background: 'var(--color-primary)',
                                      color: '#fff',
                                      fontSize: 11,
                                      fontWeight: 700
                                    }}
                                  >
                                    表示
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 送信時間 ＆ 既読 */}
                  <div style={{ fontSize: 10, color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    {isMe && <span style={{ color: 'var(--color-primary)', fontSize: 9 }}>既読</span>}
                    <span>{msg.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* 添付選択プレビュー */}
        {selectedFile && (
          <div style={{
            background: '#ffffff',
            padding: '8px 16px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#334155'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Paperclip size={14} color="var(--color-primary)" />
              <span>選択中: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(0)}KB)</span>
            </div>
            <button onClick={() => setSelectedFile(null)} style={{ color: '#ef4444', fontWeight: 700 }}>
              取消
            </button>
          </div>
        )}

        {/* 入力エリア */}
        <form onSubmit={handleSend} style={{
          background: '#ffffff',
          padding: '10px 14px',
          borderTop: '1px solid #cbd5e1',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0
        }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf,.json"
            style={{ display: 'none' }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              transition: 'background 0.2s'
            }}
            title="敷地図面や写真を添付"
          >
            <Paperclip size={18} />
          </button>

          <input
            type="text"
            placeholder="メッセージを入力（敷地の写真・図面も送れます）"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 20,
              border: '1px solid #cbd5e1',
              fontSize: 14,
              outline: 'none',
              background: '#f8fafc'
            }}
          />

          <button
            type="submit"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: (inputText.trim() || selectedFile) ? 'var(--color-primary)' : '#cbd5e1',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              cursor: (inputText.trim() || selectedFile) ? 'pointer' : 'default'
            }}
            disabled={!inputText.trim() && !selectedFile}
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* 高解像度画像プレビューモーダル */}
      {previewImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: 20
        }} onClick={() => setPreviewImage(null)}>
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              style={{
                position: 'absolute',
                top: -40,
                right: 0,
                color: '#fff',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={28} />
            </button>
            <img src={previewImage} alt="AIパースプレビュー" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8 }} />
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <a
                href={previewImage}
                download="ai-garage-perspective.png"
                className="btn-accent"
                style={{ display: 'inline-flex', padding: '10px 20px', fontSize: 14 }}
              >
                <Download size={16} />
                <span>画像をダウンロード保存</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
