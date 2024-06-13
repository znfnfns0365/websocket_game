import { getGameAssets } from '../init/assets.js';
import { clearItem, getItem } from '../models/item.model.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();
  clearStage(uuid);
  clearItem(uuid);
  setStage(uuid, stages.data[0].id, payload.timestamp);
  console.log('Stage: ', getStage(uuid));

  return { status: 'success' };
};

export const gameEnd = (uuid, payload) => {
  const { items, stages } = getGameAssets();
  console.log(uuid, payload);
  const { timestamp: gameEndTime, score } = payload;
  const myStages = getStage(uuid);
  if (!myStages.length) {
    return { status: 'fail', message: 'No stage found for user' };
  }

  let totalScore = 0;

  // 스테이지 시간별 점수 추가
  myStages.forEach((stage, index) => {
    console.log('sdf', stage, index);
    let stageEndTime;
    if (index === myStages.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      stageEndTime = myStages[index + 1].timestamp;
    }
    const scorePerSecond = stages.data.find(function (val) {
      return val.id === stage.id;
    }).scorePerSecond;
    const statgeDuration = ((stageEndTime - stage.timestamp) / 1000) * scorePerSecond;
    totalScore += statgeDuration; // *(stage.id%10+1); 1초당 1점 stage 모두 동일
  });
  // 아이템 점수 추가
  const ateItems = getItem(uuid);
  for (let item of ateItems) {
    totalScore += items.data.find(function (val) {
      return val.id === item.itemId;
    }).score;
  }
  // 점수와 타임스탬프 검증
  // 오차범위 5
  console.log(score, totalScore);
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  //DB에 저장한다고 가정한다면 여기서 저장
  //setResult(userId, score, timestamp)

  return { status: 'success', message: `Game ended`, score };
};
