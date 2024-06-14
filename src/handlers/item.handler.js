import { getGameAssets } from '../init/assets.js';
import { addItem, getItem } from '../models/item.model.js';
import { getStage } from '../models/stage.model.js';

export const eatItem = async (userId, payload) => {
  const { itemUnlocks } = getGameAssets();
  const serverTime = Date.now();

  // 검증
  // 아이템Id가 현재 스테이지에 나올 수 있는지
  const stages = await getStage(userId);
  console.log(stages);
  const currentStage = stages[stages.length - 1].id;
  for (let i = 0; i < itemUnlocks.data.length; i++) {
    if (itemUnlocks.data[i].stage_id === currentStage) {
      if (!itemUnlocks.data[i].item_id.includes(payload.itemId)) {
        return { status: 'false', message: "This item can't be in your stage" };
      }
      break;
    }
  }

  // 아이템 획득 패킷만 전송하는 어뷰징 행위인지 (아이템 생성 간격을 잘 지켰는지)
  const items = getItem(userId);
  if (items.length > 0) {
    const elapsedTime = (serverTime - items[items.length - 1].timestamp) / 1000;
    // 5~10초 사이로 랜덤하게 생성되는데 5보다 작으면 false, 오차범위 10%
    if (elapsedTime < 4.5) {
      return { status: 'false', message: 'Item creation interval Error' };
    }
  }

  // 검증 완료시 데이터 저장
  addItem(userId, payload.itemId, serverTime);
  console.log(getItem(userId));

  return { status: 'success' };
};
