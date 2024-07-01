import {
    adaptEditorSize,
    setEditorDiagram,
    getEditorDiagram
} from './logicDiagramEditor.js'

import {
    DiagramList
} from './diagramList.js'
import {
    musicData
} from "./MusicDefinitions.js";
import {
    LayoutProperties
} from "./diagramList.js"
import { Diagram } from './Diagram.js';
import {
    MenuHeader
} from "./menuHeader.js"

const editDiagramList: HTMLButtonElement = document.getElementById('edit-diagramList') as HTMLButtonElement;
const deleteDiagramList: HTMLButtonElement = document.getElementById('delete-diagramList') as HTMLButtonElement;

const scrollDiagramListCanvas: HTMLElement = document.getElementById('scroll-editor-diagramList') as HTMLDivElement;
const diagramListCanvas: HTMLCanvasElement = document.getElementById('diagramList') as HTMLCanvasElement;
const diagramList: DiagramList = new DiagramList(diagramListCanvas, musicData.instrumentAt(0)!);
const dialog: HTMLDialogElement = document.getElementById("dialog") as HTMLDialogElement || null;
deleteDiagramList.addEventListener('click', function () {
    // console.log("removeDiaFromList")
    diagramList.removeDiagram(diagramList.getSelectedDiagramIndex());
    adaptSize();
    setPositionForSelected(diagramList.getSelectedDiagramPos());
});

editDiagramList.addEventListener('click', function () : void {
    dialog.showModal();
    if( diagramList.getSelectedDiagram() == undefined ) return;
    setEditorDiagram(diagramList.getSelectedDiagram()!);
    // setEditorMaxWidth( document.getElementById("dialog").clientWidth );
    adaptEditorSize(); //file logicDiagramEditor.js
})
if( document.getElementById("dialogCloseButton") != null ) {
document.getElementById("dialogCloseButton")!.addEventListener('click', function () : void {
    diagramList.setSelectedDiagram(getEditorDiagram());
    dialog.close();
    diagramList.update();
})
}

dialog.addEventListener("click", e => {
    const dialogDimensions: DOMRect = dialog.getBoundingClientRect()
    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
        dialog.close()
    }
})

// // callbacks connect dia and diaList
function setEditor( _dia: Diagram ) : void {
    // console.log( "mouseOverDia in List" );
    setPositionForSelected(diagramList.getSelectedDiagramPos());
}
diagramList.setCallbackOnSelectDiagram(setEditor);


function setPositionForSelected( _yPos: number | undefined ) : void {
    if (_yPos == undefined) {
        // diagramSelector.style.display = 'none';
        return;
    }
    // console.log( "logiDiaList setPoSel", scrollDiagramListCanvas.scrollLeft );

    //diagramSelector ist in scroll div. 
    //div hat den style parameter(position: relative;), 
    //damit beziehen sich alle children mit dem style parameter(position: absolute;) auf den parent
    // deswegen reicht es die position des diagram auf dem canvas zu wissen
    let listProp: LayoutProperties = diagramList.getLayoutProperties();
    let x: number = (listProp.gapBtwDiaMargin) + scrollDiagramListCanvas.scrollLeft;
    let y: number = _yPos;
    y += editDiagramList.clientHeight / 2;

    diagramList.setScrollLeftAmount(scrollDiagramListCanvas.scrollLeft);
    x += scrollDiagramListCanvas.clientWidth - 10;

    x -= deleteDiagramList.clientWidth;
    deleteDiagramList.style.left = x + 'px';
    deleteDiagramList.style.top = y + 'px';

    x -= editDiagramList.clientWidth + 10;
    editDiagramList.style.left = x + 'px';
    editDiagramList.style.top = y + 'px';
}

window.addEventListener('resize', function (event: UIEvent) {
    adaptSize();
    setPositionForSelected(diagramList.getSelectedDiagramPos());
}, true);

function adaptSize() : void {
    // return;
    // console.log( "logicDiagramList:adaptSize" );
    const scrollbarWidthVer: number = scrollDiagramListCanvas.offsetHeight - scrollDiagramListCanvas.clientHeight;
    var windowH = window.innerHeight - diagramListCanvas.getBoundingClientRect().top;
    if (windowH < diagramList.minHeight()) {
        windowH = diagramList.minHeight();
    }
    var canvasH = diagramListCanvas.getBoundingClientRect().height + scrollbarWidthVer;
    // console.log( "logic dia editor.resize", windowH, canvasH, scrollDiagramListCanvas.getBoundingClientRect().height, scrollbarWidthVer );

    if (windowH > canvasH) {
        scrollDiagramListCanvas.style.height = canvasH + 'px';
    } else {
        scrollDiagramListCanvas.style.height = windowH + 'px';
    }

    // console.log("logiDialist", window.innerHeight, windowH, canvasH );


    const scrollbarWidthHor: number = scrollDiagramListCanvas.offsetWidth - scrollDiagramListCanvas.clientWidth;
    // console.log( scrollbarWidthHor );
    var windowW : number = document.body.clientWidth;
    var canvasW: number = diagramListCanvas.getBoundingClientRect().width + scrollbarWidthHor;
    // console.log( "logic dia editor.resize", windowW, canvasW, scrollDiagramListCanvas.getBoundingClientRect().width );

    if ( windowW > canvasW ) {
        // console.log( "logicDiaEdit maxW");
        scrollDiagramListCanvas.style.width = canvasW + 'px';
    } else {
        // console.log( "logicDiaEdit apaptW");
        scrollDiagramListCanvas.style.width = windowW + 'px';
    }
}

window.addEventListener('load', function () : void {
    // console.log('All assets are loaded')
    adaptSize();
    adaptSize(); // 2 mal wg scrollbar, beim ersten mal noch nicht gesetzt
    setPositionForSelected(diagramList.getSelectedDiagramPos());
})

scrollDiagramListCanvas.addEventListener('scroll', function () : void {
    // console.log( "scroll" );
    setPositionForSelected(diagramList.getSelectedDiagramPos());
})


// add button to headerbar
var head = document.getElementById('menuheader') as MenuHeader || null;
element = head.createButton('other', "./images/ic--round-plus.svg");
head.addHeaderRightIcon(element);
element.addEventListener('click', function () {
    diagramList.addDiagram(musicData.instrumentAt(0)!);
    adaptSize();
})

var element = head.createButton('other', "");
head.addHeaderRightIcon(element);
element.addEventListener('click', function () {
    console.log("other");
})