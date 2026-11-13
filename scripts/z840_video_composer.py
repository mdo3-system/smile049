#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
木造ガレージ【スマイチ】(smile049.jp)
SNS用ショート動画 全自動合成パイプライン (HP Z840 / NVIDIA GPU専用)
=============================================================================
【機能概要】
1. Google動画AI（Veo 3 / Gemini Omni Flash 15秒対応）素材の自動合成
   - 【15秒モード（最推奨）】1カット完結（結合不要・爆速レンダリング・高完走率）
   - 【30秒モード】15秒 × 2カット結合
   - 【24秒モード】8秒 × 3カット結合（従来互換）
2. Edge-TTS による超高精度・自然な日本語ナレーション音声合成 (Microsoft Neural TTS)
   - 建築専門用語のふりがな・アクセント補正自動適用
3. スマホSNS最適化テロップ字幕（ASS）自動生成＆焼き込み
   - 黒背景なし・白文字黒縁取り・60pxハイコントラスト・1行表示
4. NVIDIA NVENC (h264_nvenc) による爆速ハードウェアエンコード（数秒で出力）

【実行方法】
  # 15秒モード（推奨 / 素材: video_15s.mp4 または scene1.mp4）
  python scripts/z840_video_composer.py --ep 1 --mode 15s

  # 自動判別モード（フォルダ内の素材ファイル数から自動判定）
  python scripts/z840_video_composer.py --ep 1
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

# --- 15秒 1カット完結ナレーションプリセット（約40〜48文字・最推奨） ---
NARRATIONS_15S = {
    1: "新築4500万に悩んでいたあの日。中古住宅と木造自由設計ガレージで、同じ予算で新築以上の理想の暮らしが完成しました。",
    2: "不動産サイトの変形地や格安物件。ミリ単位で土地に合わせる木造自由設計なら、土地探しの選択肢が180度広がります。",
    3: "中古3800万、リノベ300万、ガレージ300万。新築と同じ予算で憧れの愛車空間が手に入った、夫婦笑顔の決断でした。",
    4: "南側が斜めの台形変形地。既製品は無理と言われた場所に、数センチ単位でジャストフィットする木造の奇跡。",
    5: "土砂降りの雨でも濡れずに玄関へ。ガルバリウム屋根と木の香りに包まれる、雨の日こそ実感する日常の贅沢。",
    6: "画一的な新築建売より、自分たちの理想を選んだ。見栄ではなく日々の豊かな暮らしを手に入れた、大正解の選択。",
    7: "敷地に合わせてスマホで自分で描いたガレージ。構造計算から確認申請、大工の手仕事で理想がカタチになりました。"
}

# --- 30秒 2カットストーリーナレーションプリセット ---
NARRATIONS_30S = {
    1: {
        "cut1": "週末のたび住宅展示場を回り、土地込み4500万の壁に悩んでいたあの日。本当に新築しかないのか疑問でした。",
        "cut2": "中古住宅に木造自由設計ガレージをプラス。同じ予算で新築以上の自由と憧れの愛車空間が完成しました。"
    },
    2: {
        "cut1": "不動産サイトで見かける、斜めの台形地や格安物件。既製品の物置やガレージは入らないと諦めていませんか？",
        "cut2": "スマイチの木造自由設計なら、敷地境界にミリ単位でジャストフィット。土地探しの見方が180度変わります。"
    },
    3: {
        "cut1": "新築4500万と、中古3800万＋リノベ300万＋ガレージ300万。夜更けに計算した総額はほぼ同じ4400万円でした。",
        "cut2": "同じ予算をかけるなら、憧れのガレージまで手に入る選択を。暮らしも趣味も手に入った夫婦笑顔の決断です。"
    },
    4: {
        "cut1": "南側が斜めに変形した台形敷地。どのメーカーにも「規格品は絶対に入りません」と断られていた場所でした。",
        "cut2": "既存建物のラインに合わせ、ミリ単位で設計された木造ガレージ。敷地を隅々まで使い切る奇跡の納まりが完成。"
    },
    5: {
        "cut1": "土砂降りの大雨の日。買い出し帰りの重い荷物を抱えて、傘を差しながら濡れて走るストレスを感じていませんか？",
        "cut2": "ガレージから濡れずに玄関へ。静かな雨音と木の香りに包まれる空間で、雨の日こそ暮らしの豊かさを実感します。"
    },
    6: {
        "cut1": "ハウスメーカーの画一的な間取りで新築を建てるより、自分たち家族が本当にワクワクする日常を選びました。",
        "cut2": "週末は愛車の手入れやDIY。見栄ではなく毎日の心豊かな暮らしを手に入れた、大正解のマイホーム計画でした。"
    },
    7: {
        "cut1": "敷地の形に合わせて、スマホの3Dシミュレーターで自分で描いた木造ガレージ。リアルタイムで積算も確認できます。",
        "cut2": "構造計算から確認申請、熟練大工の手仕事まで完全ワンストップ施工。規格品にはない自由をあなたも体験しませんか。"
    }
}

