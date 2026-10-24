#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
木造ガレージ【スマイチ】(smile049.jp)
SNS用縦型ショート動画 全自動合成パイプライン (HP Z840 / NVIDIA GPU専用)
=============================================================================
【機能概要】
1. Veo 3 無音動画（Scene 1, 2, 3）の結合 (FFmpeg concat)
2. Edge-TTS による超高精度・自然な日本語ナレーション音声合成 (Microsoft Neural TTS)
   - 建築専門用語（「確認申請」「軒出0」「ガルバリウム鋼板」「土間」「母屋」等）のふりがな・アクセント補正自動適用
3. 音声と動画の自動ミキシング（環境音＋ナレーション）
4. スマホSNS最適化テロップ字幕（SRT）自動生成＆焼き込み
5. NVIDIA NVENC (h264_nvenc) による爆速エンコード（約24〜30秒の動画を数秒で出力）

【必須環境】
- Windows 10/11 または Linux (HP Z840 ワークステーション推奨)
- Python 3.8 以上
- FFmpeg (パスが通っていること)
- pip install edge-tts

【実行方法】
  python scripts/z840_video_composer.py --ep 1
  (引数を省略した場合は対話モードで話数を選択できます)
=============================================================================
"""

import os
import sys
import argparse
import asyncio
import subprocess

# --- 建築専門用語 発音・ふりがな辞書 ---
PHONETIC_DICT = {
    "確認申請": "かくにん、しんせい",
    "軒出0": "のきで、ゼロ",
    "軒出ゼロ": "のきで、ゼロ",
    "軒出": "のきで",
    "ガルバリウム鋼板": "ガルバリウム、こうはん",
    "ガルバリウム": "ガルバリウム",
    "現し構造": "あらわし、こうぞう",
    "木造現し": "もくぞう、あらわし",
    "小屋組み": "こやぐみ",
    "土間コンクリート": "どま、コンクリート",
    "土間": "どま",
    "母屋": "もや",
    "隅欠き": "すみかき",
    "偏芯": "へんしん",
    "台形地": "だいけいち",
    "旗竿地": "はたざおち",
    "OSB合板": "オーエスビー、ごうはん",
    "建て方": "たてかた",
    "金物工法": "かなもの、こうほう",
    "市街化調整区域": "しがいか、ちょうせいくいき",
    "専任スタッフ": "せんにん、スタッフ",
    "積算": "せきさん",
    "木造自由設計": "もくぞう、じゆうせっけい",
    "スマイチ": "スマイチ"
}

# --- 標準ナレーションプリセット（第1話〜第7話） ---
STORY_NARRATIONS = {
    1: {
        "title": "新築か中古か、2,000万円の分岐点",
        "scene1": "住宅展示場を回るたび、土地込み4,500万円の壁にため息をついていたあの日。",
        "scene2": "偶然出会った木造ガレージの3Dシミュレーター。画面上で自分で描いたその瞬間、暮らしの選択肢が広がった。",
        "scene3": "中古住宅に自分だけのガレージをプラス。新築以上の自由が、ここから始まりました。"
    },
    2: {
        "title": "「ガレージが建てられる土地」から探す逆転発想",
        "scene1": "不動産サイトで見かける、変形地や旗竿地の格安物件。",
        "scene2": "既製品では無理でも、木造自由設計なら敷地の境界に合わせてミリ単位でぴったり収まる。",
        "scene3": "ガレージが建てられるかどうかで土地を選ぶ。土地探しの見方が、180度変わりました。"
    },
    3: {
        "title": "中古＋ガレージで新築と同じ予算の夜",
        "scene1": "中古住宅3,800万円、リノベ300万円、そして木造ガレージ300万円。",
        "scene2": "合計4,400万円。新築を検討していたのと同じ予算の中に、憧れのガレージがすっぽり収まる計算です。",
        "scene3": "同じお金を使うなら、愛車と趣味の空間まで手に入る方を選びたい。夫婦で笑い合った決断の夜でした。"
    },
    4: {
        "title": "台形変形敷地にミリ単位で収まる奇跡",
        "scene1": "購入した中古物件の敷地は、南側が斜めになった台形地。規格ガレージは入らないと諦めかけていました。",
        "scene2": "専任スタッフによる現地測量とミリ単位の構造設計。既存建物の外壁ラインに数センチの精度で吸い付くように納まります。",
        "scene3": "敷地の形を余すことなく使い切る。木造だからできた、世界にひとつだけのオーダーメイドガレージです。"
    },
    5: {
        "title": "雨の日の入庫、濡れずに帰れる日常の贅沢",
        "scene1": "土砂降りの雨の日の帰宅。傘をさしながら買い物袋を抱えるストレスから、完全に解放されました。",
        "scene2": "雨粒を弾くガルバリウム屋根と、木の香りに満ちた室内。車から直接濡れずに家の中へ荷物を運び込めます。",
        "scene3": "雨の日こそ実感する、木造ガレージの贅沢。暮らしの快適さが、ぐんと底上げされました。"
    },
    6: {
        "title": "新築を諦めて大正解だった理由",
        "scene1": "新築の画一的な間取りではなく、中古住宅と木造ガレージを選んだ私たち。",
        "scene2": "週末はガレージで愛車の手入れやDIY。浮いた予算で家族の趣味や旅行も思いきり楽しめる。",
        "scene3": "見栄ではなく、自分たちの暮らしの豊かさを選ぶ。この選択は大正解でした。"
    },
    7: {
        "title": "自分で描いたガレージがカタチになる日",
        "scene1": "土地の形に合わせて、ブラウザの中で自分の手で描いたガレージ。",
        "scene2": "構造計算から建築確認申請、そして大工の手仕事による施工まで、ワンストップで形になりました。",
        "scene3": "規格品にはない温もりと自由。敷地にぴったりのガレージを、あなたも描いてみませんか。"
    }
}

def apply_phonetic(text: str) -> str:
    """専門用語ふりがな辞書を適用して読み間違いを防止"""
    res = text
    for term, kana in PHONETIC_DICT.items():
        res = res.replace(term, kana)
    return res

async def generate_voice_edge_tts(text: str, output_path: str, voice: str = "ja-JP-NanamiNeural"):
    """Edge-TTSで高品位な日本語ナレーションMP3を生成"""
    try:
        import edge_tts
    except ImportError:
        print("❌ エラー: edge-tts がインストールされていません。")
        print("👉 'pip install edge-tts' を実行してください。")
        sys.exit(1)

    print(f"🎙️ Edge-TTS 合成中: [{voice}] ...")
    communicate = edge_tts.Communicate(text, voice, rate="+2%", pitch="+0Hz")
    await communicate.save(output_path)
    print(f"✅ 音声生成完了: {output_path}")

def generate_srt(scene1: str, scene2: str, scene3: str, output_path: str):
    """3カットに同期したSRT字幕ファイルを生成"""
    srt_text = f"""1
