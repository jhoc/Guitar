import { Diagram } from "./Diagram.js";
import {
    // musicData,
    musicDefinition,
    Pitch
} from "./MusicDefinitions.js";
import {
    jTK_Fraction
} from "./jUITK_Math_Fraction.js";

export class ScorePos {
    bar: number = 0;
    time: jTK_Fraction = new jTK_Fraction( 0, 4);
    repetition: number = 0;
};


export const Staff_Type = Object.freeze({
    SHORT: 'short',
    TAB: 'tab',
    STAFF: 'staff',
})

export class Data_ScoreObject {
    m_barAndTime: ScorePos = new ScorePos;
    constructor(){

    }

    setTime(_time: ScorePos) {
        this.m_barAndTime = _time;
    }
    getTime() : ScorePos {
        return this.m_barAndTime;
    }
}

export class Data_Note extends Data_ScoreObject {
  
    m_duration: jTK_Fraction = new jTK_Fraction( 0, 4);
    m_pitch: Pitch = musicDefinition.pitch( 0 )!;
    constructor() {
  super();
    }

    setDuration(_dur: jTK_Fraction) {
        this.m_duration = _dur;
    }

    getDuration() {
        return this.m_duration;
    }

    setPitch(_pitch: Pitch) {
        this.m_pitch = _pitch;
    }
    getPitch() : Pitch {
        return this.m_pitch;
    }
}

interface onDataChangeType { ( _note: Data_Note ): void };

export class Data_Score {
    m_diagram: Diagram[] = [];
    m_note: Data_Note[] = [];
    m_symbol: any[] = [];
    m_metre: any[] = [];
    // onDataChangeAddNote : ( _note: Data_Note) => void;
    onDataChangeAddNote : onDataChangeType | null = null;
    onDataChangeRemoveNote : onDataChangeType | null = null;

    constructor() {
    }

    getMetreForBar( _i: number ) : jTK_Fraction {
        for (var i = 0; i < this.m_metre.length; i++) {
            //TODO
        }

        if (_i == 0) {
            return (new jTK_Fraction(5, 4));
        }
        if (_i == 1) {
            return (new jTK_Fraction(3, 4));
        }
        return (new jTK_Fraction(4, 4));
    }

    addNote( _pos: ScorePos ) : Data_Note {
        // console.log("addNote", _pos);
        let note = new Data_Note();
        note.setTime(_pos);
        this.m_note.push(note);
        // console.log("pre sort", JSON.stringify(this.m_note));
        this.m_note.sort(this.sortByTime);
        // console.log("after sort", JSON.stringify(this.m_note));
        if( this.onDataChangeAddNote != null ) {
            this.onDataChangeAddNote(note);
        }
        return note;
    }

    removeNote( _note: Data_Note ) : void {
        // console.log( "DataScore.remove", _note );
        for( let i = 0; i < this.m_note.length; i++ ) {
            // console.log( "DataScore.remove test", this.m_note[i] );
            if( _note == this.m_note[i] ) {
                if( this.onDataChangeRemoveNote != null ) {
                this.onDataChangeRemoveNote( this.m_note[i]! );
                }
                this.m_note.splice( i, 1 );
            }
        }
    }

    sortByTime( _a: Data_ScoreObject, _b: Data_ScoreObject ) : number {
        // console.log( "sortByTime", _a, _b );
        if ( _a.getTime().bar < _b.getTime().bar ) {
            return -1;
        }
        if ( _a.getTime().bar > _b.getTime().bar ) {
            return 1;
        }
        if ( _a.getTime().time.smallerThan( _b.getTime().time ) ) {
            return -1;
        }
        return 1;
    }

    // setCallbackChangeAddNote(_func) {
    setCallbackChangeAddNote( _func: onDataChangeType ) : void  {
        this.onDataChangeAddNote = _func;
    }
    setCallbackChangeRemoveNote( _func: onDataChangeType ) : void {
        this.onDataChangeRemoveNote = _func;
    }
}

var dataScore : Data_Score = new Data_Score();
export {
    dataScore
};