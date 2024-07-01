import {
    Instrument
} from "./MusicDefinitions.js"
import {
    Diagram,
} from "./Diagram.js";

interface callbackSelectDiagramType {
    (_dia: Diagram): void
}
export interface LayoutProperties {
    gapBtwDia: number;
    gapBtwDiaMargin: number;
}

export class DiagramList {
    canvas: HTMLCanvasElement;;
    ctx: CanvasRenderingContext2D | null;
    m_diagramList: Diagram[] = [];
    highlightRow: number = 0;;
    instrument: Instrument;
    gapBtwDia: number = 0;
    gapBtwDiaMargin: number = 0;
    scrollLeftAmount: number = 0;;

    onSelectDiagramFunction: callbackSelectDiagramType | null = null;


    constructor( _canvas: HTMLCanvasElement, _instrument: Instrument) {
        this.canvas = _canvas;
        this.ctx = _canvas.getContext('2d');
        // this.m_diagramList = [];
        // this.highlightRow = 0;
        this.instrument = _instrument; //tmp
        this.gapBtwDia = 34;
        this.gapBtwDiaMargin = 0.14 * this.gapBtwDia;
        // this.scrollLeftAmount = 0;

        // this.addDiagram(_instrument);
        //  this.m_diagramList[0].deserialize();
        if (!this.loadLocalStorage()) {
            this.addDiagram(_instrument);
        }
        // this.addDiagram(_instrument);

        this.canvas.addEventListener('mousedown', this.mouseDown.bind(this), false);
        this.canvas.addEventListener('mousemove', this.mouseMove.bind(this), false);
    }

    loadLocalStorage() : boolean {
        var retrievedObject: string | null = localStorage.getItem('diagramList');
        if( retrievedObject == null ) return false;
        retrievedObject = JSON.parse(retrievedObject);
        if (retrievedObject != null && retrievedObject.length != 0) {
            // this.m_diagramList = retrievedObject;
            // console.log('loadLocalStorage no null: ', retrievedObject, retrievedObject.length);
            for (var i = 0; i < retrievedObject.length; i++) {
                // this.m_diagramList.push(retrievedObject[i]);
                // console.log('start retrieve diList: ', i, JSON.parse( retrievedObject[i] ) );  
                // console.log('start retrieve diList: ', i, retrievedObject[i] );  
                var dia = new Diagram(this.canvas, this.instrument);
                //    console.log( dia.deserialize() );
                dia.deserialize(retrievedObject[i]!);
                // dia.update();
                this.m_diagramList.push(dia);
            }
            this.calculateDimension();
            this.update();
            return true;
        }
        return false;
    }

    setScrollLeftAmount( _x: number ) : void {
        this.scrollLeftAmount = _x;
        this.update();
    }

    minHeight() : number {
        if (this.m_diagramList.length == 0) return 0;
        return this.m_diagramList[0]!.getHeight();
    }

    addDiagram( _instrument: Instrument ) : void {
        // console.log( "DiagramList.add" );
        var diagram: Diagram = new Diagram(this.canvas, _instrument);

        this.m_diagramList.push(diagram);
        localStorage.setItem('diagramList', JSON.stringify(this.m_diagramList));
        // localStorage.setItem( 'diagramListCount', JSON.stringify( this.m_diagramList.length ) );
        // console.log( "getData addDia",JSON.stringify( this.m_diagramList.length ), localStorage.getItem( 'diagramListCount') );
        this.calculateDimension();
        this.update();
    }
    removeDiagram( _i: number ) : void {
        if (this.m_diagramList.length < 2) return;
        this.m_diagramList.splice(_i, 1);
        localStorage.setItem('diagramList', JSON.stringify(this.m_diagramList));
        this.calculateDimension();
        this.update();
    }

    calculateDimension() : void {
        var h: number = 0;
        for (let i: number = 0; i < this.m_diagramList.length; i++) {
            h += this.gapBtwDia;
            this.m_diagramList[i]!.setYPos(h);
            h += this.m_diagramList[i]!.getHeight()
        }
        // console.log( "addDiagram set height", h );
        this.canvas.setAttribute("height", h + "px");
    }

