import { adaptEditorSize, setEditorDiagram, getEditorDiagram } from './logicDiagramEditor.js';
import { DiagramList } from './diagramList.js';
import { musicData } from "./MusicDefinitions.js";
const editDiagramList = document.getElementById('edit-diagramList');
const deleteDiagramList = document.getElementById('delete-diagramList');
const scrollDiagramListCanvas = document.getElementById('scroll-editor-diagramList');
const diagramListCanvas = document.getElementById('diagramList');
const diagramList = new DiagramList(diagramListCanvas, musicData.instrumentAt(0));
const dialog = document.getElementById("dialog") || null;
deleteDiagramList.addEventListener('click', function () {
    // console.log("removeDiaFromList")
    diagramList.removeDiagram(diagramList.getSelectedDiagramIndex());
    adaptSize();
    setPositionForSelected(diagramList.getSelectedDiagramPos());
});
editDiagramList.addEventListener('click', function () {
    dialog.showModal();
    if (diagramList.getSelectedDiagram() == undefined)
        return;
    setEditorDiagram(diagramList.getSelectedDiagram());
    // setEditorMaxWidth( document.getElementById("dialog").clientWidth );
    adaptEditorSize(); //file logicDiagramEditor.js
});
if (document.getElementById("dialogCloseButton") != null) {
    document.getElementById("dialogCloseButton").addEventListener('click', function () {
        diagramList.setSelectedDiagram(getEditorDiagram());
        dialog.close();
        diagramList.update();
    });
}
dialog.addEventListener("click", e => {
    const dialogDimensions = dialog.getBoundingClientRect();
    if (e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom) {
        dialog.close();
    }
});
// // callbacks connect dia and diaList
function setEditor(_dia) {
    // console.log( "mouseOverDia in List" );
    setPositionForSelected(diagramList.getSelectedDiagramPos());
}
diagramList.setCallbackOnSelectDiagram(setEditor);
function setPositionForSelected(_yPos) {
    if (_yPos == undefined) {
        // diagramSelector.style.display = 'none';
        return;
    }
    // console.log( "logiDiaList setPoSel", scrollDiagramListCanvas.scrollLeft );
    //diagramSelector ist in scroll div. 
    //div hat den style parameter(position: relative;), 
    //damit beziehen sich alle children mit dem style parameter(position: absolute;) auf den parent
    // deswegen reicht es die position des diagram auf dem canvas zu wissen
    let listProp = diagramList.getLayoutProperties();
    let x = (listProp.gapBtwDiaMargin) + scrollDiagramListCanvas.scrollLeft;
    let y = _yPos;
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
window.addEventListener('resize', function (event) {
    adaptSize();
    setPositionForSelected(diagramList.getSelectedDiagramPos());
}, true);
function adaptSize() {
    // return;
    // console.log( "logicDiagramList:adaptSize" );
    const scrollbarWidthVer = scrollDiagramListCanvas.offsetHeight - scrollDiagramListCanvas.clientHeight;
    var windowH = window.innerHeight - diagramListCanvas.getBoundingClientRect().top;
    if (windowH < diagramList.minHeight()) {
        windowH = diagramList.minHeight();
    }
    var canvasH = diagramListCanvas.getBoundingClientRect().height + scrollbarWidthVer;
    // console.log( "logic dia editor.resize", windowH, canvasH, scrollDiagramListCanvas.getBoundingClientRect().height, scrollbarWidthVer );
    if (windowH > canvasH) {
        scrollDiagramListCanvas.style.height = canvasH + 'px';
    }
    else {
        scrollDiagramListCanvas.style.height = windowH + 'px';
    }
    // console.log("logiDialist", window.innerHeight, windowH, canvasH );
    const scrollbarWidthHor = scrollDiagramListCanvas.offsetWidth - scrollDiagramListCanvas.clientWidth;
    // console.log( scrollbarWidthHor );
    var windowW = document.body.clientWidth;
    var canvasW = diagramListCanvas.getBoundingClientRect().width + scrollbarWidthHor;
    // console.log( "logic dia editor.resize", windowW, canvasW, scrollDiagramListCanvas.getBoundingClientRect().width );
    if (windowW > canvasW) {
        // console.log( "logicDiaEdit maxW");
        scrollDiagramListCanvas.style.width = canvasW + 'px';
    }
    else {
        // console.log( "logicDiaEdit apaptW");
        scrollDiagramListCanvas.style.width = windowW + 'px';
    }
}
window.addEventListener('load', function () {
    // console.log('All assets are loaded')
    adaptSize();
    adaptSize(); // 2 mal wg scrollbar, beim ersten mal noch nicht gesetzt
    setPositionForSelected(diagramList.getSelectedDiagramPos());
});
scrollDiagramListCanvas.addEventListener('scroll', function () {
    // console.log( "scroll" );
    setPositionForSelected(diagramList.getSelectedDiagramPos());
});
// add button to headerbar
var head = document.getElementById('menuheader') || null;
element = head.createButton('other', "./images/ic--round-plus.svg");
head.addHeaderRightIcon(element);
element.addEventListener('click', function () {
    diagramList.addDiagram(musicData.instrumentAt(0));
    adaptSize();
});
var element = head.createButton('other', "");
head.addHeaderRightIcon(element);
element.addEventListener('click', function () {
    console.log("other");
});
//# sourceMappingURL=logicDiagramList.js.map