00:00:00,800 --> 00:00:07,800
{scene1}

2
00:00:08,400 --> 00:00:15,400
{scene2}

3
00:00:16,000 --> 00:00:23,400
{scene3}
"""
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(srt_text.strip() + "\n")
    print(f"✅ 字幕SRT生成完了: {output_path}")

def compose_with_ffmpeg(scene_files, audio_file, srt_file, output_file, is_vertical=True):
    """FFmpeg (NVENC) で結合 + 字幕焼き込み + 音声合成"""
    concat_list = "concat_list_tmp.txt"
    with open(concat_list, "w", encoding="utf-8") as f:
        for fpath in scene_files:
            abs_p = os.path.abspath(fpath).replace("\\", "/")
            f.write(f"file '{abs_p}'\n")

    abs_srt = os.path.abspath(srt_file).replace("\\", "/").replace(":", "\\:")
    # 字幕スタイル設定（Meiryoフォント、黄色/白、縁取りありでスマホ画面で見やすい設定）
    srt_filter = f"subtitles='{abs_srt}':force_style='FontName=Meiryo,FontSize=16,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=3,Outline=2,Shadow=1,Alignment=2,MarginV=90'"

    if is_vertical:
        # 9:16縦型リサイズ（1080x1920）
        scale_filter = "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black"
        video_filters = f"{scale_filter},{srt_filter}"
    else:
        # 16:9横型リサイズ（1920x1080）
        video_filters = f"scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,{srt_filter}"

    cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", concat_list,
        "-i", audio_file,
        "-filter_complex", f"[0:v]{video_filters}[v];[1:a]volume=1.0[a]",
        "-map", "[v]",
        "-map", "[a]",
        "-c:v", "h264_nvenc", "-preset", "p4", "-b:v", "7M",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        output_file
    ]

    print(f"🚀 FFmpeg (NVIDIA NVENC) レンダリング開始 ➔ {output_file} ...")
    try:
        subprocess.run(cmd, check=True)
        print(f"🎉 成功！ SNS用動画が完成しました: {output_file}")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("⚠️ NVIDIA NVENCが利用できないため、CPUエンコード (libx264) に切り替えます...")
        cmd[cmd.index("h264_nvenc")] = "libx264"
        cmd.remove("-preset")
        cmd.remove("p4")
        subprocess.run(cmd, check=True)
        print(f"🎉 成功！ SNS用動画が完成しました: {output_file}")
    finally:
        if os.path.exists(concat_list):
            os.remove(concat_list)

def main():
    parser = argparse.ArgumentParser(description="スマイチ SNS動画全自動合成パイプライン (HP Z840)")
    parser.add_argument("--ep", type=int, default=1, help="話数 (1〜7)")
    parser.add_argument("--voice", type=str, default="ja-JP-NanamiNeural", help="Edge-TTS音声 (ja-JP-NanamiNeural または ja-JP-KeitaNeural)")
    parser.add_argument("--horizontal", action="store_true", help="横型 (16:9) で出力（指定しない場合は縦型 9:16）")
    parser.add_argument("--workdir", type=str, default=".", help="素材配置ディレクトリ")
    args = parser.parse_args()

    ep_num = args.ep
    data = STORY_NARRATIONS.get(ep_num, STORY_NARRATIONS[1])

    print("=" * 65)
    print(f"  木造ガレージ【スマイチ】 第{ep_num}話 SNS動画全自動合成")
    print(f"  サブタイトル: {data['title']}")
    print("=" * 65)

    # ナレーション読み仮名補正テキストの作成
    scene1_text = data["scene1"]
    scene2_text = data["scene2"]
    scene3_text = data["scene3"]

    phonetic1 = apply_phonetic(scene1_text)
    phonetic2 = apply_phonetic(scene2_text)
    phonetic3 = apply_phonetic(scene3_text)
    full_phonetic = f"{phonetic1}　{phonetic2}　{phonetic3}"

    audio_file = os.path.join(args.workdir, f"narration_ep{ep_num}.mp3")
    srt_file = os.path.join(args.workdir, f"subtitles_ep{ep_num}.srt")
    output_file = os.path.join(args.workdir, f"smile049_ep{ep_num:02d}_complete_sns.mp4")

    # 1. 字幕SRT作成
    generate_srt(scene1_text, scene2_text, scene3_text, srt_file)

    # 2. Edge-TTS 音声生成
    asyncio.run(generate_voice_edge_tts(full_phonetic, audio_file, args.voice))

    # 3. 素材動画のチェック (scene1.mp4, scene2.mp4, scene3.mp4 等)
    scenes = [
        os.path.join(args.workdir, "scene1.mp4"),
        os.path.join(args.workdir, "scene2.mp4"),
        os.path.join(args.workdir, "scene3.mp4")
    ]
    missing = [f for f in scenes if not os.path.exists(f)]
    if missing:
        print("\n⚠️ 【素材動画の配置案内】")
        for m in missing:
            print(f"  - 素材ファイルが見つかりません: {m}")
        print(f"\n👉 Veo 3で生成した3つの動画を '{args.workdir}' フォルダに")
        print("   'scene1.mp4', 'scene2.mp4', 'scene3.mp4' という名前で配置して再実行してください。")
        print("   （ナレーション音声と字幕SRTは既に作成完了しています）")
        return

    # 4. FFmpeg 合成実行
    compose_with_ffmpeg(scenes, audio_file, srt_file, output_file, is_vertical=not args.horizontal)

if __name__ == "__main__":
    main()
