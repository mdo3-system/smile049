<?php
/**
 * スマイチ (smile049.jp)
 * チャット問い合わせ・パース依頼 社内メール即時通知 API
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

$customerName = trim($data['customerName'] ?? 'ゲスト様');
$email = trim($data['email'] ?? '未入力');
$phone = trim($data['phone'] ?? '未入力');
$planType = trim($data['planType'] ?? '自由設計ガレージ');
$message = trim($data['message'] ?? '');
$roomId = trim($data['roomId'] ?? '不明');
$source = trim($data['source'] ?? 'Webチャット'); // 'chat' | 'parse_request'
$modelDataSummary = trim($data['modelDataSummary'] ?? '');

if (empty($message) && empty($modelDataSummary)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Message is empty']);
    exit;
}

// 送信先メールアドレス（3宛先）
$recipients = [
    'help@t-smile.co.jp',
    'keiri@t-smile.co.jp',
    'sato@t-smile.co.jp'
];
$to = implode(', ', $recipients);

// メール件名
$subject = "【スマイチWeb】{$customerName}から{$source}が届きました";

// 送信日時
$now = date('Y-m-d H:i:s');
$remoteIp = $_SERVER['REMOTE_ADDR'] ?? '不明';

// メール本文組み立て
$body = <<<EOD
============================================================
 木造自由設計ガレージ【スマイチ】Web問い合わせ通知
============================================================

【種別】: {$source}
【日時】: {$now}
【お名前】: {$customerName}
【メールアドレス】: {$email}
【電話番号】: {$phone}
【検討プラン】: {$planType}
【チャットルームID】: {$roomId}

------------------------------------------------------------
【メッセージ・相談内容】
------------------------------------------------------------
{$message}

EOD;

if (!empty($modelDataSummary)) {
    $body .= <<<EOD

------------------------------------------------------------
【3Dシミュレーター設計データ概要】
------------------------------------------------------------
{$modelDataSummary}

EOD;
}

$body .= <<<EOD

------------------------------------------------------------
【スタッフ管理画面・返信用URL】
https://smile049.jp/admin
※スタッフ用パスコード: smile049
※お客様とのやり取り・図面・パース納品は上記管理画面内で完結して行えます。

【公式LINE（更新通知専用）】
https://line.ee/8fdyyGu
------------------------------------------------------------
送信元IP: {$remoteIp}
============================================================
EOD;

// 日本語メール送信設定
mb_language('Japanese');
mb_internal_encoding('UTF-8');

$fromMail = 'help@t-smile.co.jp';
$fromName = 'スマイチWebシステム';

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'Content-Transfer-Encoding: 8bit';
$headers[] = 'From: ' . mb_encode_mimeheader($fromName, 'UTF-8') . " <{$fromMail}>";
if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $headers[] = "Reply-To: {$email}";
}
$headers[] = 'X-Mailer: PHP/' . phpversion();

$headerStr = implode("\r\n", $headers);

// メール送信実行
$mailSent = @mb_send_mail($to, $subject, $body, $headerStr, "-f {$fromMail}");

if ($mailSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Notification email sent successfully',
        'recipients' => $recipients
    ]);
} else {
    // 送信失敗時もログを返却
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send mail via mb_send_mail'
    ]);
}

