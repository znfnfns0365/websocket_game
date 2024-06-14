import { json } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let gameAssets = {};

const __filename = fileURLToPath(import.meta.url); // 현재 모듈의 URL을 fileURLToPath에 넣어서 현재 파일의 절대 경로를 찾음
const __dirname = path.dirname(__filename); // 디렉토리의 절대 경로만 찾아냄(파일 이름을 뺌 ex{home/src/app.js -> home/src/})
const basePath = path.join(__dirname, '../../assets'); // 현재 파일 위치 + 2번 나가서 assets 폴더의 절대 경로를 가져옴

//파일 읽는 함수
//비동기 병렬로 파일을 읽는다.
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks, highScore] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
      readFileAsync('high_score.json'),
    ]);
    gameAssets = { stages, items, itemUnlocks, highScore };
    return gameAssets;
  } catch (e) {
    throw new Error(e.message);
  }
};

const writeFileAsync = (filename, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(basePath, filename), data, 'utf8', (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

export const highScoreRenewal = async (newHighScore) => {
  try {
    const highScore = await readFileAsync('high_score.json');
    highScore.highScore = newHighScore;

    const str = JSON.stringify(highScore, null, 2);
    await writeFileAsync('high_score.json', str);
  } catch (e) {
    throw new Error(e.message);
  }
};

export const getGameAssets = () => {
  return gameAssets;
};
