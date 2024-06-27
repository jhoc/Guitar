import {
    Diagram,
} from "./Diagram.js";
import {
    dataScore
} from "./Data_Score.js";

export class Score {
    canvas;
    ctx;
    m_dataScore;
    constructor(_canvas, _instrument) {
        this.canvas = _canvas;
        this.ctx = _canvas.getContext('2d');

        this.m_dataScore = dataScore;
    }

    update(){
        this.ctx.fillText( "SCORE", 100, 100 );
            
    }
}
