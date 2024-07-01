export function isEqualFretboardCoord(_a, _b) {
    if (_a.fret == _b.fret && _a.saite == _b.saite)
        return true;
    return false;
}
class Pitch {
    constructor(_name, _pitch, _octave, _index) {
        this.m_name = "";
        this.m_name = _name;
        this.m_pitch = _pitch;
        this.m_octave = _octave;
        this.m_index = _index;
    }
    name() {
        return this.m_name;
    }
    pitch() {
        return this.m_pitch;
    }
    octave() {
        return this.m_octave;
    }
    index() {
        return this.m_index;
    }
}
export { Pitch };
class Instrument {
    constructor(_name, _pitch, _fretNum) {
        this.m_name = _name;
        this.m_pitch = _pitch;
        this.m_fretNum = _fretNum;
        // console.log( this );
    }
    name() {
        //  console.log( "Instrument::this.name()", this.m_name );
        return this.m_name;
    }
    pitch() {
        //    console.log( "Instrument::this.pitch()", this.m_pitch );
        return this.m_pitch;
    }
    pitchAt(i) {
        //      console.log( "Instrument::this.pitch(i)", this.m_pitch[i] );
        if (this.m_pitch[i] == undefined)
            return null;
        return this.m_pitch[i];
    }
    fretNum() {
        return this.m_fretNum;
    }
    pitchFromCoord(_coord) {
        // console.log( "PitchFromCoord", _coord, this.m_pitch[_coord[1]].index() + _coord[0], musicDefinition.pitch( this.m_pitch[_coord[1]].index() + _coord[0] ) );
        if (this.m_pitch[_coord.saite] == undefined)
            return null;
        return musicDefinition.pitch(this.m_pitch[_coord.saite].index() + _coord.fret);
    }
}
export { Instrument };
class Intervall {
    constructor(_name, _halfsteps) {
        this.m_name = _name;
        this.m_halfsteps = _halfsteps;
    }
    name() {
        return this.m_name;
    }
    halfstep() {
        return this.m_halfsteps;
    }
}
class MusicDefinition {
    constructor() {
        this.m_pitch = [];
        this.m_intervall = [];
        // this.m_pitch = [];
        // this.m_intervall = [];
        this.initPitches = this.initPitches.bind(this); // Binden Sie 'this' an die Methode
        this.initIntervalls = this.initIntervalls.bind(this);
        this.initPitches();
        this.initIntervalls();
    }
    initPitches() {
        // console.log( "initPitches" );
        let m_pitchNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        for (let i = 0; i < 120; i++) {
            this.m_pitch.push(new Pitch(m_pitchNames[i % 12], i % 12, Math.floor(i / 12), i));
            // _name: string, _pitch: number, _octave: number, _index: number 
        }
    }
    initIntervalls() {
        this.m_intervall.push(new Intervall('1', 0));
        this.m_intervall.push(new Intervall('b2', 1));
        this.m_intervall.push(new Intervall('#2', 2));
        this.m_intervall.push(new Intervall('b3', 3));
        this.m_intervall.push(new Intervall('#2', 4));
        this.m_intervall.push(new Intervall('4', 5));
        this.m_intervall.push(new Intervall('b5', 6));
        this.m_intervall.push(new Intervall('5', 7));
        this.m_intervall.push(new Intervall('b6', 8));
        this.m_intervall.push(new Intervall('#6', 9));
        this.m_intervall.push(new Intervall('b7', 10));
        this.m_intervall.push(new Intervall('#7', 11));
    }
    pitch(_i) {
        //  console.log( this.m_pitch[_i] );
        if (this.m_pitch[_i] == undefined)
            return null;
        return this.m_pitch[_i];
    }
    pitchFromNameAndOctave(_name, _octave) {
        for (let i = _octave * 12; i < (_octave + 1) * 12; i++) {
            if (this.m_pitch[i] == undefined)
                return null;
            if (this.m_pitch[i].name() == _name) {
                return this.m_pitch[i];
            }
        }
        return null;
    }
    getPitchFromJson(_json) {
        for (const key in _json) {
            // console.log("getInstr:" ,key, _json[key]);
            if (key == 'm_index') {
                if (this.m_pitch[_json[key]] == undefined)
                    return null;
                return this.m_pitch[_json[key]];
            }
        }
        return null;
    }
    intervall(_i) {
        if (this.m_intervall[_i] == undefined)
            return null;
        return this.m_intervall[_i];
    }
}
const musicDefinition = new MusicDefinition();
export { musicDefinition };
export class IntervallArray {
    constructor(_name, _array) {
        this.m_index = -1;
        this.m_name = _name;
        this.m_intervall = _array;
        // console.log( _array );
    }
    setIndex(_index) {
        this.m_index = _index;
    }
    index() {
        return this.m_index;
    }
    name() {
        return this.m_name;
    }
    intervall() {
        return this.m_intervall;
    }
    intervallAt(_i) {
        if (this.m_intervall[_i] == undefined)
            return null;
        return this.m_intervall[_i];
    }
}
export class ChordFingering {
    constructor(_name, _array) {
        this.m_index = -1;
        this.m_name = _name;
        this.m_fingering = _array;
    }
    setIndex(_i) {
        this.m_index = _i;
    }
    index() {
        return this.m_index;
    }
    name() {
        return this.m_name;
    }
    fingering() {
        return this.m_fingering;
    }
    fingeringAt(_i) {
        if (this.m_fingering[_i] == undefined)
            return null;
        return this.m_fingering[_i];
    }
}
class MusicData {
    constructor() {
        this.chordIndex = 0;
        this.m_instrument = [];
        this.m_chord = [];
        this.m_scale = [];
        this.scaleIndex = 0;
        this.m_pitch = [];
        this.m_chordFingering = [];
        this.m_chordFingeringIndex = 0;
        this.m_scaleFingering = [];
        this.m_scaleFingeringIndex = 0;
        // this.m_instrument = [];
        // this.m_chord = [];
        // this.chordIndex = 0;
        // this.m_scale = [];
        // this.scaleIndex = 0;
        // this.m_pitch = [];
        for (let i = 0; i < 12; i++) {
            this.m_pitch.push(musicDefinition.pitch(i));
        }
        // this.m_rootArray;
        this.m_rootArray = new IntervallArray("Root", [musicDefinition.intervall(0)]);
        // this.m_chordFingering = [];
        // this.m_chordFingeringIndex = 0;
        // this.m_scaleFingering = [];
    }
    rootArray() {
        return this.m_rootArray;
    }
    pitch() {
        return this.m_pitch;
    }
    pitchAt(_i) {
        if (this.m_pitch[_i] == undefined)
            return null;
        return this.m_pitch[_i];
    }
    instrument() {
        return this.m_instrument;
    }
    instrumentAt(_i) {
        //  console.log( "MusicData::instrument()", this.m_instrument[_i] );
        if (this.m_instrument[_i] == undefined)
            return null;
        return this.m_instrument[_i];
    }
    addInstrument(_instr) {
        this.m_instrument.push(_instr);
    }
    instrumentFromName(_name) {
        for (var i = 0; i < this.m_instrument.length; i++) {
            if (_name == this.m_instrument[i].name()) {
                return this.m_instrument[i];
            }
        }
        return null;
    }
    getInstrumentFromJson(_json) {
        for (const key in _json) {
            // console.log("getInstr:" ,key, _json[key]);
            if (key == 'm_name') {
                //if not found recreate instrument
                return this.instrumentFromName(_json[key]);
            }
        }
        return this.m_instrument[0];
    }
    chord() {
        return this.m_chord;
    }
    chordAt(_i) {
        if (this.m_chord[_i] == undefined)
            return null;
        return this.m_chord[_i];
    }
    chordFromName(_name) {
        // console.log( "chordFromName", _name );
        for (var i = 0; i < this.m_chord.length; i++) {
            // console.log( "chordFromName check", this.m_chord[i].name() );
            if (_name == this.m_chord[i].name()) {
                return this.m_chord[i];
            }
        }
        return null;
    }
    addChord(_chord) {
        _chord.setIndex(this.chordIndex++);
        this.m_chord.push(_chord);
    }
    getChordFromJson(_json) {
        for (const key in _json) {
            // console.log("getInstr:" ,key, _json[key]);
            if (key == 'm_name') {
                return this.chordFromName(_json[key]);
            }
        }
        return null;
    }
    scale() {
        return this.m_scale;
    }
    scaleAt(_i) {
        if (this.m_scale[_i] == undefined)
            return null;
        return this.m_scale[_i];
    }
    scaleFromName(_name) {
        for (var i = 0; i < this.m_scale.length; i++) {
            if (_name == this.m_scale[i].name()) {
                return this.m_scale[i];
            }
        }
        return null;
    }
    addScale(_scale) {
        _scale.setIndex(this.scaleIndex++);
        this.m_scale.push(_scale);
    }
    getScaleFromJson(_json) {
        for (const key in _json) {
            // console.log("getInstr:" ,key, _json[key]);
            if (key == 'm_name') {
                return this.scaleFromName(_json[key]);
            }
        }
        return null;
    }
    chordFingering() {
        return this.m_chordFingering;
    }
    chordFingeringAt(_i) {
        if (this.m_chordFingering[_i] == undefined)
            return null;
        return this.m_chordFingering[_i];
    }
    chordFingeringFromName(_name) {
        for (var i = 0; i < this.m_chordFingering.length; i++) {
            if (_name == this.m_chordFingering[i].name()) {
                return this.m_chordFingering[i];
            }
        }
        return null;
    }
    addChordFingering(_fing) {
        _fing.setIndex(this.m_chordFingeringIndex++);
        this.m_chordFingering.push(_fing);
    }
    getChordFingeringFromJson(_json) {
        for (const key in _json) {
            // console.log("getInstr:" ,key, _json[key]);
            if (key == 'm_name') {
                return this.chordFingeringFromName(_json[key]);
            }
        }
    }
    scaleFingering() {
        return this.m_scaleFingering;
    }
    scaleFingeringAt(_i) {
        if (this.m_scaleFingering[_i] == undefined)
            return null;
        return this.m_scaleFingering[_i];
    }
    addscaleFingering(_fing) {
        // _fing.setIndex(this.m_scaleFingeringIndex++);
        this.m_scaleFingering.push(_fing);
    }
}
let musicData = new MusicData();
let gPitches = [];
if (musicDefinition.pitchFromNameAndOctave('E', 5) != null) {
    gPitches.push(musicDefinition.pitchFromNameAndOctave('E', 5));
}
if (musicDefinition.pitchFromNameAndOctave('B', 4) != null) {
    gPitches.push(musicDefinition.pitchFromNameAndOctave('B', 4));
}
if (musicDefinition.pitchFromNameAndOctave('G', 4) != null) {
    gPitches.push(musicDefinition.pitchFromNameAndOctave('G', 4));
}
if (musicDefinition.pitchFromNameAndOctave('D', 4) != null) {
    gPitches.push(musicDefinition.pitchFromNameAndOctave('D', 4));
}
if (musicDefinition.pitchFromNameAndOctave('B', 3) != null) {
    gPitches.push(musicDefinition.pitchFromNameAndOctave('A', 3));
}
if (musicDefinition.pitchFromNameAndOctave('E', 2) != null) {
    gPitches.push(musicDefinition.pitchFromNameAndOctave('E', 2));
}
let guitarInstr = new Instrument("Guitar", gPitches, 24);
musicData.addInstrument(guitarInstr);
let gitPitches = [];
gitPitches.push(musicDefinition.intervall(0));
gitPitches.push(musicDefinition.intervall(2));
gitPitches.push(musicDefinition.intervall(4));
gitPitches.push(musicDefinition.intervall(5));
gitPitches.push(musicDefinition.intervall(7));
gitPitches.push(musicDefinition.intervall(9));
gitPitches.push(musicDefinition.intervall(11));
// console.log( "add Ionian" );
let scale = new IntervallArray("Ionian", gitPitches);
musicData.addScale(scale);
gitPitches = [];
gitPitches.push(musicDefinition.intervall(0));
gitPitches.push(musicDefinition.intervall(2));
gitPitches.push(musicDefinition.intervall(3));
gitPitches.push(musicDefinition.intervall(5));
gitPitches.push(musicDefinition.intervall(7));
gitPitches.push(musicDefinition.intervall(9));
gitPitches.push(musicDefinition.intervall(10));
// console.log( "add Ionian" );
scale = new IntervallArray("Dorian", gitPitches);
musicData.addScale(scale);
gitPitches = [];
gitPitches.push(musicDefinition.intervall(0));
gitPitches.push(musicDefinition.intervall(2));
gitPitches.push(musicDefinition.intervall(4));
gitPitches.push(musicDefinition.intervall(5));
gitPitches.push(musicDefinition.intervall(7));
gitPitches.push(musicDefinition.intervall(9));
gitPitches.push(musicDefinition.intervall(10));
scale = new IntervallArray("Mixolydian", gitPitches);
// console.log( "add aeoli" );
musicData.addScale(scale);
gitPitches = [];
gitPitches.push(musicDefinition.intervall(0));
gitPitches.push(musicDefinition.intervall(2));
gitPitches.push(musicDefinition.intervall(3));
gitPitches.push(musicDefinition.intervall(5));
gitPitches.push(musicDefinition.intervall(6));
gitPitches.push(musicDefinition.intervall(8));
gitPitches.push(musicDefinition.intervall(10));
scale = new IntervallArray("Aeolian", gitPitches);
// console.log( "add aeoli" );
musicData.addScale(scale);
gitPitches = [];
gitPitches.push(musicDefinition.intervall(0));
gitPitches.push(musicDefinition.intervall(4));
gitPitches.push(musicDefinition.intervall(7));
let chord = new IntervallArray("Major", gitPitches);
// console.log( "add aeoli" );
musicData.addChord(chord);
gitPitches = [];
gitPitches.push(musicDefinition.intervall(0));
gitPitches.push(musicDefinition.intervall(4));
gitPitches.push(musicDefinition.intervall(7));
gitPitches.push(musicDefinition.intervall(11));
chord = new IntervallArray("Major 7", gitPitches);
// console.log( "add aeoli" );
musicData.addChord(chord);
gitPitches = [];
gitPitches.push(musicDefinition.intervall(0));
gitPitches.push(musicDefinition.intervall(4));
gitPitches.push(musicDefinition.intervall(7));
gitPitches.push(musicDefinition.intervall(10));
chord = new IntervallArray("Dom 7", gitPitches);
// console.log( "add aeoli" );
musicData.addChord(chord);
gitPitches = [];
gitPitches.push(musicDefinition.intervall(0));
gitPitches.push(musicDefinition.intervall(3));
gitPitches.push(musicDefinition.intervall(7));
chord = new IntervallArray("Minor", gitPitches);
// console.log( "add aeoli" );
musicData.addChord(chord);
gitPitches = [];
gitPitches.push(musicDefinition.intervall(0));
gitPitches.push(musicDefinition.intervall(3));
gitPitches.push(musicDefinition.intervall(7));
gitPitches.push(musicDefinition.intervall(10));
chord = new IntervallArray("Minor 7", gitPitches);
// console.log( "add aeoli" );
musicData.addChord(chord);
// 0,1,2,3
// let fingering = new ChordFingering( "Drop 2", [1, 0, 2, 3] );
let fingering = new ChordFingering("Closed", [0, 2, 3, 1]);
fingering = new ChordFingering("Drop 2", [0, 2, 3, 1]);
musicData.addChordFingering(fingering);
// fingering = new ChordFingering( "Drop 3", [2, 0, 1, 3] );
fingering = new ChordFingering("Drop 3", [0, 3, 1, 2]);
musicData.addChordFingering(fingering);
fingering = new ChordFingering("Drop 12", [0, 1, 3, 2]);
musicData.addChordFingering(fingering);
fingering = new ChordFingering("Drop 23", [0, 3, 2, 1]);
musicData.addChordFingering(fingering);
musicData.addscaleFingering("Narrow");
musicData.addscaleFingering("3 per String");
export { musicData };
//# sourceMappingURL=MusicDefinitions.js.map