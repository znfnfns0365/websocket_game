import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

export const moveStageHandler = (userId, payload) => {
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 오름차순으로 정렬하여 현재 스테이지 확인
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 클라이언트 vs 서버 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current Stage mismatched', currentStage: currentStage.id };
  }

  // 다음 stage로 갈 수 있는지 score 검사
  const serverTime = Date.now();
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;
  // console.log(serverTime, currentStage.timestamp, elapsedTime);

  // 5 => 임의로 정한 오차범위 클라이언트 -> 서버까지 딜레이가 너무 길어 에러 처리
  // if (elapsedTime < 95 || elapsedTime > 105) {
  //   return { status: 'fail', message: 'Invalid elapsed time' };
  // }

  // targetStage 검증 <- 게임에셋에 존재하는지
  const { stages } = getGameAssets();
  // some - 배열을 구성하는 것들 중에 조건문이 하나라도 맞으면 true 반환
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  setStage(userId, payload.targetStage, serverTime);
  console.log(getStage(userId));
  return { status: 'success' };
};
