import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Calendar, Clock, Lock, Sparkles, ArrowRight, ArrowLeft, 
  CheckCircle2, Vote, Share2, HelpCircle, Eye, Box, MessageSquare, ChevronRight,
  Video, Image as ImageIcon, Lightbulb, Tag, FileText, Check, Search, ExternalLink,
  ChevronDown, ChevronUp, Maximize2
} from 'lucide-react';
import { getAllStories, isStoryPublished } from '../services/storyService';
import { getAllColumns, getColumnBySlug } from '../services/columnService';
import { Analytics } from '../utils/analytics';

export default function StoryPage({ setCurrentRoute }) {
  const [mainTab, setMainTab] = useState('columns'); // 'columns' | 'stories'
  const [columns, setColumns] = useState(() => getAllColumns());
  const [stories, setStories] = useState(() => getAllStories());
  
  // コラム用ステート
  const [selectedColumnSlug, setSelectedColumnSlug] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ストーリー用ステート
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [userSelectedQuizOption, setUserSelectedQuizOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState('auto');

  // 同期イベントを監視
  useEffect(() => {
    const handleUpdate = () => {
      setStories(getAllStories());
      setColumns(getAllColumns());
    };
    window.addEventListener('smile049_stories_updated', handleUpdate);
    return () => window.removeEventListener('smile049_stories_updated', handleUpdate);
  }, []);

  // URLパラメータのチェック（?tab=stories or ?col=xxx or ?ep=xxx）
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'stories' || tabParam === 'story') {
      setMainTab('stories');
    }
    const colParam = params.get('col');
    if (colParam) {
      setSelectedColumnSlug(colParam);
      setMainTab('columns');
    }
    const epNum = parseInt(params.get('ep'), 10);
    if (epNum) {
      const target = stories.find(s => s.episodeNum === epNum);
      if (target) {
        setSelectedStoryId(target.id);
        setMainTab('stories');
      }
    }
  }, [stories, columns]);

  const activeStory = stories.find(s => s.id === selectedStoryId) || stories[0];
  const isPublished = activeStory ? isStoryPublished(activeStory) : true;
  const activeColumn = selectedColumnSlug ? getColumnBySlug(selectedColumnSlug) : null;

  // カテゴリ一覧
  const categories = ['all', '市街化調整区域・法規', '変形地・狭小地活用', '構造・性能比較', '農業・大型倉庫', '愛車・バイク', '建築法規・申請', '税金・建築費', '施工実例レポート'];

  const filteredColumns = columns.filter(col => {
    const matchesCat = selectedCategory === 'all' || col.category === selectedCategory;
    const matchesQuery = !searchQuery || 
      col.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      col.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const navigateTo = (route) => {
    if (route === 'simulator') {
      Analytics.trackSimulatorStart('column_page');
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="story-page" style={{ background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* ヒーローヘッダー */}
      <section style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '60px 24px 70px',
        borderBottom: '4px solid var(--color-primary)'
      }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 20,
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 20,
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <Lightbulb size={16} />
            <span>スマイチ 公式ナレッジ ＆ 連載メディア</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(26px, 4.5vw, 40px)',
            fontWeight: 800,
            lineHeight: 1.35,
            marginBottom: 16
          }}>
            木造自由設計ガレージ・倉庫のすべてがわかる。<br />
            <span style={{ color: '#38bdf8' }}>建築士の専門ノウハウ ＆ 公式WEB連載コラム</span>
          </h1>

          <p style={{
            fontSize: 15.5,
            color: '#cbd5e1',
            lineHeight: 1.8,
            maxWidth: 760,
            margin: '0 auto 36px'
          }}>
            市街化調整区域の許可、変形地・敷地境界15cmのミリ単位設計、木造vsスチールの結露対策、補助金活用まで。<br />
            お客様の疑問やお悩みを建築士がわかりやすく解説します。
          </p>

          {/* 2大メインタブ切替バー */}
          <div style={{
            display: 'inline-flex',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '6px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.15)',
            gap: 8
          }}>
            <button
              onClick={() => { setMainTab('columns'); setSelectedColumnSlug(null); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 28px',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 800,
                cursor: 'pointer',
                border: 'none',
                background: mainTab === 'columns' ? '#38bdf8' : 'transparent',
                color: mainTab === 'columns' ? '#0f172a' : '#cbd5e1',
                boxShadow: mainTab === 'columns' ? '0 4px 12px rgba(56, 189, 248, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Lightbulb size={18} />
              <span>お悩み解決・専門コラム ({columns.length})</span>
            </button>

            <button
              onClick={() => { setMainTab('stories'); setSelectedColumnSlug(null); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 28px',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 800,
                cursor: 'pointer',
                border: 'none',
                background: mainTab === 'stories' ? '#80ed99' : 'transparent',
                color: mainTab === 'stories' ? '#0f172a' : '#cbd5e1',
                boxShadow: mainTab === 'stories' ? '0 4px 12px rgba(128, 237, 153, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <BookOpen size={18} />
              <span>ガレージ物語連載 ({stories.length}話)</span>
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================
          TAB 1: お悩み解決・専門SEOコラム
         ========================================================= */}
      {mainTab === 'columns' && (
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 24px 80px' }}>
          
          {/* 個別コラム詳細表示モード */}
          {activeColumn ? (
            <div>
              {/* 一覧へ戻るボタン */}
              <button
                onClick={() => setSelectedColumnSlug(null)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 6,
                  background: '#e2e8f0',
                  color: '#334155',
                  border: 'none',
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginBottom: 24
                }}
              >
                <ArrowLeft size={16} />
                <span>コラム一覧へ戻る</span>
              </button>

              {/* コラム本文カード */}
              <article style={{
                background: '#ffffff',
                borderRadius: 16,
                border: '1px solid #e2e8f0',
                padding: '40px 36px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                marginBottom: 40
              }}>
                {/* カテゴリ ＆ 読了時間 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7', fontSize: 12.5, fontWeight: 800, padding: '3px 10px', borderRadius: 4 }}>
                    {activeColumn.badge || activeColumn.category}
                  </span>
                  <span style={{ fontSize: 12.5, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={14} />
                    <span>{activeColumn.readTime}</span>
                  </span>
                  <span style={{ fontSize: 12.5, color: '#94a3b8' }}>
                    {activeColumn.publishedDate} 公開
                  </span>
                </div>

                <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.4, marginBottom: 20 }}>
                  {activeColumn.title}
                </h1>

                <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.85, background: '#f8fafc', padding: '18px 22px', borderRadius: 10, borderLeft: '4px solid var(--color-primary)', marginBottom: 36 }}>
                  {activeColumn.description}
                </p>

                {/* 関連現場写真 */}
                {activeColumn.photos && activeColumn.photos.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 36 }}>
                    {activeColumn.photos.map((p, idx) => (
                      <div key={idx} style={{ height: 180, borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        <img src={p} alt="現場施工写真" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* 各セクション */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  {activeColumn.sections.map((sec, idx) => (
                    <div key={idx} style={{ borderBottom: idx === activeColumn.sections.length - 1 ? 'none' : '1px solid #f1f5f9', paddingBottom: 24 }}>
                      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: 'var(--color-primary)' }}>■</span>
                        <span>{sec.h2}</span>
                      </h2>
                      {sec.content && (
                        <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.85, whiteSpace: 'pre-line', margin: '0 0 16px' }}>
                          {sec.content}
                        </p>
                      )}

                      {sec.bulletPoints && (
                        <ul style={{ background: '#f8fafc', padding: '16px 20px 16px 36px', borderRadius: 8, margin: '0 0 16px', color: '#334155', fontSize: 14.5, lineHeight: 1.8 }}>
                          {sec.bulletPoints.map((pt, pIdx) => (
                            <li key={pIdx}>{pt}</li>
                          ))}
                        </ul>
                      )}

                      {sec.highlight && (
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '14px 18px', color: '#166534', fontSize: 14.5, fontWeight: 600, margin: '0 0 16px' }}>
                          {sec.highlight}
                        </div>
                      )}

                      {sec.comparisonTable && (
                        <div style={{ overflowX: 'auto', margin: '16px 0' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
                            <thead>
                              <tr style={{ background: '#f1f5f9' }}>
                                <th style={{ padding: '10px 14px', border: '1px solid #e2e8f0', textAlign: 'left' }}>比較項目</th>
                                <th style={{ padding: '10px 14px', border: '1px solid #e2e8f0', textAlign: 'left', color: 'var(--color-primary-dark)', background: 'rgba(232,245,233,0.5)' }}>スマイチ木造自由設計</th>
                                <th style={{ padding: '10px 14px', border: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>一般的な規格スチール</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sec.comparisonTable.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td style={{ padding: '10px 14px', border: '1px solid #e2e8f0', fontWeight: 700 }}>{row.item}</td>
                                  <td style={{ padding: '10px 14px', border: '1px solid #e2e8f0', color: '#166534', background: 'rgba(240,253,244,0.5)' }}>{row.wood}</td>
                                  <td style={{ padding: '10px 14px', border: '1px solid #e2e8f0', color: '#64748b' }}>{row.steel}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {sec.faqs && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                          {sec.faqs.map((faq, fIdx) => (
                            <div key={fIdx} style={{ background: '#f8fafc', borderRadius: 8, padding: '14px 18px', border: '1px solid #e2e8f0' }}>
                              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 14.5, marginBottom: 6 }}>
                                Q. {faq.q}
                              </div>
                              <div style={{ color: '#475569', fontSize: 14, lineHeight: 1.7 }}>
                                A. {faq.a}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 3DシミュレーターCTAバナー */}
                {activeColumn.simulatorCta && (
                  <div style={{
                    marginTop: 40,
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    borderRadius: 14,
                    padding: '28px 30px',
                    color: '#fff',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16
                  }}>
                    <div>
                      <div style={{ fontSize: 12.5, color: '#38bdf8', fontWeight: 700, marginBottom: 4 }}>
                        3D SIMULATOR & INSTANT ESTIMATE
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
                        {activeColumn.simulatorCta.label}
                      </div>
                      <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
                        {activeColumn.simulatorCta.hint}
                      </div>
                    </div>
                    <button
                      onClick={() => navigateTo(activeColumn.simulatorCta.planId || 'simulator')}
                      className="btn-accent"
                      style={{ fontSize: 15, padding: '14px 28px' }}
                    >
                      <Box size={18} />
                      <span>3Dシミュレーターを開く</span>
                    </button>
                  </div>
                )}

              </article>
            </div>
          ) : (
            <div>
              {/* 検索・カテゴリフィルター */}
              <div style={{
                background: '#ffffff',
                borderRadius: 14,
                padding: '20px 24px',
                border: '1px solid #e2e8f0',
                marginBottom: 32,
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                {/* 検索バー */}
                <div style={{ position: 'relative' }}>
                  <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="キーワードで検索（例: 市街化調整区域、変形地、結露、固定資産税、農機具倉庫...）"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 42px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                      outline: 'none',
                      background: '#f8fafc'
                    }}
                  />
                </div>

                {/* カテゴリタグ */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 20,
                        fontSize: 12.5,
                        fontWeight: selectedCategory === cat ? 800 : 600,
                        border: 'none',
                        cursor: 'pointer',
                        background: selectedCategory === cat ? 'var(--color-primary)' : '#f1f5f9',
                        color: selectedCategory === cat ? '#ffffff' : '#475569',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {cat === 'all' ? 'すべて (' + columns.length + ')' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* コラム記事グリッド */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 24
              }}>
                {filteredColumns.map(col => (
                  <div
                    key={col.id}
                    onClick={() => {
                      setSelectedColumnSlug(col.slug);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    style={{
                      background: '#ffffff',
                      borderRadius: 14,
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.03)';
                    }}
                  >
                    {/* アイキャッチ画像 */}
                    <div style={{ height: 170, overflow: 'hidden', background: '#0f172a', position: 'relative' }}>
                      <img
                        src={col.heroImage || '/assets/plans/plan01.jpg'}
                        alt={col.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                      <div style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        background: 'rgba(15, 23, 42, 0.85)',
                        color: '#38bdf8',
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 4,
                        backdropFilter: 'blur(4px)'
                      }}>
                        {col.badge || col.category}
                      </div>
                    </div>

                    {/* 記事テキスト */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 11.5, color: '#64748b', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock size={13} />
                          <span>{col.readTime}</span>
                          <span>•</span>
                          <span>{col.publishedDate}</span>
                        </div>

                        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', lineHeight: 1.45, marginBottom: 10 }}>
                          {col.title}
                        </h3>

                        <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: '0 0 14px' }}>
                          {col.description.length > 80 ? col.description.substring(0, 80) + '...' : col.description}
                        </p>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: 12,
                        borderTop: '1px solid #f1f5f9',
                        color: 'var(--color-primary)',
                        fontSize: 13,
                        fontWeight: 700
                      }}>
                        <span>記事を読む</span>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      )}

      {/* =========================================================
          TAB 2: 木造ガレージ物語連載（既存ストーリー機能）
         ========================================================= */}
      {mainTab === 'stories' && (
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 24px 80px' }}>
          
          {/* 連載話数セレクター */}
          <div style={{
            display: 'flex',
            gap: 10,
            overflowX: 'auto',
            paddingBottom: 16,
            marginBottom: 32
          }}>
            {stories.map(story => {
              const pub = isStoryPublished(story);
              const isSelected = story.id === activeStory?.id;
              return (
                <button
                  key={story.id}
                  onClick={() => handleSelectStory(story)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 10,
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid #cbd5e1',
                    background: isSelected ? '#ffffff' : '#f1f5f9',
                    color: isSelected ? 'var(--color-primary-dark)' : '#64748b',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: 13.5,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <span>第{story.episodeNum}話</span>
                  {pub ? (
                    <span style={{ fontSize: 10.5, color: '#16a34a', background: '#dcfce7', padding: '1px 5px', borderRadius: 4 }}>公開中</span>
                  ) : (
                    <span style={{ fontSize: 10.5, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Lock size={10} /> 予約
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ストーリー本文カード */}
          <article style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: '36px 32px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
            marginBottom: 36
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 6 }}>
              {activeStory.phase}
            </div>
            <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>
              {activeStory.title}
            </h2>

            {/* ストーリー本文 */}
            <div style={{ fontSize: 15.5, color: '#334155', lineHeight: 1.9, whiteSpace: 'pre-line', marginBottom: 30 }}>
              {activeStory.plot}
            </div>

            {/* セリフハイライト */}
            {activeStory.dialogue && (
              <div style={{
                background: '#f8fafc',
                borderLeft: '4px solid var(--color-primary)',
                padding: '16px 20px',
                borderRadius: '0 8px 8px 0',
                fontSize: 15,
                fontWeight: 700,
                color: '#0f172a',
                fontStyle: 'italic',
                marginBottom: 32
              }}>
                「{activeStory.dialogue}」
              </div>
            )}

            {/* 読者参加型アンケート */}
            {activeStory.quizEnabled && (
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
                borderRadius: 12,
                padding: '24px 26px',
                border: '1px solid #bbf7d0',
                marginBottom: 30
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a', fontWeight: 800, fontSize: 14, marginBottom: 10 }}>
                  <Vote size={18} />
                  <span>読者参加型 価格予想アンケート</span>
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
                  {activeStory.quizQuestion}
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 16 }}>
                  {activeStory.quizOptions.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => {
                        setUserSelectedQuizOption(opt);
                        setShowAnswer(true);
                      }}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 8,
                        border: userSelectedQuizOption === opt ? '2px solid #16a34a' : '1px solid #cbd5e1',
                        background: userSelectedQuizOption === opt ? '#dcfce7' : '#ffffff',
                        color: '#0f172a',
                        fontWeight: 600,
                        fontSize: 13.5,
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {showAnswer && (
                  <div style={{ background: '#ffffff', borderRadius: 8, padding: '14px 18px', border: '1px solid #86efac', marginTop: 12 }}>
                    <div style={{ fontWeight: 800, color: '#166534', fontSize: 14, marginBottom: 4 }}>
                      💡 {activeStory.quizAnswerHint}
                    </div>
                    <button
                      onClick={() => navigateTo('simulator')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-primary)',
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: 'pointer',
                        padding: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        marginTop: 4
                      }}
                    >
                      <span>3Dシミュレーターで答え合わせしてみる</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 共有ボタン */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, borderTop: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                {activeStory.hashtags}
              </div>
              <button
                onClick={handleCopyShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Share2 size={14} />
                <span>{copiedUrl ? 'URLをコピーしました！' : 'この話をシェア'}</span>
              </button>
            </div>

          </article>
        </div>
      )}

    </div>
  );
}
