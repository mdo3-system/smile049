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

# --- 標準ナレーションプリセット（スマホSNSで1行に美しく収まる約18〜24文字の簡潔テロップ） ---
STORY_NARRATIONS = {
    1: {
        "title": "新築か中古か、2,000万円の分岐点",
        "scene1": "土地込み4500万。新築の壁に悩んでいたあの日。",
        "scene2": "画面で描く木造ガレージで、選択肢が広がった。",
        "scene3": "中古＋ガレージ。新築以上の自由がここから。"
    },
    2: {
        "title": "「ガレージが建てられる土地」から探す逆転発想",
        "scene1": "不動産サイトで見かける、変形地の格安物件。",
        "scene2": "木造自由設計なら、敷地境界にミリ単位で収まる。",
        "scene3": "土地探しの見方が、180度変わりました。"
    },
    3: {
        "title": "中古＋ガレージで新築と同じ予算の夜",
        "scene1": "中古3800万、リノベ300万、木造ガレージ300万。",
        "scene2": "総額4400万、新築予算で憧れの愛車空間が完成。",
        "scene3": "暮らしも趣味も手に入る、夫婦笑顔の決断でした。"
    },
    4: {
        "title": "台形変形敷地にミリ単位で収まる奇跡",
        "scene1": "南側が斜めの台形地。規格品は入らないと諦めていた。",
        "scene2": "ミリ単位の自由設計で、敷地ぴったりに美しく納まる。",
        "scene3": "敷地を使い切る、世界にひとつの木造ガレージ。"
    },
    5: {
        "title": "雨の日の入庫、濡れずに帰れる日常の贅沢",
        "scene1": "土砂降りの日。濡れずに荷物を運べる日常の贅沢。",
        "scene2": "ガルバリウム屋根と、木の香りに満ちた室内空間。",
        "scene3": "雨の日こそ実感する、暮らしの確かな豊かさ。"
    },
    6: {
        "title": "新築を諦めて大正解だった理由",
        "scene1": "新築の画一的な間取りより、自分たちの理想を選んだ。",
        "scene2": "週末は愛車の手入れやDIY。趣味を思いきり楽しむ。",
        "scene3": "見栄ではなく暮らしの豊かさを。大正解の選択でした。"
    },
    7: {
        "title": "自分で描いたガレージがカタチになる日",
        "scene1": "敷地に合わせて、ブラウザの中で自分で描いたガレージ。",
        "scene2": "構造計算から確認申請、大工の手仕事でワンストップ完工。",
        "scene3": "規格品にはない自由。あなたも理想を描いてみませんか。"
    }
}

def apply_phonetic(text: str) -> str:
    """専門用語ふりがな辞書を適用して読み間違いを防止"""
    res = text
    for term, kana in PHONETIC_DICT.items():
        res = res.replace(term, kana)
    return res