# --- 24秒 3カット従来プリセット ---
NARRATIONS_24S = {
    1: { "scene1": "土地込み4500万。新築の壁に悩んでいたあの日。", "scene2": "画面で描く木造ガレージで、選択肢が広がった。", "scene3": "中古＋ガレージ。新築以上の自由がここから。" },
    2: { "scene1": "不動産サイトで見かける、変形地の格安物件。", "scene2": "木造自由設計なら、敷地境界にミリ単位で収まる。", "scene3": "土地探しの見方が、180度変わりました。" },
    3: { "scene1": "中古3800万、リノベ300万、木造ガレージ300万。", "scene2": "総額4400万、新築予算で憧れの愛車空間が完成。", "scene3": "暮らしも趣味も手に入る、夫婦笑顔の決断でした。" },
    4: { "scene1": "南側が斜めの台形地。規格品は入らないと諦めていた。", "scene2": "ミリ単位の自由設計で、敷地ぴったりに美しく納まる。", "scene3": "敷地を使い切る、世界にひとつの木造ガレージ。" },
    5: { "scene1": "土砂降りの日。濡れずに荷物を運べる日常の贅沢。", "scene2": "ガルバリウム屋根と、木の香りに満ちた室内空間。", "scene3": "雨の日こそ実感する、暮らしの確かな豊かさ。" },
    6: { "scene1": "新築の画一的な間取りより、自分たちの理想を選んだ。", "scene2": "週末は愛車の手入れやDIY。趣味を思いきり楽しむ。", "scene3": "見栄ではなく暮らしの豊かさを。大正解の選択でした。" },
    7: { "scene1": "敷地に合わせて、ブラウザの中で自分で描いたガレージ。", "scene2": "構造計算から確認申請、大工の手仕事でワンストップ完工。", "scene3": "規格品にはない自由。あなたも理想を描いてみませんか。" }
}

def apply_phonetic(text: str) -> str:
    res = text
    for term, kana in PHONETIC_DICT.items():
        res = res.replace(term, kana)
    return res

