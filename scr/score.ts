// import {
//     Diagram,
// } from "./Diagram.js";
import {
    Data_Score,
    dataScore
} from "./Data_Score.js";
import {
 Instrument
} from "./MusicDefinitions.js"

export enum StaffType {
    SHORT, TAB, NOTE
}

export class Score {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    m_dataScore: Data_Score;
    
    constructor( _canvas: HTMLCanvasElement, _instrument: Instrument ) {
        this.canvas = _canvas;
        this.ctx = _canvas.getContext('2d');

        this.m_dataScore = dataScore;
    }

    update() : void {
        if( this.ctx == null ) return;
        this.ctx.fillText( "SCORE", 100, 100 );
            
    }
}
