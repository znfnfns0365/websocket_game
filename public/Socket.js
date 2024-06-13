import { CLIENT_VERSION } from './Constants.js';
import { scoreStop } from './Score.js';

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
socket.on('response', (data) => {
  console.log(data);
  if (data.status === 'false') scoreStop();
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
});

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent };

export const fetchGameAssets = async () => {
  try {
    const response = await fetch('/api/assets'); // 서버의 API 엔드포인트에 요청 보내기
    const data = await response.json(); // JSON 형식으로 응답 데이터를 파싱
    return data; // 데이터를 콘솔에 출력 또는 다른 작업 수행
  } catch (error) {
    console.error('Failed to fetch game assets:', error); // 요청에 실패한 경우 에러 처리
  }
};
