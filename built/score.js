import { dataScore } from "./Data_Score.js";
export class Score {
    constructor(_canvas, _instrument) {
        this.canvas = _canvas;
        this.ctx = _canvas.getContext('2d');
        this.m_dataScore = dataScore;
    }
    update() {
        this.ctx.fillText("SCORE", 100, 100);
    }
}
//# sourceMappingURL=score.js.map