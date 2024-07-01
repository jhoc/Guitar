import {
    Score
} from "./score.js"
import {
    musicData
} from "./MusicDefinitions.js";
import {
    MenuHeader
} from "./menuHeader.js"


const scoreCanvas: HTMLCanvasElement = document.getElementById('scoreCanvas') as HTMLCanvasElement;
const score: Score = new Score(scoreCanvas, musicData.instrumentAt(0)!);
// console.log( scoreCanvas, score );
score.update();

var head: MenuHeader = document.getElementById('menuheader') as MenuHeader;
var element: HTMLButtonElement = head.createButton('other', "./images/material-symbols--edit-square-outline-rounded.svg");
head.addHeaderLeftIcon(element);
element.addEventListener("click", e => {
console.log( "Edit" );
// document.getElementById( 'editor-diagramSelector').style.
});