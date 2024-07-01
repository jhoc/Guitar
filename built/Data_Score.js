import { 
// musicData,
musicDefinition } from "./MusicDefinitions.js";
import { jTK_Fraction } from "./jUITK_Math_Fraction.js";
export class ScorePos {
    constructor() {
        this.bar = 0;
        this.time = new jTK_Fraction(0, 4);
        this.repetition = 0;
    }
}
;
export const Staff_Type = Object.freeze({
    SHORT: 'short',
    TAB: 'tab',
    STAFF: 'staff',
});
export class Data_ScoreObject {
    constructor() {
        this.m_barAndTime = new ScorePos;
    }
    setTime(_time) {
        this.m_barAndTime = _time;
    }
    getTime() {
        return this.m_barAndTime;
    }
}
export class Data_Note extends Data_ScoreObject {
    constructor() {
        super();
        this.m_duration = new jTK_Fraction(0, 4);
        this.m_pitch = musicDefinition.pitch(0);
    }
    setDuration(_dur) {
        this.m_duration = _dur;
    }
    getDuration() {
        return this.m_duration;
    }
    setPitch(_pitch) {
        this.m_pitch = _pitch;
    }
    getPitch() {
        return this.m_pitch;
    }
}
;
export class Data_Score {
    constructor() {
        this.m_diagram = [];
        this.m_note = [];
        this.m_symbol = [];
        this.m_metre = [];
        // onDataChangeAddNote : ( _note: Data_Note) => void;
        this.onDataChangeAddNote = null;
        this.onDataChangeRemoveNote = null;
    }
    getMetreForBar(_i) {
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
    addNote(_pos) {
        // console.log("addNote", _pos);
        let note = new Data_Note();
        note.setTime(_pos);
        this.m_note.push(note);
        // console.log("pre sort", JSON.stringify(this.m_note));
        this.m_note.sort(this.sortByTime);
        // console.log("after sort", JSON.stringify(this.m_note));
        if (this.onDataChangeAddNote != null) {
            this.onDataChangeAddNote(note);
        }
        return note;
    }
    removeNote(_note) {
        // console.log( "DataScore.remove", _note );
        for (let i = 0; i < this.m_note.length; i++) {
            // console.log( "DataScore.remove test", this.m_note[i] );
            if (_note == this.m_note[i]) {
                if (this.onDataChangeRemoveNote != null) {
                    this.onDataChangeRemoveNote(this.m_note[i]);
                }
                this.m_note.splice(i, 1);
            }
        }
    }
    sortByTime(_a, _b) {
        // console.log( "sortByTime", _a, _b );
        if (_a.getTime().bar < _b.getTime().bar) {
            return -1;
        }
        if (_a.getTime().bar > _b.getTime().bar) {
            return 1;
        }
        if (_a.getTime().time.smallerThan(_b.getTime().time)) {
            return -1;
        }
        return 1;
    }
    // setCallbackChangeAddNote(_func) {
    setCallbackChangeAddNote(_func) {
        this.onDataChangeAddNote = _func;
    }
    setCallbackChangeRemoveNote(_func) {
        this.onDataChangeRemoveNote = _func;
    }
}
var dataScore = new Data_Score();
export { dataScore };
//# sourceMappingURL=Data_Score.js.map