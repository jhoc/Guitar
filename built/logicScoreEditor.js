import { musicData } from "./MusicDefinitions.js";
import { ScoreEditor, Score_Parameters, Edit_Area } from "./scoreEditor.js";
import { dataScore, } from "./Data_Score.js";
import { algo_lin_setXPos } from "./algorithm_score_linear.js";
import { ScoreObject_Note } from "./scoreObjects.js";
import { MouseAction } from "./types.js";
////////////////////////////////////////// Menubar
//////////////////////////////////////vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// console.log( "Create ScoreEditor MenuBar............." );
const menubar = document.getElementById('scoreEditorMenuBar') || null;
var nav = menubar.createButton('navigation', "./images/mi--chevron-down.svg");
menubar.addHeaderLeftIcon(nav);
nav.addEventListener('click', function () {
    menubar.clearMenu();
    menubar.createMenuElement('124ffdsdfsdfd').addEventListener('click', function () {
        console.log("124fdsdfsdf");
    });
    menubar.createMenuElement('ssdfsdfsdf123123dsdf78sdf78sdf').addEventListener('click', function () {
        console.log("1sdsdf78123123123");
    });
    // menubar.addMenuElement( li );
    menubar.openMenu(nav);
});
var element = menubar.createButton('navigation', "./images/mi--menu.svg");
menubar.addHeaderRightIcon(element);
element.addEventListener('click', function () {
    menubar.clearMenu();
    menubar.createMenuElement('124fd').addEventListener('click', function () {
        console.log("124fd");
    });
    menubar.createMenuElement('sdsdf78sdf78sdf').addEventListener('click', function () {
        console.log("1sdsdf78");
    });
    // menubar.addMenuElement( li );
    menubar.openMenu(element);
});
element = menubar.createButton('other', "./images/ic--round-plus.svg");
menubar.addHeaderRightIcon(element);
element.addEventListener('click', function () {
});
////////////////////////////////////////////////////// defines, creations, ....
//////////////////////////////////////////////////////// ScoreEditor
const canvasScoreEditor = document.getElementById('scoreEditorCanvas');
var scrollScoreEditor = document.getElementById('scoreEditorScroll');
const scoreEditor = new ScoreEditor(canvasScoreEditor, musicData.instrumentAt(0));
scoreEditor.update();
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// Scroll vvvvvvvvvvvvvvvvvvvvv
// console.log( scoreCanvas, score );
function adaptSize() {
    // console.log( "logicScoreEditor:adaptSize" );
    var windowW = document.body.clientWidth;
    var canvasW = canvasScoreEditor.getBoundingClientRect().width;
    // console.log( "logic dia editor.resize", windowW, canvasW );
    if (windowW > canvasW) {
        scrollScoreEditor.style.width = canvasW + 'px';
    }
    else {
        scrollScoreEditor.style.width = windowW + 'px';
    }
    const scrollbarWidthVer = scrollScoreEditor.offsetHeight - scrollScoreEditor.clientHeight;
    scrollScoreEditor.style.height = canvasScoreEditor.clientHeight + scrollbarWidthVer + 'px';
}
window.addEventListener('load', function () {
    // console.log('logicScoreEditor:load')
    adaptSize();
    // adaptSize(); // 2 mal wg scrollbar, beim ersten mal noch nicht gesetzt
});
window.addEventListener('resize', function (event) {
    adaptSize();
}, true);
///////////////////////////////////////////////////////////
////////////////////////////vvvvvvvvvvvvv Data Logic
function updateScoreObjectPos() {
    algo_lin_setXPos(scoreEditor.getScoreObjects(), Score_Parameters, scoreEditor);
    scoreEditor.update();
}
function onDataChangeAddNote(_data) {
    // console.log( "onDataHasChngd", _data );
    let note = new ScoreObject_Note();
    note.setData(_data);
    note.setTime(_data.getTime());
    scoreEditor.addNote(note);
    updateScoreObjectPos();
    // scoreEditor.update();
}
dataScore.setCallbackChangeAddNote(onDataChangeAddNote);
function onDataChangeRemoveNote(_data) {
    // console.log( "onDataHasChngdRemoveNote", _data );
    scoreEditor.removeNote(_data);
    updateScoreObjectPos();
}
dataScore.setCallbackChangeRemoveNote(onDataChangeRemoveNote);
var noteOnPress = null;
function pressOnMouse(_mousePos) {
    for (let i = 0; i < scoreEditor.getSelectedScoreObjects().length; i++) {
        if (scoreEditor.getSelectedScoreObjects()[i] == undefined)
            continue;
        if (scoreEditor.getSelectedScoreObjects()[i].handleMouse(_mousePos)) {
            return scoreEditor.getSelectedScoreObjects()[i];
        }
    }
    return null;
}
function onMouseInput(_mousePos, _type, _pos, _editMode) {
    // console.log("onMOuseIn", _mousePos, _type, _pos);
    if (_type == MouseAction.CLICK) {
        noteOnPress = pressOnMouse(_mousePos);
        // console.log( "click", noteOnPress );
        return;
    }
    if (_type == MouseAction.DBLCLICK && _editMode == Edit_Area.STAFF) {
        const note = pressOnMouse(_mousePos);
        if (note != null) {
            dataScore.removeNote(note.getData());
            return;
        }
        dataScore.addNote(_pos);
        return;
    }
    if (_type == MouseAction.DRAG) {
        // const note = pressOnMouse(_mousePos);
        // console.log("drag", note, _pos);
        if (noteOnPress != null) {
            //move getSelectedScoreObjects
            if (noteOnPress.getData() != null) {
                noteOnPress.getData().setTime(_pos);
            }
            noteOnPress.setTime(_pos);
            updateScoreObjectPos();
            return;
        }
    }
}
scoreEditor.setCallbackOnMouseInput(onMouseInput);
//# sourceMappingURL=logicScoreEditor.js.map