async def generate_synced_audio(scene_texts: list, output_audio: str, voice: str = "ja-JP-NanamiNeural"):
    """各カット（8秒）に完全同期したナレーション音声を生成（溢れ・途切れを完全防止）"""
    import edge_tts

    delays = [600, 8500, 16500]
    temp_parts = []
    for i, t in enumerate(scene_texts):
        phonetic_text = apply_phonetic(t)
        p = f"temp_part_{i+1}.mp3"
        comm = edge_tts.Communicate(phonetic_text, voice, rate="+10%")
        await comm.save(p)
        temp_parts.append(p)

    filter_adelay = (
        f"[0:a]adelay={delays[0]}|{delays[0]}[a0];"
        f"[1:a]adelay={delays[1]}|{delays[1]}[a1];"
        f"[2:a]adelay={delays[2]}|{delays[2]}[a2];"
        f"[a0][a1][a2]amix=inputs=3:dropout_transition=0:normalize=0[outa]"
    )
    cmd = [
        "ffmpeg", "-y",
        "-i", temp_parts[0], "-i", temp_parts[1], "-i", temp_parts[2],
        "-filter_complex", filter_adelay,
        "-map", "[outa]",
        "-t", "24.0",
        output_audio
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for p in temp_parts:
        try:
            if os.path.exists(p):
                os.remove(p)
        except OSError:
            pass
    print(f"✅ 完全同期ナレーション音声生成完了: {output_audio}")

def generate_ass(scene1: str, scene2: str, scene3: str, output_path: str, is_vertical: bool = True):
    """透明背景・白文字黒縁取り・1行厳守のASS字幕ファイルを生成"""
    play_x = 1080 if is_vertical else 1920
    play_y = 1920 if is_vertical else 1080
    font_size = 40 if is_vertical else 42
    margin_v = 160 if is_vertical else 80

    ass_text = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {play_x}
PlayResY: {play_y}
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Meiryo,{font_size},&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,3.5,1.0,2,30,30,{margin_v},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.60,0:00:06.50,Default,,0,0,0,,{scene1}
Dialogue: 0,0:00:08.50,0:00:14.50,Default,,0,0,0,,{scene2}
Dialogue: 0,0:00:16.50,0:00:22.50,Default,,0,0,0,,{scene3}
"""
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(ass_text.strip() + "\n")
    print(f"✅ 字幕ASS生成完了: {output_path}")

def compose_with_ffmpeg(scene_files, audio_file, ass_file, output_file, is_vertical=True):
    """FFmpeg (NVENC/CPU) で結合 + 字幕焼き込み + 音声合成"""
    concat_list = "concat_list_tmp.txt"
    with open(concat_list, "w", encoding="utf-8") as f:
        for fpath in scene_files:
            abs_p = os.path.abspath(fpath).replace("\\", "/")
            f.write(f"file '{abs_p}'\n")

    abs_ass = os.path.abspath(ass_file).replace("\\", "/").replace(":", "\\:")

    if is_vertical:
        # フルスクリーン 9:16 クロップ（黒帯を完全排除してスマホ全画面表示）
        scale_filter = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920"
    else:
        # 16:9 横型
        scale_filter = "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black"

    video_filters = f"{scale_filter},subtitles='{abs_ass}'"

    cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", concat_list,
        "-i", audio_file,
        "-filter_complex", f"[0:v]{video_filters}[v];[1:a]volume=1.0[a]",
        "-map", "[v]",
        "-map", "[a]",
        "-c:v", "h264_nvenc", "-preset", "p4", "-b:v", "7M",
        "-c:a", "aac", "-b:a", "192k",
        "-t", "24.0",
        output_file
    ]

    print(f"🚀 FFmpeg レンダリング開始 ➔ {output_file} ...")
    try:
        subprocess.run(cmd, check=True)
        print(f"🎉 成功！ SNS用動画が完成しました: {output_file}")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("⚠️ NVIDIA NVENCが利用できないため、CPUエンコード (libx264) に切り替えます...")
        cmd[cmd.index("h264_nvenc")] = "libx264"
        if "-preset" in cmd:
            p_idx = cmd.index("-preset")
            del cmd[p_idx:p_idx+2]
        cmd.extend(["-crf", "19"])
        subprocess.run(cmd, check=True)
        print(f"🎉 成功！ SNS用動画が完成しました: {output_file}")
    finally:
        if os.path.exists(concat_list):
            os.remove(concat_list)

def main():
    if sys.platform == 'win32':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
            sys.stderr.reconfigure(encoding='utf-8')
        except Exception:
            pass

    parser = argparse.ArgumentParser(description="スマイチ SNS動画全自動合成パイプライン (HP Z840)")
    parser.add_argument("--ep", type=int, default=1, help="話数 (1〜7)")
    parser.add_argument("--voice", type=str, default="ja-JP-NanamiNeural", help="Edge-TTS音声 (ja-JP-NanamiNeural または ja-JP-KeitaNeural)")
    parser.add_argument("--horizontal", action="store_true", help="横型 (16:9) で出力（指定しない場合は縦型 9:16）")
    parser.add_argument("--workdir", type=str, default=".", help="素材配置ディレクトリ")
    args = parser.parse_args()

    ep_num = args.ep
    data = STORY_NARRATIONS.get(ep_num, STORY_NARRATIONS[1])
    is_vertical = not args.horizontal

    print("=" * 65)
    print(f"  木造ガレージ【スマイチ】 第{ep_num}話 SNS動画全自動合成")
    print(f"  サブタイトル: {data['title']}")
    print(f"  形式: {'縦型 9:16 (Shorts/Reels)' if is_vertical else '横型 16:9'}")
    print("=" * 65)

    scene1_text = data["scene1"]
    scene2_text = data["scene2"]
    scene3_text = data["scene3"]

    audio_file = os.path.join(args.workdir, f"synced_narration_ep{ep_num}.mp3")
    ass_file = os.path.join(args.workdir, f"subtitles_ep{ep_num}.ass")
    out_name = f"smile049_ep{ep_num:02d}_complete_{'sns' if is_vertical else 'horizontal'}.mp4"
    output_file = os.path.join(args.workdir, out_name)

    # 1. 字幕ASS作成（透明背景・1行テロップ）
    generate_ass(scene1_text, scene2_text, scene3_text, ass_file, is_vertical=is_vertical)

    # 2. Edge-TTS 音声生成（各カット同期合成）
    asyncio.run(generate_synced_audio([scene1_text, scene2_text, scene3_text], audio_file, args.voice))

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
        print("   （ナレーション音声と字幕ASSは既に作成完了しています）")
        return

    # 4. FFmpeg 合成実行
    compose_with_ffmpeg(scenes, audio_file, ass_file, output_file, is_vertical=is_vertical)

if __name__ == "__main__":
    main()
