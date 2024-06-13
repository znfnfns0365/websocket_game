import { addUser } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handleEvent } from './helper.js';

const registerHandler = (io) => {
  // 서버에 접속한 모든 유저를 대상한 이벤트
  io.on('connection', (socket) => {
    const userUUID = uuidv4();
    addUser({ uuid: userUUID, socketId: socket.id });

    handleConnection(socket, userUUID);
    socket.on('event', (data) => handleEvent(io, socket, data));

    // 하나의 유저를 대상으로 한 이벤트
    socket.on('disconnect', (socket) => {
      handleDisconnect(socket, userUUID);
    });
  });
};

export default registerHandler;
