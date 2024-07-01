import {
    GenericMenuBar
} from "./genericMenuBar.js"

import {
    musicData
} from "./MusicDefinitions.js"
import {
    ScoreEditor,
    Score_Parameters,
    Edit_Area
} from "./scoreEditor.js"
import {
    Data_Note,
    dataScore,
    ScorePos,
} from "./Data_Score.js";
import {
    algo_lin_setXPos
} from "./algorithm_score_linear.js"
import {
    ScoreObject,
    ScoreObject_Note
}from "./scoreObjects.js";

import { MouseAction, ScreenPos } from "./types.js";

////////////////////////////////////////// Menubar
//////////////////////////////////////vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

// console.log( "Create ScoreEditor MenuBar............." );
const menubar = document.getElementById('scoreEditorMenuBar') as GenericMenuBar || null;

var nav: HTMLButtonElement = menubar.createButton('navigation', "./images/mi--chevron-down.svg");
menubar.addHeaderLeftIcon(nav);
nav.addEventListener('click', function () : void {
    menubar.clearMenu();
    menubar.createMenuElement('124ffdsdfsdfd').addEventListener('click', function () : void {
        console.log("124fdsdfsdf");
    });
    menubar.createMenuElement('ssdfsdfsdf123123dsdf78sdf78sdf').addEventListener('click', function () : void {
        console.log("1sdsdf78123123123");
    });
    // menubar.addMenuElement( li );

    menubar.openMenu(nav);
})

var element: HTMLButtonElement = menubar.createButton('navigation', "./images/mi--menu.svg");
menubar.addHeaderRightIcon(element);
element.addEventListener('click', function () : void {
    menubar.clearMenu();
    menubar.createMenuElement('124fd').addEventListener('click', function () {
        console.log("124fd");
    });
    menubar.createMenuElement('sdsdf78sdf78sdf').addEventListener('click', function () {
        console.log("1sdsdf78");
    });
    // menubar.addMenuElement( li );

    menubar.openMenu(element);
})

element = menubar.createButton('other', "./images/ic--round-plus.svg");
menubar.addHeaderRightIcon(element);
element.addEventListener('click', function () {

})


////////////////////////////////////////////////////// defines, creations, ....
//////////////////////////////////////////////////////// ScoreEditor

const canvasScoreEditor: HTMLCanvasElement = document.getElementById('scoreEditorCanvas') as HTMLCanvasElement;
var scrollScoreEditor: HTMLDivElement = document.getElementById('scoreEditorScroll') as HTMLDivElement;
const scoreEditor = new ScoreEditor(canvasScoreEditor, musicData.instrumentAt(0)!);
scoreEditor.update();


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// Scroll vvvvvvvvvvvvvvvvvvvvv
// console.log( scoreCanvas, score );

function adaptSize() : void {
    // console.log( "logicScoreEditor:adaptSize" );
    var windowW: number = document.body.clientWidth;
    var canvasW: number = canvasScoreEditor.getBoundingClientRect().width;
    // console.log( "logic dia editor.resize", windowW, canvasW );

    if (windowW > canvasW) {
        scrollScoreEditor.style.width = canvasW + 'px';
    } else {
        scrollScoreEditor.style.width = windowW + 'px';
    }
    const scrollbarWidthVer: number = scrollScoreEditor.offsetHeight - scrollScoreEditor.clientHeight;
    scrollScoreEditor.style.height = canvasScoreEditor.clientHeight + scrollbarWidthVer + 'px';
}

window.addEventListener('load', function () : void {
    // console.log('logicScoreEditor:load')
    adaptSize();
    // adaptSize(); // 2 mal wg scrollbar, beim ersten mal noch nicht gesetzt
})
window.addEventListener('resize', function (event) : void {
    adaptSize();
}, true);


///////////////////////////////////////////////////////////
////////////////////////////vvvvvvvvvvvvv Data Logic


function updateScoreObjectPos() : void {
    algo_lin_setXPos(scoreEditor.getScoreObjects(), Score_Parameters, scoreEditor);
    scoreEditor.update();
}

function onDataChangeAddNote( _data: Data_Note ) : void {
    // console.log( "onDataHasChngd", _data );
    let note: ScoreObject_Note = new ScoreObject_Note();
    note.setData( _data );
    note.setTime( _data.getTime() );
    scoreEditor.addNote( note );
    updateScoreObjectPos();
    // scoreEditor.update();
}
dataScore.setCallbackChangeAddNote( onDataChangeAddNote );

function onDataChangeRemoveNote( _data: Data_Note ) {
    // console.log( "onDataHasChngdRemoveNote", _data );
    scoreEditor.removeNote( _data );
    updateScoreObjectPos();
}
dataScore.setCallbackChangeRemoveNote( onDataChangeRemoveNote );

var noteOnPress: ScoreObject | null = null;
function pressOnMouse( _mousePos: ScreenPos ) : ScoreObject | null {
    for (let i: number = 0; i < scoreEditor.getSelectedScoreObjects().length; i++) {
        if( scoreEditor.getSelectedScoreObjects()[i] == undefined ) continue;
        if( scoreEditor.getSelectedScoreObjects()[i]!.handleMouse( _mousePos ) ) {
            return scoreEditor.getSelectedScoreObjects()[i]!;
        }
    }

    return null;
}

function onMouseInput( _mousePos: ScreenPos, _type: MouseAction, _pos: ScorePos, _editMode: Edit_Area ) : void {
    // console.log("onMOuseIn", _mousePos, _type, _pos);

    if( _type == MouseAction.CLICK ) {
        noteOnPress = pressOnMouse(_mousePos);
        // console.log( "click", noteOnPress );
        return;
    }

    if (_type == MouseAction.DBLCLICK && _editMode == Edit_Area.STAFF) {

        const note = pressOnMouse(_mousePos);
        if (note != null) {
            dataScore.removeNote( note.getData() as Data_Note );
            return;
        }

        dataScore.addNote(_pos);
        return;
    }
    if ( _type == MouseAction.DRAG ) {
        // const note = pressOnMouse(_mousePos);
        // console.log("drag", note, _pos);
        if (noteOnPress != null) {
            //move getSelectedScoreObjects
            if( noteOnPress.getData() != null ) {
                noteOnPress.getData()!.setTime( _pos )
            }
            
            noteOnPress.setTime( _pos );
            updateScoreObjectPos();
            return;
        }
    }
}
scoreEditor.setCallbackOnMouseInput(onMouseInput);