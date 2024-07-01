import { ScoreEditor } from "./scoreEditor";
import { ScoreObject } from "./scoreObjects";

var objInBar: ScoreObject[][] = [];

// _scoreObjects need to be sorted!!!
export function algo_lin_setXPos( _scoreObjects: ScoreObject[], _scoreParameters: any, _scoreEditor: ScoreEditor ) {
// console.log( "algo-> " );
    objInBar = [];
    // objInBar.push([]);
    splitToBars( _scoreObjects, _scoreEditor );
    // if( _scoreObjects == undefined ) return;
    // console.log("algo", JSON.stringify( objInBar ) );

    var yNote = _scoreParameters.staffYPos;
    // for (let i = 0; i < _scoreObjects.length; i++) {
    //     // _scoreObjects[i].setX(100);
    //     _scoreObjects[i].setY(yNote);
    // }
    var xBarOff = 0;
    xBarOff += _scoreParameters.marginHor;
    console.log("algo", objInBar );
    for( var i = 0; i < objInBar.length; i++ ) {
        let scoreW = _scoreEditor.barWidth( i );
        for( let j = 0; j < objInBar[i]!.length; j++ ) {
            let fac = 1 / _scoreEditor.getData().getMetreForBar( i ).toNum();
            objInBar[i]![j]!.setX( xBarOff + (objInBar[i]![j]!.getTime().time.toNum() * fac * scoreW) );
            objInBar[i]![j]!.setY( yNote );
        }
    
        xBarOff += scoreW;
    }
}

function splitToBars( _scoreObjects: ScoreObject[], _scoreEditor: ScoreEditor ) {
    var bar: ScoreObject[] = [];
    var lastBar = _scoreEditor.getBarRange().begin;
    // console.log( "splitToBars obj ", _scoreEditor.getBarRange() );
    var barX = 0;
    var count = 0;
    for (var i = 0; i < _scoreObjects.length; ) {
        if( _scoreObjects[i]!.getTime().bar < _scoreEditor.getBarRange().begin) continue;
        if( _scoreObjects[i]!.getTime().bar > _scoreEditor.getBarRange().end) return;
if( count > 10 ) {
    console.log( "Crashbug" );
    return;
}
// console.log( "splitToBars lastBar ", lastBar, "obj: ", _scoreObjects[i].getTime().bar, _scoreObjects[i].getTime().time.toString() );

        if( _scoreObjects[i]!.getTime().bar  == lastBar ) {
_scoreObjects[i]!.setX( barX );
            bar.push( _scoreObjects[i]! );
            lastBar = _scoreObjects[i]!.getTime().bar;
            i++;
        } else {
            barX += _scoreEditor.barWidth( lastBar );
            // console.log( "algo:split. add at bar ", lastBar, ": ", bar, ", i: ", i, ", max ", _scoreObjects.length );
            objInBar.push( bar );
            lastBar++;

            bar = [];
            // i++;
        }
        count++;
    }
    objInBar.push( bar );
}