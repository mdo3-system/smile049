import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Calendar, Clock, Lock, Sparkles, ArrowRight, ArrowLeft, 
  CheckCircle2, Vote, Share2, HelpCircle, Eye, Box, MessageSquare, ChevronRight
} from 'lucide-react';
import { getAllStories, isStoryPublished } from '../services/storyService';
import { Analytics } from '../utils/analytics';

export default function StoryPage({ setCurrentRoute }) {
  const [stories, setStories] = useState(() => getAllStories());
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [userSelectedQuizOption, setUserSelectedQuizOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // 同期イベントを監視
  useEffect(() => {
    const handleUpdate = () => setStories(getAllStories());
    window.addEventListener('smile049_stories_updated', handleUpdate);
    return () => window.removeEventListener('smile049_stories_updated', handleUpdate);
  }, []);

  // 初期選択ストーリーを設定（URLパラメータまたは最新公開エピソード）
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const epNum = parseInt(params.get('ep'), 10);
    if (epNum) {
      const target = stories.find(s => s.episodeNum === epNum);
      if (target) {
        setSelectedStoryId(target.id);
        return;
      }
    }
    // デフォルトは最新の公開中エピソード、なければ第1話
    const published = stories.filter(isStoryPublished);
    if (published.length > 0) {
      setSelectedStoryId(published[published.length - 1].id);
    } else if (stories.length > 0) {
      setSelectedStoryId(stories[0].id);
    }
  }, [stories]);

  const activeStory = stories.find(s => s.id === selectedStoryId) || stories[0];
  const isPublished = activeStory ? isStoryPublished(activeStory) : true;
  const currentIndex = stories.findIndex(s => s.id === activeStory?.id);

  const handleSelectStory = (story) => {
    setSelectedStoryId(story.id);
    setUserSelectedQuizOption(null);
    setShowAnswer(false);
    window.scrollTo({ top: 180, behavior: 'smooth' });
    const url = new URL(window.location);
    url.searchParams.set('ep', story.episodeNum);
    window.history.replaceState({}, '', url);
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleAnswerQuiz = (optIndex) => {
    setUserSelectedQuizOption(optIndex);
    setShowAnswer(true);
  };

  if (!activeStory) return null;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: 80 }}>
      {/* ヒーローヘッダー */}
      <section style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '50px 20px 40px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(64, 145, 108, 0.25)',
            color: '#80ed99',
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: 12.5,
            fontWeight: 700,
            marginBottom: 16
          }}>
            <BookOpen size={15} />
            <span>スマイチ 公式WEB連載コラム</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 800,
            margin: '0 0 12px',
            lineHeight: 1.3,
            color: '#f8fafc'
          }}>
            木造自由設計ガレージ物語
          </h1>

          <p style={{
            fontSize: 15,
            color: '#cbd5e1',
            lineHeight: 1.7,
            maxWidth: 680,
            margin: '0 auto 20px'
          }}>
            「あと少し寸法が合わない」「変形地に既製品が入らない」と諦めていた方へ。<br />
            敷地に合わせてミリ単位で創る、新しいガレージ・収納のある暮らしのストーリーをお届けします。
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentRoute('simulator')}
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, #2d6a4f 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 20px',
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(64, 145, 108, 0.3)'
              }}
            >
              <Box size={16} />
              <span>3Dシミュレーターで自分で作ってみる（無料）</span>
            </button>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '30px 16px' }}>
        
        {/* エピソード一覧セレクター（横スクロール／グリッド） */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              📖 エピソード一覧（全{stories.length}話）
            </h2>
            <span style={{ fontSize: 12, color: '#64748b' }}>
              毎週定期更新・配信予定日連動
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 10
          }}>
            {stories.map((story) => {
              const pub = isStoryPublished(story);
              const isActive = story.id === activeStory.id;
              return (
                <div
                  key={story.id}
                  onClick={() => handleSelectStory(story)}
                  style={{
                    background: isActive ? '#fff' : pub ? '#ffffff' : '#f1f5f9',
                    border: `2px solid ${isActive ? 'var(--color-primary)' : pub ? '#cbd5e1' : '#e2e8f0'}`,
                    borderRadius: 8,
                    padding: '10px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(64, 145, 108, 0.15)' : 'none',
                    opacity: pub ? 1 : 0.75
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{
                      background: isActive ? 'var(--color-primary)' : pub ? '#334155' : '#94a3b8',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4
                    }}>
                      第{story.episodeNum}話
                    </span>
                    {pub ? (
                      <span style={{ fontSize: 10.5, color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle2 size={11} /> 公開中
                      </span>
                    ) : (
                      <span style={{ fontSize: 10.5, color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Lock size={11} /> {story.scheduledDate.replace(/^\d{4}-/, '').replace('-', '/')}公開
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: isActive ? '#0f172a' : '#475569',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {story.phase.replace(/【第\d+話：?/, '').replace(/】$/, '') || story.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 選択されたエピソードのメイン記事カード */}
        <div style={{
          background: '#ffffff',
          borderRadius: 14,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          overflow: 'hidden'
        }}>
          {/* 記事ヘッダー */}
          <div style={{
            background: isPublished ? 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' : '#fef3c7',
            padding: '24px 28px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  background: isPublished ? '#0f172a' : '#b45309',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 800
                }}>
                  第{activeStory.episodeNum}話
                </span>
                {isPublished ? (
                  <span style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#059669',
                    padding: '3px 10px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 700
                  }}>
                    公開中エピソード
                  </span>
                ) : (
                  <span style={{
                    background: '#fde68a',
                    color: '#92400e',
                    padding: '3px 10px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <Lock size={13} /> 配信予定（次回予告）
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12.5, color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={14} /> 配信日: <strong>{activeStory.scheduledDate}</strong>
                </span>
                <button
                  onClick={handleCopyShare}
                  style={{
                    background: copiedUrl ? '#10b981' : '#fff',
                    color: copiedUrl ? '#fff' : '#475569',
                    border: '1px solid #cbd5e1',
                    borderRadius: 4,
                    padding: '4px 10px',
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Share2 size={12} />
                  <span>{copiedUrl ? 'URLコピー完了' : '共有URLをコピー'}</span>
                </button>
              </div>
            </div>

            <h2 style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 800, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.4 }}>
              {activeStory.title}
            </h2>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#2d6a4f' }}>
              {activeStory.phase}
            </div>
          </div>

          {/* 未公開（次回予告）の場合のティザー表示 */}
          {!isPublished ? (
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: '#fef3c7', color: '#b45309',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
              }}>
                <Lock size={32} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
                このエピソードは【 {activeStory.scheduledDate} 】に公開予定です
              </h3>
              <p style={{ fontSize: 14, color: '#64748b', maxWidth: 540, margin: '0 auto 24px', lineHeight: 1.7 }}>
                現在、専任スタッフとAIによる作画・パース確認を行っております。<br />
                配信予定日になると自動的にフルストーリーと高精細フォトリアルパースが公開されます。お楽しみに！
              </p>

              {/* あらすじ予告 */}
              <div style={{
                maxWidth: 600, margin: '0 auto 28px', background: '#f8fafc', padding: 20, borderRadius: 10,
                border: '1px dashed #cbd5e1', textAlign: 'left'
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#b45309', marginBottom: 6 }}>
                  📝 次回予告あらすじ
                </div>
                <div style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.8 }}>
                  {activeStory.plot.slice(0, 140)}……（続きは公開日にオープン）
                </div>
              </div>

              <button
                onClick={() => setCurrentRoute('simulator')}
                style={{
                  background: 'var(--color-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <Box size={16} />
                <span>公開を待つ間に3Dシミュレーターを触ってみる</span>
              </button>
            </div>
          ) : (
            /* 公開中の場合のフルコンテンツ表示 */
            <div style={{ padding: '30px 28px' }}>
              
              {/* パース画像（ある場合） */}
              {activeStory.imageUrl && (
                <div style={{ marginBottom: 28, borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <img
                    src={activeStory.imageUrl}
                    alt={activeStory.title}
                    style={{ width: '100%', maxHeight: 460, objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ background: '#f8fafc', padding: '8px 14px', fontSize: 11.5, color: '#64748b', textAlign: 'center' }}>
                    ※ 掲載パースは3DシミュレーターモデルをもとにAI高精細生成された完成予想イメージです。
                  </div>
                </div>
              )}

              {/* ストーリー本文 */}
              <div style={{
                fontSize: 16,
                lineHeight: 2.0,
                color: '#1e293b',
                whiteSpace: 'pre-wrap',
                marginBottom: 36,
                background: '#ffffff',
                padding: '10px 0'
              }}>
                {activeStory.plot}
              </div>

              {/* 読者参加型 価格アンケート・希望価格リサーチ枠 */}
              {activeStory.quizEnabled && (
                <div style={{
                  background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                  borderRadius: 12,
                  border: '1.5px solid #fde68a',
                  padding: '24px 24px',
                  marginBottom: 36
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 22 }}>🗳️</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#b45309' }}>
                        読者参加型 アンケート ＆ リアルタイム積算答え合わせ
                      </div>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#78350f', margin: '2px 0 0' }}>
                        Q. {activeStory.quizQuestion}
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: 12.5, color: '#92400e', marginBottom: 16 }}>
                    以下の選択肢から、あなたの予想や「この価格なら建てたい！」と思う選択肢をタップしてください。
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10, marginBottom: 18 }}>
                    {activeStory.quizOptions.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleAnswerQuiz(optIdx)}
                        style={{
                          background: userSelectedQuizOption === optIdx ? '#b45309' : '#ffffff',
                          color: userSelectedQuizOption === optIdx ? '#ffffff' : '#451a03',
                          border: `2px solid ${userSelectedQuizOption === optIdx ? '#b45309' : '#fcd34d'}`,
                          borderRadius: 8,
                          padding: '12px 14px',
                          textAlign: 'left',
                          fontSize: 13.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {/* 答え合わせ＆3DシミュレーターCTA */}
                  {showAnswer && (
                    <div style={{
                      background: '#ffffff',
                      borderRadius: 8,
                      border: '1.5px solid #10b981',
                      padding: '16px 20px',
                      marginTop: 16,
                      animation: 'fadeIn 0.3s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontSize: 13, fontWeight: 800, marginBottom: 6 }}>
                        <CheckCircle2 size={16} />
                        <span>アンケートへのご回答ありがとうございます！</span>
                      </div>
                      <div style={{ fontSize: 13.5, color: '#1e293b', lineHeight: 1.7, marginBottom: 12 }}>
                        💡 <strong>実際の建築費用目安:</strong> {activeStory.quizAnswerHint}<br />
                        敷地の形や必要な開口部・棚によって、3Dシミュレーター上でいつでもリアルタイムに概算積算できます。
                      </div>
                      <button
                        onClick={() => setCurrentRoute('simulator')}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '10px 18px',
                          fontSize: 13.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <span>3Dシミュレーターで答え合わせ・見積もりを試す</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 3Dシミュレーター誘導大型バナー */}
              <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: 12,
                padding: '24px 28px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                marginBottom: 24
              }}>
                <div>
                  <h4 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 6px', color: '#f8fafc' }}>
                    あなたも「わが家の土地に合わせたガレージ」を描いてみませんか？
                  </h4>
                  <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                    登録不要・無料。ブラウザ上で4辺の長さを変えると、概算費用がその場でわかります。
                  </p>
                </div>
                <button
                  onClick={() => setCurrentRoute('simulator')}
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, #2d6a4f 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 22px',
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 12px rgba(64, 145, 108, 0.4)'
                  }}
                >
                  <Box size={16} />
                  <span>3Dシミュレーターを開く</span>
                </button>
              </div>

            </div>
          )}

          {/* ページ送りフッター（前後の話） */}
          <div style={{
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12
          }}>
            {currentIndex > 0 ? (
              <button
                onClick={() => handleSelectStory(stories[currentIndex - 1])}
                style={{
                  background: '#fff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: '8px 14px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <ArrowLeft size={14} />
                <span>第{stories[currentIndex - 1].episodeNum}話へ</span>
              </button>
            ) : <div />}

            <span style={{ fontSize: 12.5, color: '#64748b', fontWeight: 600 }}>
              第 {activeStory.episodeNum} / {stories.length} 話
            </span>

            {currentIndex < stories.length - 1 ? (
              <button
                onClick={() => handleSelectStory(stories[currentIndex + 1])}
                style={{
                  background: '#fff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: '8px 14px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>第{stories[currentIndex + 1].episodeNum}話へ</span>
                <ArrowRight size={14} />
              </button>
            ) : <div />}
          </div>

        </div>

      </div>
    </div>
  );
}
