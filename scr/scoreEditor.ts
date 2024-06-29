import {
    Instrument
} from "./MusicDefinitions.js"
import {
    Data_Note,
    Data_Score,
    dataScore,
    ScorePos,
    Staff_Type
} from "./Data_Score.js"
import {
    Diagram
} from "./Diagram.js";
import {
    jTK_Fraction
} from "./jUITK_Math_Fraction.js"
import{
    MouseAction
} from "./types.js"
import {
    StaffType
} from "./score.js"
import { ScoreObject, ScoreObject_Note } from "./scoreObjects.js";
import { ScreenPos } from "./types.js";
export enum Edit_Area {
    STAFF,
    DIAGRAM,
}

export const Score_Parameters = {
    noteSize: 10,
    marginHor: 20,
    gridDeltaX: 50,
    shortStaffBarMarkerH: 30,
    diagramHeight: 0,
    staffYPos: 0,
}

export interface callbackMouseInputChangeType {
    (_mousePos: ScreenPos, _type: MouseAction, _pos: ScorePos, _editMode: Edit_Area) : void
}

export class ScoreEditor {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    staffType: StaffType;
    editArea: Edit_Area;
    m_data: Data_Score;
    instrument: Instrument;
scoreObjects: ScoreObject[] = [];
selectedObjects: ScoreObject[] = [];
m_barRange: number[] = [];
height: number = 0;
width: number = 0;
m_mouseIsPressed: boolean;

onMouseInput: callbackMouseInputChangeType;

    constructor(_canvas, _instrument) {
        this.canvas = _canvas;
        this.ctx = _canvas.getContext('2d');

        this.staffType = StaffType.SHORT;
        this.editArea = Edit_Area.STAFF;

        this.m_data = dataScore;

        this.instrument = _instrument;

        // this.scoreObjects = [];
        // this.selectedObjects = [];

        this.m_barRange = [0, 3];

        // this.height = 0;
        // this.width = 0;

        this.updateDimension();

        this.m_mouseIsPressed = false;
        this.canvas.addEventListener('mousedown', this.mouseDown.bind(this), false);
        this.canvas.addEventListener('mouseup', this.mouseUp.bind(this), false);
        this.canvas.addEventListener('mousemove', this.mouseMove.bind(this), false);
        this.canvas.addEventListener('dblclick', this.mouseDblClick.bind(this), false);
    }

    setCallbackOnMouseInput(_func: callbackMouseInputChangeType ) : void {
        // console.log( "setCallbackOnMouse", _func );
        this.onMouseInput = _func;
    }

mousePos( _evt: MouseEvent ) : ScreenPos {
    var rect: DOMRect = this.canvas.getBoundingClientRect();
    return{ x: _evt.clientX - rect.left,  y: _evt.clientY - rect.top };
}

    mouseDblClick(_evt) : void {
        var pos: ScorePos = this.getScorePosFromMouse(_evt.clientX, _evt.clientY);
        let mousePos = this.mousePos( _evt );
        this.onMouseInput( mousePos, MouseAction.DBLCLICK, pos, this.editArea);
    }

    mouseDown( _evt: MouseEvent ) : void {
        // let pos = this.getScorePosFromMouse( _evt.clientX, _evt.clientY );
        // console.log( "bar:", pos[0], "time:",  pos[1].toString() );
        this.m_mouseIsPressed = true;
     
        this.selectedObjects = [];
        var mousePos: ScreenPos = this.mousePos( _evt );
    
        if ( mousePos.y > Score_Parameters.diagramHeight ) {
            this.editArea = Edit_Area.STAFF;
        } else {
            this.editArea = Edit_Area.DIAGRAM;
        }

        for (let i: number = 0; i < this.scoreObjects.length; i++) {
            if (this.scoreObjects[i].handleMouse( mousePos ) ) {
                // console.log("scoreEditor obj.handleMouse");
                this.scoreObjects[i].setSelect( true );
                this.selectedObjects.push( this.scoreObjects[i] );
            }
        }

        var pos: ScorePos = this.getScorePosFromMouse(_evt.clientX, _evt.clientY);
        this.onMouseInput( mousePos, MouseAction.CLICK, pos, this.editArea);

        this.update();
    }

    mouseUp( _evt: MouseEvent ) : void {
        this.m_mouseIsPressed = false;
    }

    mouseMove( _evt: MouseEvent ) : void {
        // let pos = this.getScorePosFromMouse( _evt.clientX, _evt.clientY );
        // console.log( "bar:", pos[0], "time:",  pos[1].toString() );

        if( this.m_mouseIsPressed ) {
            let mousePos: ScreenPos = this.mousePos( _evt );
            var pos: ScorePos = this.getScorePosFromMouse(_evt.clientX, _evt.clientY);
            this.onMouseInput( mousePos, MouseAction.DRAG, pos, this.editArea);
        }
    }

    getScorePosFromMouse( _x: number, _y: number ) : ScorePos {
        var rect: DOMRect = this.canvas.getBoundingClientRect();
        let x: number = _x - rect.left;
        // let y = _y - rect.top;
        x -= Score_Parameters.marginHor;

        let bar: number = this.m_barRange[0];
        var w: number = 0;
        for (let i: number = bar; i < this.m_barRange[1]; i++) {
            w += this.barWidth(i);
            if (x < w) {
                bar = i;
                break;
            }
        }

        x -= w - (this.barWidth(bar));
        x /= Score_Parameters.gridDeltaX;
        x = Math.floor(x);
        let time: jTK_Fraction = new jTK_Fraction(x, this.getSmallestGridValueForBar(bar));
        let scorePos: ScorePos = {
            bar: bar,
            time: time,
            repetition: 0
        };
        return scorePos;
    }
    getData() : Data_Score {
        return this.m_data;
    }

