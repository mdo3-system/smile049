/**
 * チャット ＆ パース依頼 データ管理サービス (LocalStorage + Event連動)
 */

const STORAGE_KEY_ROOMS = 'wood_garage_chat_rooms';
const STORAGE_KEY_CURRENT_USER = 'wood_garage_current_user_room';

// 初期モックデータ
const INITIAL_ROOMS = [
  {
    roomId: 'room-demo-01',
    customerName: '佐藤 雅之 様',
    email: 'sato.sample@example.com',
    planType: 'Plan 01 (愛車・ホビー)',
    status: 'AIパース作成中', // 'パース作成中' | '提案済' | '見積中' | '契約・CRM移管済'
    createdAt: '2026-09-12 10:30',
    modelData: null,
    crmTransferred: false,
    messages: [
      {
        id: 1,
        sender: 'system',
        text: '【自動送信】佐藤様、木造自由設計ガレージのフォトリアルパース作成依頼を受け付けました。専任の建築士・AIオペレーターが3Dデータをもとにパース作成を開始いたします。',
        time: '10:30',
        attachments: []
      },
      {
        id: 2,
        sender: 'customer',
        text: 'こんにちは！シミュレーターでバイク2台と工具棚を置いたガレージを作成しました。敷地の現況写真も添付しますので、落ち着いた木目調のパースをお願いできますか？',
        time: '10:32',
        attachments: [
          { name: '敷地現況写真.jpg', type: 'image', size: '2.4MB' },
          { name: 'garage-design.json', type: 'json', size: '38KB' }
        ]
      },
      {
        id: 3,
        sender: 'staff',
        text: '佐藤様、ご依頼ありがとうございます！建築士の田中です。バイクの取り回し寸法や工具棚の配置、非常に使い勝手の良い動線になっておりますね。いただいた敷地写真の背景に合わせて、無垢材の梁とダウンライトが映えるパースを作成中です。完成次第こちらにお送りします！',
        time: '10:45',
        attachments: []
      }
    ]
  }
];

export const getChatRooms = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ROOMS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(INITIAL_ROOMS));
      return INITIAL_ROOMS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_ROOMS;
  }
};

export const saveChatRooms = (rooms) => {
  try {
    localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
    window.dispatchEvent(new Event('chat_rooms_updated'));
  } catch (e) {
    console.error(e);
  }
};

export const getCurrentUserRoomId = () => {
  return localStorage.getItem(STORAGE_KEY_CURRENT_USER) || 'room-demo-01';
};

export const setCurrentUserRoomId = (roomId) => {
  localStorage.setItem(STORAGE_KEY_CURRENT_USER, roomId);
};

// 新規パース依頼登録
export const createParseRequest = ({ customerName, email, planType, modelData, memo }) => {
  const rooms = getChatRooms();
  const roomId = `room-${Date.now().toString(36)}`;
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${timeStr}`;

  const newRoom = {
    roomId,
    customerName,
    email,
    planType: planType || '自由設計プラン',
    status: 'AIパース作成中',
    createdAt: dateStr,
    modelData: modelData || null,
    crmTransferred: false,
    messages: [
      {
        id: Date.now(),
        sender: 'system',
        text: `【自動送信】${customerName}様、フォトリアルパースの作成依頼を受け付けました！専任の建築士が3Dモデルを精査し、Stable Diffusionによる高精細フォトリアルパースの生成を開始いたします。`,
        time: timeStr,
        attachments: [
          { name: 'garage-3d-model.json', type: 'json', size: '32KB' }
        ]
      }
    ]
  };

  if (memo) {
    newRoom.messages.push({
      id: Date.now() + 1,
      sender: 'customer',
      text: memo,
      time: timeStr,
      attachments: []
    });
  }

  rooms.unshift(newRoom);
  saveChatRooms(rooms);
  setCurrentUserRoomId(roomId);
  return newRoom;
};

// メッセージ送信
export const sendMessageToRoom = (roomId, { sender, text, attachments = [] }) => {
  const rooms = getChatRooms();
  const room = rooms.find(r => r.roomId === roomId);
  if (!room) return null;

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const msg = {
    id: Date.now(),
    sender, // 'customer' | 'staff'
    text,
    time: timeStr,
    attachments
  };

  room.messages.push(msg);
  saveChatRooms(rooms);
  return msg;
};

// ステータス更新 & CRM移管
export const updateRoomStatus = (roomId, status) => {
  const rooms = getChatRooms();
  const room = rooms.find(r => r.roomId === roomId);
  if (!room) return;
  room.status = status;
  if (status === '契約・CRM移管済') {
    room.crmTransferred = true;
  }
  saveChatRooms(rooms);
};
