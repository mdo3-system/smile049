import React, { useState } from 'react';
import EieHeader from '../components/eie/EieHeader';
import EieHeroSection from '../components/eie/EieHeroSection';
import EieInspectionCtaSection from '../components/eie/EieInspectionCtaSection';
import EieWifePerspectiveSection from '../components/eie/EieWifePerspectiveSection';
import EieStrengthsSection from '../components/eie/EieStrengthsSection';
import EieContactFormSection from '../components/eie/EieContactFormSection';
import EieFooter from '../components/eie/EieFooter';
import RenoveBeforeAfterSlider from '../components/RenoveBeforeAfterSlider';
import SubsidyFinderSection from '../components/SubsidyFinderSection';
import MortgageFinderSection from '../components/MortgageFinderSection';
import Plan3dAiModal from '../components/Plan3dAiModal';

/**
 * EIE不動産（スマイチ不動産事業部）専用LPページ
 * 
 * 単一責任の原則（SRP）に基づくオーケストレーター設計:
 * - 本コンポーネントの責任: ページのセクションレイアウトの組み立て、および共通モーダル状態の統括
 * - 各UIセクション（ヘッダー、ヒーロー、図面3D内覧CTA、妻目線リノベ提案、補助金ナビ、住宅ローン、強み、お問い合わせ、フッター）は
 *   独立した単一責任コンポーネントとして分離・管理されています。
 */
export default function EieRealEstatePage({ onNavigate }) {
  const [isPlan3dModalOpen, setIsPlan3dModalOpen] = useState(false);

  const handleOpenPlan3dModal = () => setIsPlan3dModalOpen(true);
  const handleClosePlan3dModal = () => setIsPlan3dModalOpen(false);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 antialiased font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. ヘッダーナビゲーション */}
      <EieHeader 
        onNavigate={onNavigate} 
        onOpenPlan3dModal={handleOpenPlan3dModal} 
      />

      {/* 2. ヒーローセクション（3大アクション、1枚漫画、新築vs中古比較、2大セット提案） */}
      <EieHeroSection 
        onOpenPlan3dModal={handleOpenPlan3dModal} 
      />

      {/* 3. セカンドコンタクト ＆ 内覧同行CTAセクション（チラシ3D化 ➔ 現地同行） */}
      <EieInspectionCtaSection 
        onOpenPlan3dModal={handleOpenPlan3dModal} 
      />

      {/* 4. Before / After 劇的リフォームスライダー */}
      <RenoveBeforeAfterSlider 
        onOpenModal={handleOpenPlan3dModal} 
      />

      {/* 5. 妻目線（家事・収納ストレス解放）4大リノベ提案（SVG図解・漫画吹き出し） */}
      <EieWifePerspectiveSection />

      {/* 6. 市町村別 中古住宅の補助金・助成金ナビ＆シミュレーター */}
      <SubsidyFinderSection 
        defaultRegion="saitama" 
        onOpenModal={handleOpenPlan3dModal} 
      />

      {/* 7. 住宅ローン金利一覧 ＆ 支払いシミュレーション ＆ 最適金融機関AIマッチングボット */}
      <MortgageFinderSection 
        onOpenModal={handleOpenPlan3dModal} 
      />

      {/* 8. なぜEIE不動産なのか？（建築士直営3つの強み） */}
      <EieStrengthsSection />

      {/* 9. お問い合わせ・無料相談フォーム */}
      <EieContactFormSection />

      {/* 10. 法定表示・フッター */}
      <EieFooter />

      {/* 販売図面AI 3D化 ＆ Stable Diffusion パース生成モーダル */}
      <Plan3dAiModal
        isOpen={isPlan3dModalOpen}
        onClose={handleClosePlan3dModal}
        mode="realestate"
      />
    </div>
  );
}
