import { Diagram } from './Diagram.js';
import { musicData } from "./MusicDefinitions.js";
// console.log( "fdsjklfsdnkl" );
const scrollDiagramCanvas = document.getElementById('scroll-editor-diagram');
const diagramCanvas = document.getElementById('editor-diagram');
const diagramSelector = document.getElementById('editor-diagramSelector');
let dia = new Diagram(diagramCanvas, musicData.instrumentAt(0));
dia.update();
const diagramOptionsSelector = document.getElementById('editor-diagramOptionsSelector');
diagramOptionsSelector.setInstrument(dia.getInstrument());
diagramOptionsSelector.setDiagram(dia);
function onRootChange(_root) {
    // console.log( "onRootChange", _root );
    dia.setRoot(_root);
}
diagramSelector.setCallbackOnRootChange(onRootChange);
function onChordChange(_chord) {
    // console.log("logic.onChordChange");
    dia.setChord(_chord);
    diagramOptionsSelector.setDiagram(dia);
}
diagramSelector.setCallbackOnChordChange(onChordChange);
function onScaleChange(_scale) {
    dia.setScale(_scale);
    diagramOptionsSelector.setDiagram(dia);
}
diagramSelector.setCallbackOnScaleChange(onScaleChange);
/////////////////////////77
function onChordFingerChange(_fing) {
    // console.log( "onChordFingChange", _fing );
    dia.setChordFingering(_fing);
}
diagramOptionsSelector.setCallbackOnChordFingeringChange(onChordFingerChange);
function onChordFingereringStringChange(_s) {
    // console.log( "onChordFingStringChange", _s );
    dia.setChordFingeringString(_s);
}
diagramOptionsSelector.setCallbackOnChordFingeringStringChange(onChordFingereringStringChange);
function onMouseBehaviourChange(_v) {
    dia.setMouseClickBehaviour(_v);
}
diagramOptionsSelector.setCallbackOnMouseBehaviourChange(onMouseBehaviourChange);
window.addEventListener('resize', function (event) {
    // console.log( "logic dia editor.resize", window.innerWidth, window.innerHeight)
    adaptEditorSize();
}, true);
var maxWidth = document.body.clientWidth;
export function setEditorMaxWidth(_w) {
    maxWidth = _w;
}
export function adaptEditorSize() {
    var windowW = document.body.clientWidth - 40; //window.innerWidth;
    // var windowW = scrollDiagramCanvas.parentElement.clientWidth;
    var scrollW = scrollDiagramCanvas.getBoundingClientRect().width;
    var canvasW = diagramCanvas.getBoundingClientRect().width;
    // console.log( "logic dia editor.resize", windowW, scrollW, canvasW );
    if (windowW > canvasW) {
        // console.log("logicDiaEdit maxW");
        scrollDiagramCanvas.style.width = canvasW + 'px';
    }
    else {
        // console.log("logicDiaEdit apaptW");
        scrollDiagramCanvas.style.width = windowW + 'px';
    }
    // console.log( "adaptEditorSize" );
}
export function setEditorDiagram(_dia) {
    // console.log( "setEditorDia", _dia );
    // dia = _dia;
    dia.setDiagram(_dia);
    diagramOptionsSelector.setDiagram(dia);
    diagramSelector.setDiagram(dia);
}
export function getEditorDiagram() {
    // console.log( "getEditorDia", dia );
    return dia;
}
window.addEventListener('load', function () {
    // console.log('loadDiaEditor loaded')
    adaptEditorSize();
});
//vvvvv init values, debug
// dia.setChord( musicData.chordAt(1) );
// dia.setChordFingeringString( 5 );
// dia.setChordFingeringFret( 9 );
// dia.setChordFingering( musicData.chordFingeringAt(1) );
diagramOptionsSelector.setDiagram(dia);
diagramSelector.setDiagram(dia);
//# sourceMappingURL=logicDiagramEditor.js.map