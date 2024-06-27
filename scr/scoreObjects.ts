import {
    Score_Parameters
} from "./scoreEditor.js"
import {
    jTK_Fraction
} from "./jUITK_Math_Fraction.js"
import {
    ScorePos
} from "./Data_Score.js"

export class ScoreObject {
    ctx;
    m_x;
    m_y;
    m_data;
    m_barAndTime;
    m_duration;
    m_isSelected;
    constructor() {
        this.ctx;
        this.m_x = 0;
        this.m_y = 0;
        this.m_data;
        this.m_barAndTime;
        // {
        //     bar: 0,
        //     time: new jTK_Fraction(),
        //     repetition: 0,
        // };
        this.m_duration

        this.m_isSelected = false;
    }

    setCtx(_ctx) {
        this.ctx = _ctx;
    }

    getX() {
        return this.m_x;
    }
    setX(_x) {
        this.m_x = _x;
    }
    getY() {
        return this.m_y;
    }
    setY(_y) {
        this.m_y = _y;
    }
    setData(_data) {
        this.m_data = _data;
    }
    getData() {
        return this.m_data;
    }

    setTime(_time) {
        this.m_barAndTime = _time;
    }
    getTime() {
        return this.m_barAndTime;
    }

    setDuration(_dur) {
        this.m_duration = _dur;
    }

    getDuration() {
        return this.m_duration;
    }

    setSelect( _b ) {
        this.m_isSelected = _b;
    }
    isSelected() {
        return this.m_isSelected;
    }

    getType() {
        return "scoreobject";
    }

    handleMouse( _mousePos ) {
        return false;
    }
}

export class ScoreObject_Note extends ScoreObject {
    constructor() {
        super();
    }
    getType() {
        return "scoreobject_note";
    }
    draw() {
        this.ctx.fillStyle = "rgb(0 0 0 / 100%)";
        // this.ctx.strokeStyle = "rgb(0 255 255 / 100%)";
        // console.log( "scoreObj.draw ", this.m_x + _xOff, this.m_y + _yOff );
        this.ctx.beginPath();
        this.ctx.arc(this.m_x + Score_Parameters.noteSize, this.m_y, Score_Parameters.noteSize, 0, 2 * Math.PI, false);
        this.ctx.fill();
    }

    handleMouse( _mousePos ) {
        if (_mousePos.x < this.m_x) return false;
        if (_mousePos.y < this.m_y - Score_Parameters.noteSize) return false;
        if (_mousePos.x > this.m_x + (Score_Parameters.noteSize * 2)) return false;
        if (_mousePos.y > this.m_y + (Score_Parameters.noteSize)) return false;
        console.log( "scoreObj.handleMouse return true" );
        return true;
    }
}