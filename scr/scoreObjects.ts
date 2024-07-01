import {
    Score_Parameters
} from "./scoreEditor.js"
import {
    jTK_Fraction
} from "./jUITK_Math_Fraction.js"
import {
    ScorePos, Data_ScoreObject,
    // Data_Score
} from "./Data_Score.js"
import { ScreenPos } from "./types.js";

export enum ScoreObjectType {
    SCOREOBJECT, NOTE, DIAGRAM
}

export class ScoreObject {
    ctx: CanvasRenderingContext2D | null = null;
    m_x: number = 0;
    m_y: number = 0;
    m_data: Data_ScoreObject | null = null;
    m_barAndTime: ScorePos = new ScorePos;
    m_duration: jTK_Fraction = new jTK_Fraction( 0, 4 );
    m_isSelected: boolean = false;

    constructor() {
        // this.ctx;
        // this.m_x = 0;
        // this.m_y = 0;
        this.m_data;
        this.m_barAndTime;
        // {
        //     bar: 0,
        //     time: new jTK_Fraction(),
        //     repetition: 0,
        // };
        // this.m_duration

        // this.m_isSelected = false;
    }

    setCtx( _ctx: CanvasRenderingContext2D | null ) : void {
        this.ctx = _ctx;
    }

    getX() : number {
        return this.m_x;
    }
    setX( _x: number ) : void {
        this.m_x = _x;
    }
    getY() : number {
        return this.m_y;
    }
    setY( _y: number ) : void {
        this.m_y = _y;
    }
    setData( _data: Data_ScoreObject ) : void {
        this.m_data = _data;
    }
    getData() : Data_ScoreObject | null {
        return this.m_data;
    }

    setTime( _time: ScorePos ) : void {
        this.m_barAndTime = _time;
    }
    getTime() : ScorePos {
        return this.m_barAndTime;
    }

    setDuration( _dur: jTK_Fraction ) : void {
        this.m_duration = _dur;
    }

    getDuration() : jTK_Fraction{
        return this.m_duration;
    }

    setSelect( _b: boolean ) : void {
        this.m_isSelected = _b;
    }
    isSelected() : boolean {
        return this.m_isSelected;
    }

    getType() : ScoreObjectType {
        return  ScoreObjectType.SCOREOBJECT;
    }

    handleMouse( _mousePos: ScreenPos ) : boolean{
        return false;
    }
    draw() : void {};
}

export class ScoreObject_Note extends ScoreObject {
    constructor() {
        super();
    }
    override getType() : ScoreObjectType {
        return ScoreObjectType.NOTE;
    }
    override draw() : void {
        if( this.ctx == null ) return;
        this.ctx.fillStyle = "rgb(0 0 0 / 100%)";
        // this.ctx.strokeStyle = "rgb(0 255 255 / 100%)";
        // console.log( "scoreObj.draw ", this.m_x + _xOff, this.m_y + _yOff );
        this.ctx.beginPath();
        this.ctx.arc(this.m_x + Score_Parameters.noteSize, this.m_y, Score_Parameters.noteSize, 0, 2 * Math.PI, false);
        this.ctx.fill();
    }

    override handleMouse( _mousePos: ScreenPos ) : boolean {
        if (_mousePos.x < this.m_x) return false;
        if (_mousePos.y < this.m_y - Score_Parameters.noteSize) return false;
        if (_mousePos.x > this.m_x + (Score_Parameters.noteSize * 2)) return false;
        if (_mousePos.y > this.m_y + (Score_Parameters.noteSize)) return false;
        // console.log( "scoreObj.handleMouse return true" );
        return true;
    }
}