import {
    Diagram,
    MouseClickBehaviour
} from './Diagram.js'
import {
    ChordFingering,
    IntervallArray,
    musicData, Pitch
} from "./MusicDefinitions.js";
import {
    DiagramOptionsSelector
} from "./diagramOptionsSelector.js"
import {
    DiagramSelector
} from "./DiagramSelector.js"

const scrollDiagramCanvas: HTMLElement | null = document.getElementById('scroll-editor-diagram');
const diagramCanvas: HTMLCanvasElement | null = document.getElementById('editor-diagram') as HTMLCanvasElement;
const diagramSelector = document.getElementById('editor-diagramSelector') as DiagramSelector | null;
let dia: Diagram = new Diagram(diagramCanvas, musicData.instrumentAt(0)!);
dia.update();

const diagramOptionsSelector: DiagramOptionsSelector | null = document.getElementById('editor-diagramOptionsSelector') as DiagramOptionsSelector | null;


function onRootChange( _root: Pitch) : void {
    // console.log( "onRootChange", _root );
    dia.setRoot(_root);
}
if( diagramSelector != null && diagramOptionsSelector != null ) {
diagramSelector.setCallbackOnRootChange(onRootChange);
diagramOptionsSelector.setInstrument(dia.getInstrument());
diagramOptionsSelector.setDiagram(dia);

function onChordChange( _chord: IntervallArray ) : void {
    // console.log("logic.onChordChange");
    dia.setChord(_chord);
    if( diagramOptionsSelector != null ) {
        diagramOptionsSelector.setDiagram(dia);
    }
}
diagramSelector.setCallbackOnChordChange(onChordChange);

function onScaleChange(_scale : IntervallArray ) : void{
    dia.setScale(_scale);
    if( diagramOptionsSelector != null ) {
    diagramOptionsSelector.setDiagram(dia);
    }
}
diagramSelector.setCallbackOnScaleChange(onScaleChange);

/////////////////////////77
function onChordFingerChange( _fing: ChordFingering ) : void {
    // console.log( "onChordFingChange", _fing );
    dia.setChordFingering(_fing);
}
diagramOptionsSelector.setCallbackOnChordFingeringChange(onChordFingerChange);

function onChordFingereringStringChange( _s: number ) : void {
    // console.log( "onChordFingStringChange", _s );
    dia.setChordFingeringString(_s);
}
diagramOptionsSelector.setCallbackOnChordFingeringStringChange(onChordFingereringStringChange);

function onMouseBehaviourChange( _v: MouseClickBehaviour ) : void {
    console.log( "onMouseBevah", _v );
    dia.setMouseClickBehaviour(_v);
}
diagramOptionsSelector.setCallbackOnMouseBehaviourChange(onMouseBehaviourChange);
}

window.addEventListener('resize', function (event) {
    // console.log( "logic dia editor.resize", window.innerWidth, window.innerHeight)
    adaptEditorSize();
}, true);

// var maxWidth: number = document.body.clientWidth;
export function setEditorMaxWidth( _w: number ) {
    // maxWidth = _w;
}

export function adaptEditorSize() {
    if( diagramCanvas == null || scrollDiagramCanvas == null ) return;
    var windowW: number = document.body.clientWidth - 40; //window.innerWidth;
    // var scrollW = scrollDiagramCanvas.getBoundingClientRect().width;
    var canvasW: number = diagramCanvas.getBoundingClientRect().width;
    // console.log( "logic dia editor.resize", windowW, scrollW, canvasW );
    if (windowW > canvasW) {
        // console.log("logicDiaEdit maxW");
        scrollDiagramCanvas.style.width = canvasW + 'px';
    } else {
        // console.log("logicDiaEdit apaptW");
        scrollDiagramCanvas.style.width = windowW + 'px';
    }
    // console.log( "adaptEditorSize" );
}

export function setEditorDiagram( _dia: Diagram ) {
    // console.log( "setEditorDia", _dia );
    // dia = _dia;
    dia.setDiagram( _dia );
    if( diagramSelector != null && diagramOptionsSelector != null ) {
    diagramOptionsSelector.setDiagram(dia);
    diagramSelector.setDiagram(dia);
    }
}

export function getEditorDiagram() : Diagram {
    // console.log( "getEditorDia", dia );
    return dia;
}

window.addEventListener('load', function () {
    // console.log('loadDiaEditor loaded')
    adaptEditorSize();

})


//vvvvv init values, debug
// dia.setChord( musicData.chordAt(1) );
// dia.setChordFingeringString( 5 );
// dia.setChordFingeringFret( 9 );
// dia.setChordFingering( musicData.chordFingeringAt(1) );
if( diagramSelector != null && diagramOptionsSelector != null ) {
diagramOptionsSelector.setDiagram(dia);
diagramSelector.setDiagram(dia);
}