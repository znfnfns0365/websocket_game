import { fetchGameAssets, sendEvent } from './Socket.js';
let scoreCancel = 1;
class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = 0;
  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.gameAssets = {};
    this.highScore = 0;
    this.loadGameAssets();
  }

  async loadGameAssets() {
    this.gameAssets = await fetchGameAssets();
  }

  async update(deltaTime) {
    await this.loadGameAssets();
    const { stages } = this.gameAssets;
    this.score += deltaTime * 0.001 * stages.data[this.stageChange].scorePerSecond * scoreCancel;
    for (let i = 1; i < stages.data.length; i++) {
      if (this.score > stages.data[i].score && this.stageChange === i - 1) {
        sendEvent(11, { currentStage: stages.data[i - 1].id, targetStage: stages.data[i].id });
        this.stageChange++;
        console.log(
          'stage:',
          this.stageChange,
          'scorePerSecond: ',
          stages.data[this.stageChange].scorePerSecond,
        );
      }
    }
  }

  getItem(itemId) {
    const { items } = this.gameAssets;
    console.log(this.gameAssets);
    sendEvent(4, { itemId });
    console.log(`item${items.data[itemId - 1].id}: `, items.data[itemId - 1].score);
    this.score += items.data[itemId - 1].score * scoreCancel;
  }

  reset() {
    this.score = 0;
    this.stageChange = 0;
    scoreCancel = 1;
  }

  async getHighScore() {
    await this.loadGameAssets();
    this.highScore = Math.floor(this.gameAssets.highScore.highScore);
    this.draw();
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = this.highScore;
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;

export const scoreStop = () => {
  scoreCancel = 0;
};
