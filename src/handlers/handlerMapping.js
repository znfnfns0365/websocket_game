import { moveStageHandler } from './stage.handler.js';
import { gameStart, gameEnd } from './game.handler.js';
import { eatItem } from './item.handler.js';

const handlerMappings = {
  11: moveStageHandler,
  2: gameStart,
  3: gameEnd,
  4: eatItem,
};

export default handlerMappings;