async def generate_audio_15s(text: str, output_audio: str, voice: str = "ja-JP-NanamiNeural"):
    import edge_tts
    phonetic_text = apply_phonetic(text)
    temp_p = "temp_narration_15s.mp3"
    comm = edge_tts.Communicate(phonetic_text, voice, rate="+10%")
    await comm.save(temp_p)

    cmd = [
        "ffmpeg", "-y",
        "-i", temp_p,
        "-filter_complex", "[0:a]adelay=600|600[a0];[a0]amix=inputs=1[outa]",
        "-map", "[outa]",
        "-t", "15.0",
        output_audio
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(temp_p):
        os.remove(temp_p)
    print(f"✅ 15秒ナレーション音声生成完了: {output_audio}")

def generate_ass_15s(text: str, output_path: str, is_vertical: bool = True):
    play_x = 1080 if is_vertical else 1920
    play_y = 1920 if is_vertical else 1080
    font_size = 60 if is_vertical else 56
    margin_v = 180 if is_vertical else 90

    ass_text = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {play_x}
PlayResY: {play_y}
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Meiryo,{font_size},&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,4.5,1.0,2,24,24,{margin_v},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.60,0:00:13.80,Default,,0,0,0,,{text}
"""
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(ass_text.strip() + "\n")
    print(f"✅ 15秒字幕ASS生成完了: {output_path}")

async def generate_synced_audio_multi(scene_texts: list, delays: list, duration: float, output_audio: str, voice: str = "ja-JP-NanamiNeural"):
    import edge_tts
    temp_parts = []
    for i, t in enumerate(scene_texts):
        phonetic_text = apply_phonetic(t)
        p = f"temp_part_{i+1}.mp3"
        comm = edge_tts.Communicate(phonetic_text, voice, rate="+10%")
        await comm.save(p)
        temp_parts.append(p)

    filter_chains = []
    inputs_mix = []
    for i, d in enumerate(delays):
        filter_chains.append(f"[{i}:a]adelay={d}|{d}[a{i}]")
        inputs_mix.append(f"[a{i}]")

    filter_adelay = ";".join(filter_chains) + f";{''.join(inputs_mix)}amix=inputs={len(scene_texts)}:dropout_transition=0:normalize=0[outa]"

    cmd = ["ffmpeg", "-y"]
    for p in temp_parts:
        cmd.extend(["-i", p])
    cmd.extend([
        "-filter_complex", filter_adelay,
        "-map", "[outa]",
        "-t", str(duration),
        output_audio
    ])
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for p in temp_parts:
        if os.path.exists(p):
            os.remove(p)
    print(f"✅ 連動ナレーション音声生成完了: {output_audio}")

def generate_ass_multi(dialogues: list, output_path: str, is_vertical: bool = True):
    play_x = 1080 if is_vertical else 1920
    play_y = 1920 if is_vertical else 1080
    font_size = 60 if is_vertical else 56
    margin_v = 180 if is_vertical else 90

    lines = [
        "[Script Info]", "ScriptType: v4.00+", f"PlayResX: {play_x}", f"PlayResY: {play_y}", "ScaledBorderAndShadow: yes", "",
        "[V4+ Styles]", "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
        f"Style: Default,Meiryo,{font_size},&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,4.5,1.0,2,24,24,{margin_v},1", "",
        "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"
    ]
    for d in dialogues:
        lines.append(f"Dialogue: 0,{d['start']},{d['end']},Default,,0,0,0,,{d['text']}")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"✅ 字幕ASS生成完了: {output_path}")

def render_ffmpeg(input_video_or_concat, audio_file, ass_file, output_file, duration, is_concat=False, is_vertical=True):
    abs_ass = os.path.abspath(ass_file).replace("\\", "/").replace(":", "\\:")
    if is_vertical:
        scale_filter = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920"
    else:
        scale_filter = "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black"

    video_filters = f"{scale_filter},subtitles='{abs_ass}'"

    cmd = ["ffmpeg", "-y"]
    if is_concat:
        cmd.extend(["-f", "concat", "-safe", "0", "-i", input_video_or_concat])
    else:
        cmd.extend(["-i", input_video_or_concat])

    cmd.extend([
        "-i", audio_file,
        "-filter_complex", f"[0:v]{video_filters}[v];[1:a]volume=1.0[a]",
        "-map", "[v]",
        "-map", "[a]",
        "-c:v", "h264_nvenc", "-preset", "p4", "-b:v", "7M",
        "-c:a", "aac", "-b:a", "192k",
        "-t", str(duration),
        output_file
    ])

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

def main():
    if sys.platform == 'win32':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
            sys.stderr.reconfigure(encoding='utf-8')
        except Exception:
            pass

    parser = argparse.ArgumentParser(description="スマイチ SNS動画全自動合成パイプライン (HP Z840)")
    parser.add_argument("--ep", type=int, default=1, help="話数 (1〜7)")
    parser.add_argument("--mode", type=str, default="auto", choices=["auto", "15s", "30s", "24s"], help="合成モード: auto (自動判定) / 15s (1カット完結) / 30s (2カット) / 24s (3カット)")
    parser.add_argument("--voice", type=str, default="ja-JP-NanamiNeural", help="Edge-TTS音声 (ja-JP-NanamiNeural / ja-JP-KeitaNeural)")
    parser.add_argument("--horizontal", action="store_true", help="横型 (16:9) で出力（指定しない場合は縦型 9:16）")
    parser.add_argument("--workdir", type=str, default=".", help="素材配置ディレクトリ")
    args = parser.parse_args()

    ep_num = args.ep
    is_vertical = not args.horizontal
    workdir = args.workdir

    # 素材ファイルの存在確認
    f_15s = os.path.join(workdir, "video_15s.mp4")
    f_sc1 = os.path.join(workdir, "scene1.mp4")
    f_sc2 = os.path.join(workdir, "scene2.mp4")
    f_sc3 = os.path.join(workdir, "scene3.mp4")

    # モード自動判定
    selected_mode = args.mode
    if selected_mode == "auto":
        if os.path.exists(f_15s) or (os.path.exists(f_sc1) and not os.path.exists(f_sc2)):
            selected_mode = "15s"
        elif os.path.exists(f_sc1) and os.path.exists(f_sc2) and not os.path.exists(f_sc3):
            selected_mode = "30s"
        else:
            selected_mode = "15s" # デフォルトを最推奨の15秒に

    print("=" * 65)
    print(f"  木造ガレージ【スマイチ】 第{ep_num}話 SNS動画全自動合成 (Z840)")
    print(f"  モード: {selected_mode.upper()} ｜ 形式: {'縦型 9:16 (Shorts/Reels)' if is_vertical else '横型 16:9'}")
    print("=" * 65)

    # 1. 15秒モード（最推奨）
    if selected_mode == "15s":
        text_15s = NARRATIONS_15S.get(ep_num, NARRATIONS_15S[1])
        audio_file = os.path.join(workdir, f"synced_narration_ep{ep_num}_15s.mp3")
        ass_file = os.path.join(workdir, f"subtitles_ep{ep_num}_15s.ass")
        output_file = os.path.join(workdir, f"smile049_ep{ep_num:02d}_15s_{'sns' if is_vertical else 'horizontal'}.mp4")

        generate_ass_15s(text_15s, ass_file, is_vertical=is_vertical)
        asyncio.run(generate_audio_15s(text_15s, audio_file, voice=args.voice))

        input_video = f_15s if os.path.exists(f_15s) else f_sc1
        if not os.path.exists(input_video):
            print("\n⚠️ 【15秒素材動画の配置案内】")
            print(f"👉 Veoで生成した15秒動画を '{workdir}' に")
            print("   'video_15s.mp4' または 'scene1.mp4' として保存して再実行してください。")
            return

        render_ffmpeg(input_video, audio_file, ass_file, output_file, duration=15.0, is_concat=False, is_vertical=is_vertical)

    # 2. 30秒モード（2カット）
    elif selected_mode == "30s":
        p_30s = NARRATIONS_30S.get(ep_num, NARRATIONS_30S[1])
        audio_file = os.path.join(workdir, f"synced_narration_ep{ep_num}_30s.mp3")
        ass_file = os.path.join(workdir, f"subtitles_ep{ep_num}_30s.ass")
        output_file = os.path.join(workdir, f"smile049_ep{ep_num:02d}_30s_{'sns' if is_vertical else 'horizontal'}.mp4")

        dialogues = [
            {"start": "0:00:00.60", "end": "0:00:13.80", "text": p_30s["cut1"]},
            {"start": "0:00:15.60", "end": "0:00:28.80", "text": p_30s["cut2"]}
        ]
        generate_ass_multi(dialogues, ass_file, is_vertical=is_vertical)
        asyncio.run(generate_synced_audio_multi([p_30s["cut1"], p_30s["cut2"]], [600, 15600], 30.0, audio_file, voice=args.voice))

        if not (os.path.exists(f_sc1) and os.path.exists(f_sc2)):
            print("\n⚠️ 【30秒素材動画の配置案内】")
            print(f"👉 2本の15秒動画を 'scene1.mp4', 'scene2.mp4' として配置してください。")
            return

        concat_list = os.path.join(workdir, "concat_tmp.txt")
        with open(concat_list, "w", encoding="utf-8") as f:
            f.write(f"file '{os.path.abspath(f_sc1).replace('\\', '/')}'\n")
            f.write(f"file '{os.path.abspath(f_sc2).replace('\\', '/')}'\n")

        render_ffmpeg(concat_list, audio_file, ass_file, output_file, duration=30.0, is_concat=True, is_vertical=is_vertical)
        if os.path.exists(concat_list):
            os.remove(concat_list)

    # 3. 24秒モード（3カット従来型）
    elif selected_mode == "24s":
        p_24s = NARRATIONS_24S.get(ep_num, NARRATIONS_24S[1])
        audio_file = os.path.join(workdir, f"synced_narration_ep{ep_num}_24s.mp3")
        ass_file = os.path.join(workdir, f"subtitles_ep{ep_num}_24s.ass")
        output_file = os.path.join(workdir, f"smile049_ep{ep_num:02d}_24s_{'sns' if is_vertical else 'horizontal'}.mp4")

        dialogues = [
            {"start": "0:00:00.60", "end": "0:00:06.50", "text": p_24s["scene1"]},
            {"start": "0:00:08.50", "end": "0:00:14.50", "text": p_24s["scene2"]},
            {"start": "0:00:16.50", "end": "0:00:22.50", "text": p_24s["scene3"]}
        ]
        generate_ass_multi(dialogues, ass_file, is_vertical=is_vertical)
        asyncio.run(generate_synced_audio_multi([p_24s["scene1"], p_24s["scene2"], p_24s["scene3"]], [600, 8500, 16500], 24.0, audio_file, voice=args.voice))

        if not (os.path.exists(f_sc1) and os.path.exists(f_sc2) and os.path.exists(f_sc3)):
            print("\n⚠️ 【24秒素材動画の配置案内】")
            print(f"👉 3本の8秒動画を 'scene1.mp4', 'scene2.mp4', 'scene3.mp4' として配置してください。")
            return

        concat_list = os.path.join(workdir, "concat_tmp.txt")
        with open(concat_list, "w", encoding="utf-8") as f:
            f.write(f"file '{os.path.abspath(f_sc1).replace('\\', '/')}'\n")
            f.write(f"file '{os.path.abspath(f_sc2).replace('\\', '/')}'\n")
            f.write(f"file '{os.path.abspath(f_sc3).replace('\\', '/')}'\n")

        render_ffmpeg(concat_list, audio_file, ass_file, output_file, duration=24.0, is_concat=True, is_vertical=is_vertical)
        if os.path.exists(concat_list):
            os.remove(concat_list)

if __name__ == "__main__":
    main()