    update() : void {
        if( this.ctx == null ) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = "#000000";
        for (let i: number = 0; i < this.m_diagramList.length; i++) {
            if (this.highlightRow == i) {
                this.ctx.fillStyle = "#CCEEFF";
                let marg: number = this.gapBtwDiaMargin;
                this.ctx.fillRect(this.m_diagramList[i]!.getXPos() + marg, this.m_diagramList[i]!.getYPos() - this.gapBtwDia + marg, this.m_diagramList[i]!.getWidth() - (marg * 2), this.gapBtwDia - (marg * 2));
                this.ctx.fillStyle = "#000000";
            }
            this.m_diagramList[i]!.update();

            // if (this.highlightRow != i) {
            let name: string = this.m_diagramList[i]!.getName()
            let charH = this.ctx.measureText(name).actualBoundingBoxAscent + this.ctx.measureText(name).actualBoundingBoxDescent;
            // this.ctx.fillText(name, this.m_diagramList[i].getXPos() + 10, this.m_diagramList[i].getYPos() - (charH / 2));
            this.ctx.fillText(name, this.scrollLeftAmount + this.m_diagramList[i]!.getXPos() + 10, this.m_diagramList[i]!.getYPos() - (this.gapBtwDia / 2) + (charH / 2));
            // console.log(this.m_diagramList[i].getName());
            // }
        }

    }

    mouseDown( _evt: MouseEvent ) : void {
        var rect: DOMRect = this.canvas.getBoundingClientRect();
        // let x: number = _evt.clientX - rect.left;
        let y: number = _evt.clientY - rect.top;
        for (let i: number = 0; i < this.m_diagramList.length; i++) {
            if (y > this.m_diagramList[i]!.getYPos() - this.gapBtwDia && y < this.m_diagramList[i]!.getYPos()) {
                // console.log( "DiaList.click on ", i );   
                this.highlightRow = i;
                if( this.onSelectDiagramFunction != null ) {
                    this.onSelectDiagramFunction(this.m_diagramList[i]!);
                }

            }
        }
        this.update();
    }

    mouseMove(_evt: MouseEvent) : void {
        var rect: DOMRect = this.canvas.getBoundingClientRect();
        // let x: number = _evt.clientX - rect.left;
        let y: number = _evt.clientY - rect.top;
        for (let i: number = 0; i < this.m_diagramList.length; i++) {
            if (y > this.m_diagramList[i]!.getYPos() - this.gapBtwDia && y < this.m_diagramList[i]!.getYPos() + this.m_diagramList[i]!.getHeight()) {
                // console.log( "DiaList.click on ", i );   
                if (i != this.highlightRow) {
                    this.highlightRow = i;
                    if( this.onSelectDiagramFunction != null ) {
                        this.onSelectDiagramFunction(this.m_diagramList[i]!);
                    }
                    this.update();
                    return;
                }
            }
        }
        // this.update();
    }

    getLayoutProperties() : LayoutProperties{
        return { gapBtwDia: this.gapBtwDia, gapBtwDiaMargin: this.gapBtwDiaMargin };
        // return [this.gapBtwDia, this.gapBtwDiaMargin];
    }

    setCallbackOnSelectDiagram(_function: callbackSelectDiagramType) {
        this.onSelectDiagramFunction = _function;
    }

    setSelectedDiagram( _dia: Diagram ) : void {
        if (this.m_diagramList[this.highlightRow] == undefined) return;
        this.m_diagramList[this.highlightRow]!.setDiagram(_dia);
        // localStorage.setItem( 'diagramList', JSON.stringify( this.m_diagramList ) );
        console.log(JSON.stringify(_dia.getChordFingering()));
        this.m_diagramList[this.highlightRow]!.createChordFingeringCoordinates();
        localStorage.setItem('diagramList', JSON.stringify(this.m_diagramList));
        this.update();
    }

    getSelectedDiagram() : Diagram | undefined {
        if (this.m_diagramList[this.highlightRow] == undefined) return undefined;
        return this.m_diagramList[this.highlightRow];
    }
    getSelectedDiagramPos() : number | undefined {
        if (this.m_diagramList[this.highlightRow] == undefined) return undefined;
        return this.m_diagramList[this.highlightRow]!.getYPos() - this.gapBtwDia;
    }

    getSelectedDiagramIndex() : number {
        return this.highlightRow;
    }
}