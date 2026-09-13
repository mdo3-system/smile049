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
    status: '提案済', // 'AIパース作成中' | '提案済' | '見積中' | '契約・CRM移管済'
    createdAt: '2026-09-12 10:30',
    modelData: null,
    crmTransferred: false,
    messages: [
      {
        id: 1,
        sender: 'system',
        text: '【自動送信】佐藤様、木造自由設計ガレージのフォトリアルパース作成依頼を受け付けました。専任スタッフが3Dデータをもとにパース作成を開始いたします。',
        time: '10:30',
        attachments: []
      },
      {
        id: 2,
        sender: 'customer',
        text: 'こんにちは！シミュレーターでバイクと工具棚を置いたガレージを作成しました。外壁ガルバリウム鋼板仕上げ、軒の出0のシャープなパースをお願いできますか？',
        time: '10:32',
        attachments: [
          { name: 'garage-design.json', type: 'json', size: '38KB' }
        ]
      },
      {
        id: 3,
        sender: 'staff',
        text: '佐藤様、ご依頼ありがとうございます！専任スタッフの田中です。3Dシミュレーターのデータをもとに、最新のガルバリウム鋼板外壁・軒の出0のシャープなディテールを忠実に反映したAIフォトリアルパースを作成いたしました！以下よりご確認ください。',
        time: '10:35',
        attachments: [
          {
            name: 'AIフォトリアルパース_Plan01_完成稿.jpg',
            type: 'image',
            size: '1.2MB',
            url: '/assets/plans/plan01.jpg',
            isAiRender: true
          }
        ]
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
    const parsed = JSON.parse(data);
    // デモルームに画像がまだない古いキャッシュの場合は更新
    const demo = parsed.find(r => r.roomId === 'room-demo-01');
    if (demo && !demo.messages.some(m => m.attachments?.some(a => a.isAiRender))) {
      localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(INITIAL_ROOMS));
      return INITIAL_ROOMS;
    }
    return parsed;
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

// 3Dモデル形状・プランに応じたパース画像の選定 (車・バイク優先)
export const selectBestPerspectiveImage = (planType, modelData) => {
  const hasBike = modelData?.vehicles?.some(v => v.type === 'bike');
  const hasTractor = modelData?.vehicles?.some(v => v.type === 'tractor');
  const hasCar = modelData?.vehicles?.some(v => v.type === 'car_suv' || v.type === 'car_sport');

  // トラクター配置かつ農業倉庫の場合のみPlan 03
  if (hasTractor && (planType?.includes('農業') || planType?.includes('03'))) {
    return {
      name: 'AIフォトリアルパース_Plan03_農業倉庫.jpg',
      url: '/assets/plans/plan03.jpg'
    };
  }

  // バイク配置またはPlan 01
  if (hasBike || planType?.includes('ホビー') || planType?.includes('01')) {
    return {
      name: 'AIフォトリアルパース_Plan01_愛車バイク・ホビーガレージ.jpg',
      url: '/assets/plans/plan01.jpg'
    };
  }

  // 乗用車（SUV・スポーツカー）配置、大型ガレージ、またはデフォルト
  return {
    name: 'AIフォトリアルパース_Plan02_大型2台用ガレージ_SUV.jpg',
    url: '/assets/plans/plan02.jpg'
  };
};

// 新規パース依頼登録
export const createParseRequest = ({ customerName, email, planType, modelData, memo }) => {
  const rooms = getChatRooms();
  const roomId = `room-${Date.now().toString(36)}`;
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${timeStr}`;

  const bestImage = selectBestPerspectiveImage(planType, modelData);

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
        text: `【自動送信】${customerName}様、フォトリアルパースの作成依頼を受け付けました！専任スタッフが3Dモデルを精査し、社内PC（Stable Diffusion）にて最新のガルバリウム鋼板仕様・軒の出0のシャープなデザインで高精細フォトリアルパースの生成を開始いたします。`,
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

  // 1.5秒後に自動的にAIフォトリアルパースをチャットに納品！
  setTimeout(() => {
    const freshRooms = getChatRooms();
    const targetRoom = freshRooms.find(r => r.roomId === roomId);
    if (!targetRoom) return;

    const replyNow = new Date();
    const replyTime = `${replyNow.getHours().toString().padStart(2, '0')}:${replyNow.getMinutes().toString().padStart(2, '0')}`;

    targetRoom.status = '提案済';
    targetRoom.messages.push({
      id: Date.now() + 2,
      sender: 'staff',
      text: `${customerName}様、大変お待たせいたしました！シミュレーターでモデリングいただいた3Dモデル（間口: ${modelData?.dimensions?.wFront || 5400}mm / ガルバリウム鋼板仕上げ / 軒の出0仕様）をもとに、社内PCにて高精細フォトリアルパースを生成いたしました！\n実物さながらの重厚なガルバリウム鋼板の質感と光の陰影をご確認ください。`,
      time: replyTime,
      attachments: [
        {
          name: bestImage.name,
          type: 'image',
          size: '1.2MB',
          url: bestImage.url,
          isAiRender: true
        }
      ]
    });

    saveChatRooms(freshRooms);
  }, 1500);

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