    updateDimension() {
        var width: number = 0;
        for (var i: number = this.m_barRange[0]; i < this.m_barRange[1]; i++) {
            // console.log( i, ": ", this.barWidth( i ) ,x );
            width += this.barWidth(i);
        }
        width += (Score_Parameters.marginHor * 2);
        this.width = width;
        this.height = this.calcHeight();
        this.canvas.setAttribute("width", width + "px");
        this.canvas.setAttribute("height", this.height + "px");
    }

    calcHeight() : number {
        let tmpDia: Diagram = new Diagram(null, this.instrument);
        Score_Parameters.diagramHeight = tmpDia.getHeight();

        let height: number = 0;
        height += Score_Parameters.diagramHeight;
        height += Score_Parameters.shortStaffBarMarkerH * 2;
        Score_Parameters.staffYPos = Score_Parameters.diagramHeight + Score_Parameters.shortStaffBarMarkerH;
        return height;
    }

    // setStaffHeight( _h ) {

    // }

    // setStaffYPos( _y ) {
    // }

    getBarRange() : number[] {
        return this.m_barRange;
    }

    getHeight() : number {
        return this.height;
    }

    addNote(_note: ScoreObject_Note ) : void {
        _note.setCtx(this.ctx);
        this.scoreObjects.push(_note);
        this.scoreObjects.sort(this.m_data.sortByTime);
    }

removeNote( _note: Data_Note ) : void {
    for( let i = 0; i < this.scoreObjects.length; i++ ) {
        if( _note == this.scoreObjects[i].getData() ) {
            this.scoreObjects.splice( i, 1 );
        }
    }
}

    getScoreObjects() : ScoreObject[] {
        return this.scoreObjects;
    }

    getSelectedScoreObjects() : ScoreObject[] {
        return this.selectedObjects;
    }

    update() : void {
        // console.log( "scoreEditor.update/draw")
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBars(Score_Parameters.marginHor, 0);

        this.drawObjects(Score_Parameters.marginHor, 0);

        this.ctx.fillStyle = "rgb(255 0 0 / 50%)";
        if (this.editArea === Edit_Area.DIAGRAM) {
            this.ctx.fillRect(0, 0, this.width, Score_Parameters.diagramHeight);
            // console.log( "scoreEdit Edito Dia" );      
        } else {
            this.ctx.fillRect(0, 0 + Score_Parameters.diagramHeight, this.width, this.height - Score_Parameters.diagramHeight);
            // console.log( "scoreEdit Edito Staff" );
        }
    };

    drawObjects( _xOff: number, _yOff: number ) : void {
        // console.log( "scoreEdit.drawObj", this.scoreObjects.length)
        for (let i: number = 0; i < this.scoreObjects.length; i++) {
            // console.log( typeof( this.scoreObjects[i] ) );
            // this.scoreObjects[i].draw(_xOff, _yOff);
            this.scoreObjects[i].draw();
        }
    }

    drawBars( _x: number, _y: number ) : void {
        _y += Score_Parameters.staffYPos;
        this.drawShortStaff(_x, _y);
    }

    drawShortStaff( _x: number, _y: number ) : void {
        var x: number = _x;
        var widthSum: number = 0;
        var h: number = Score_Parameters.shortStaffBarMarkerH / 2;
        var w: number = 0;
        for (var i: number = this.m_barRange[0]; i < this.m_barRange[1]; i++) {
            // console.log( i, ": ", this.barWidth( i ) ,x );
            w = this.barWidth(i);

            // color marks
            for (let j: number = 0; j < this.gridNumForBar(i); j++) {
                if (j % 2 == 0) {
                    this.ctx.fillStyle = "rgb(255 165 0 / 20%)";
                } else {
                    this.ctx.fillStyle = "rgb(55 165 100 / 20%)";
                }
                this.ctx.fillRect(x + (j * Score_Parameters.gridDeltaX), 0, Score_Parameters.gridDeltaX, this.height);
            }

            //bar mark
            this.ctx.moveTo(x, _y - h);
            this.ctx.lineTo(x, _y + h);
            x += w;
            widthSum += w;
        }
        // console.log( "drawShortStaff", width );
        // staff line
        this.ctx.moveTo(_x, _y);
        this.ctx.lineTo(_x + widthSum, _y);

        // last mark
        this.ctx.moveTo(_x + widthSum, _y - h);
        this.ctx.lineTo(_x + widthSum, _y + h);

        this.ctx.stroke();


    }

    gridNumForBar( _i: number ) : number {
        var metre: jTK_Fraction = this.m_data.getMetreForBar(_i);
        return (this.getSmallestGridValueForBar(_i) / metre.denom()) * metre.num();
    }

    barWidth( _i: number ) : number {
        return this.gridNumForBar(_i) * Score_Parameters.gridDeltaX;
    }

    getSmallestGridValueForBar( _i: number ) : number {
        return 4;
    }

    // drawBar( _i );
}