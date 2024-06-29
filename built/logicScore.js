import { Score } from "./score.js";
import { musicData } from "./MusicDefinitions.js";
const scoreCanvas = document.getElementById('scoreCanvas');
const score = new Score(scoreCanvas, musicData.instrumentAt(0));
// console.log( scoreCanvas, score );
score.update();
var head = document.getElementById('menuheader');
var element = head.createButton('other', "./images/material-symbols--edit-square-outline-rounded.svg");
head.addHeaderLeftIcon(element);
element.addEventListener("click", e => {
    console.log("Edit");
    // document.getElementById( 'editor-diagramSelector').style.
});
//# sourceMappingURL=logicScore.js.map