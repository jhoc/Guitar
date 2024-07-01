
export type FretboardCoord = { fret: number, saite: number };
export function isEqualFretboardCoord( _a: FretboardCoord, _b: FretboardCoord ) : boolean {
    if( _a.fret == _b.fret && _a.saite == _b.saite) return true;
    return false;
}

class Pitch {
    m_name: string = "";
    m_pitch: number;
    m_octave: number;
    m_index: number;

    constructor(_name: string, _pitch: number, _octave: number, _index: number ) {
        this.m_name = _name;
        this.m_pitch = _pitch;
        this.m_octave = _octave;
        this.m_index = _index;
    }

    name() : string {
        return this.m_name;
    }

    pitch() : number {
        return this.m_pitch;
    }

    octave() : number {
        return this.m_octave;
    }

    index() : number {
        return this.m_index;
    }
}
export {
    Pitch
};

class Instrument {
    m_name: string;
    m_pitch : Pitch[];
    m_fretNum: number;

    constructor( _name: string, _pitch: Pitch[], _fretNum: number ) {
        this.m_name = _name;
        this.m_pitch = _pitch;
        this.m_fretNum = _fretNum;
        // console.log( this );
    }

    name() : string {
        //  console.log( "Instrument::this.name()", this.m_name );
        return this.m_name;
    }
    pitch() : Pitch[] {
        //    console.log( "Instrument::this.pitch()", this.m_pitch );
        return this.m_pitch;
    }
    pitchAt( i: number ) : Pitch | null {
        //      console.log( "Instrument::this.pitch(i)", this.m_pitch[i] );
        if( this.m_pitch[i] == undefined ) return null;
        return this.m_pitch[i];
    }
    fretNum() : number {
        return this.m_fretNum;
    }

    pitchFromCoord( _coord: FretboardCoord ): Pitch | null {
        // console.log( "PitchFromCoord", _coord, this.m_pitch[_coord[1]].index() + _coord[0], musicDefinition.pitch( this.m_pitch[_coord[1]].index() + _coord[0] ) );
        if( this.m_pitch[_coord.saite] == undefined ) return null;
        return musicDefinition.pitch( this.m_pitch[_coord.saite]!.index() + _coord.fret );
    }
}
export {
    Instrument
};

class Intervall {
    m_name: string;
    m_halfsteps: number;
    constructor( _name: string, _halfsteps: number ) {
        this.m_name = _name;
        this.m_halfsteps = _halfsteps;
    }

    name() : string {
        return this.m_name;
    }

    halfstep() : number {
        return this.m_halfsteps;
    }
}


class MusicDefinition {
m_pitch : Pitch[] = [];
m_intervall : Intervall[] = [];

    constructor() {
        // this.m_pitch = [];
        // this.m_intervall = [];
        this.initPitches = this.initPitches.bind(this); // Binden Sie 'this' an die Methode
        this.initIntervalls = this.initIntervalls.bind(this);

        this.initPitches();
        this.initIntervalls();
    }

    initPitches() : void {
        // console.log( "initPitches" );

        let m_pitchNames: string[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        for (let i: number = 0; i < 120; i++) {
            this.m_pitch.push( new Pitch( m_pitchNames[i % 12]!, i % 12, Math.floor(i / 12), i ) );
            // _name: string, _pitch: number, _octave: number, _index: number 
        }
    }

    initIntervalls() :void {
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

    pitch( _i: number ) : Pitch | null {
        //  console.log( this.m_pitch[_i] );
        if( this.m_pitch[_i] == undefined ) return null;
        return this.m_pitch[_i];
    }

    pitchFromNameAndOctave( _name: string , _octave: number ) : Pitch | null {
        for (let i = _octave * 12; i < (_octave + 1) * 12; i++) {
            if( this.m_pitch[i] == undefined ) return null;
            if (this.m_pitch[i]!.name() == _name) {
                return this.m_pitch[i]!;
            }
        }
        return null;
    }

    getPitchFromJson( _json: any ) : Pitch | null {
        for (const key in _json) {
            // console.log("getInstr:" ,key, _json[key]);
            if (key == 'm_index') {
                if( this.m_pitch[_json[key]] == undefined ) return null;
                return this.m_pitch[_json[key]]!;
            }
        }
        return null;
    }

    intervall( _i: number ) : Intervall | null {
        if( this.m_intervall[_i] == undefined ) return null;
        return this.m_intervall[_i];
    }
}
const musicDefinition = new MusicDefinition();
export {
    musicDefinition
};


export class IntervallArray {
    m_index: number;
    m_name: string;
    m_intervall;
    constructor( _name: string, _array: Intervall[] ) {
        this.m_index = -1;
        this.m_name = _name;
        this.m_intervall = _array;
        // console.log( _array );
    }

    setIndex( _index: number ) : void {
        this.m_index = _index;
    }
    index() : number {
        return this.m_index;
    }

    name() : string {
        return this.m_name;
    }

    intervall() : Intervall[] {
        return this.m_intervall;
    }

    intervallAt( _i: number ) : Intervall | null {
        if( this.m_intervall[_i] == undefined ) return null;
        return this.m_intervall[_i];
    }
}

export class ChordFingering {
    m_index: number;
    m_name: string;
    m_fingering: number[];

    constructor( _name: string , _array: number[] ) {
        this.m_index = -1;
        this.m_name = _name;
        this.m_fingering = _array;
    }

    setIndex( _i: number ) : void {
        this.m_index = _i;
    }

    index() : number {
        return this.m_index;
    }

    name() : string {
        return this.m_name;
    }

    fingering() : number[] {
        return this.m_fingering;
    }
    fingeringAt(_i: number ) : number | null {
        if( this.m_fingering[_i] == undefined ) return null;
        return this.m_fingering[_i];
    }
}

class MusicData {
    private chordIndex : number = 0;

    m_instrument : Instrument[] = [];
    m_chord : IntervallArray[] = [];
    m_scale : IntervallArray[] = [];
    private scaleIndex : number = 0;
    m_pitch : Pitch[] = [];
    m_rootArray : IntervallArray;
    m_chordFingering : ChordFingering[] = [];
    private m_chordFingeringIndex : number = 0;
    m_scaleFingering : string[] = [];
    m_scaleFingeringIndex : number = 0;

    constructor() {
        // this.m_instrument = [];
        // this.m_chord = [];
        // this.chordIndex = 0;
        // this.m_scale = [];
        // this.scaleIndex = 0;
        // this.m_pitch = [];
        for (let i: number = 0; i < 12; i++) {
            this.m_pitch.push(musicDefinition.pitch(i)!);
        }
        // this.m_rootArray;
        this.m_rootArray = new IntervallArray("Root", [musicDefinition.intervall(0)!]);

        // this.m_chordFingering = [];
        // this.m_chordFingeringIndex = 0;
        // this.m_scaleFingering = [];
    }

    rootArray() : IntervallArray {
        return this.m_rootArray;
    }

    pitch() : Pitch[] {
        return this.m_pitch;
    }

    pitchAt( _i: number ) : Pitch | null {
        if( this.m_pitch[_i] == undefined ) return null;
        return this.m_pitch[_i];
    }

    instrument() : Instrument[] {
        return this.m_instrument;
    }
    instrumentAt( _i: number ) : Instrument | null {
        //  console.log( "MusicData::instrument()", this.m_instrument[_i] );
        if( this.m_instrument[_i] == undefined ) return null;
        return this.m_instrument[_i];
    }
    addInstrument( _instr: Instrument ) : void {
        this.m_instrument.push(_instr);
    }
    instrumentFromName( _name: string ) : Instrument | null {
        for (var i: number = 0; i < this.m_instrument.length; i++) {
            if (_name == this.m_instrument[i]!.name()) {
                return this.m_instrument[i]!;
            }
        }
        return null;
    }
    getInstrumentFromJson( _json: any ) {
        for (const key in _json) {
            // console.log("getInstr:" ,key, _json[key]);
            if (key == 'm_name') {
                //if not found recreate instrument
                return this.instrumentFromName(_json[key]);
            }
        }
        return this.m_instrument[0];
    }

    chord() : IntervallArray[] {
        return this.m_chord;
    }
    chordAt( _i: number ) : IntervallArray | null {
        if( this.m_chord[_i] == undefined ) return null;
        return this.m_chord[_i];
    }
    chordFromName( _name: string ) : IntervallArray | null {
        // console.log( "chordFromName", _name );
        for (var i: number = 0; i < this.m_chord.length; i++) {
            // console.log( "chordFromName check", this.m_chord[i].name() );
            if (_name == this.m_chord[i]!.name()) {
                return this.m_chord[i]!;
            }
        }
        return null;
    }
    addChord( _chord: IntervallArray ) : void {
        _chord.setIndex( this.chordIndex++ );
        this.m_chord.push( _chord )
    }
    getChordFromJson( _json: any ) : IntervallArray | null {
        for (const key in _json) {
            // console.log("getInstr:" ,key, _json[key]);
            if (key == 'm_name') {
                return this.chordFromName(_json[key]);
            }
        }
        return null;
    }

    scale() : IntervallArray[] {
        return this.m_scale;
    }
    scaleAt( _i: number ) : IntervallArray | null {
        if( this.m_scale[ _i ] == undefined ) return null;
        return this.m_scale[ _i ];
    }
    scaleFromName( _name: string ) : IntervallArray | null{
        for (var i: number = 0; i < this.m_scale.length; i++) {
            if (_name == this.m_scale[i]!.name()) {
                return this.m_scale[i]!;
            }
        }
        return null;
    }
    addScale( _scale: IntervallArray ) : void {
        _scale.setIndex(this.scaleIndex++);
        this.m_scale.push(_scale)
    }
    getScaleFromJson( _json: any ) :IntervallArray | null {
        for (const key in _json) {
            // console.log("getInstr:" ,key, _json[key]);
            if (key == 'm_name') {
                return this.scaleFromName(_json[key]);
            }
        }
        return null;
    }

    chordFingering() : ChordFingering[] {
        return this.m_chordFingering;
    }
    chordFingeringAt( _i: number ) : ChordFingering | null {
        if( this.m_chordFingering[_i] == undefined ) return null;
        return this.m_chordFingering[_i];
    }
    chordFingeringFromName( _name: string ) : ChordFingering | null {
        for (var i = 0; i < this.m_chordFingering.length; i++) {
            if (_name == this.m_chordFingering[i]!.name()) {
                return this.m_chordFingering[i]!;
            }
        }
        return null;
    }
    addChordFingering( _fing: ChordFingering ) : void {
        _fing.setIndex(this.m_chordFingeringIndex++);
        this.m_chordFingering.push(_fing);
    }
    getChordFingeringFromJson( _json: any ) : any {
        for (const key in _json) {
            // console.log("getInstr:" ,key, _json[key]);
            if (key == 'm_name') {
                return this.chordFingeringFromName(_json[key]);
            }
        }
    }

    scaleFingering() : string[] {
        return this.m_scaleFingering;
    }
    scaleFingeringAt( _i: number ) : string | null {
        if( this.m_scaleFingering[_i] == undefined ) return null;
        return this.m_scaleFingering[_i];
    }
    addscaleFingering( _fing: string ) : void {
        // _fing.setIndex(this.m_scaleFingeringIndex++);
        this.m_scaleFingering.push(_fing);
    }
}



let musicData: MusicData = new MusicData();
let gPitches: Pitch[] = [];
if( musicDefinition.pitchFromNameAndOctave('E', 5) != null ) {
    gPitches.push(musicDefinition.pitchFromNameAndOctave('E', 5)!);
}
if( musicDefinition.pitchFromNameAndOctave('B', 4) != null ) {
    gPitches.push(musicDefinition.pitchFromNameAndOctave('B', 4)!);
}
if( musicDefinition.pitchFromNameAndOctave('G', 4) != null ) {
    gPitches.push(musicDefinition.pitchFromNameAndOctave('G', 4)!);
}
if( musicDefinition.pitchFromNameAndOctave('D', 4) != null ) {
    gPitches.push(musicDefinition.pitchFromNameAndOctave('D', 4)!);
}
if( musicDefinition.pitchFromNameAndOctave('B', 3) != null ) {
    gPitches.push(musicDefinition.pitchFromNameAndOctave('A', 3)!);
}
if( musicDefinition.pitchFromNameAndOctave('E', 2) != null ) {
    gPitches.push(musicDefinition.pitchFromNameAndOctave('E', 2)!);
}
let guitarInstr: Instrument = new Instrument("Guitar", gPitches, 24);
musicData.addInstrument(guitarInstr);

let gitPitches: Intervall[] = [];
gitPitches.push(musicDefinition.intervall(0)!);
gitPitches.push(musicDefinition.intervall(2)!);
gitPitches.push(musicDefinition.intervall(4)!);
gitPitches.push(musicDefinition.intervall(5)!);
gitPitches.push(musicDefinition.intervall(7)!);
gitPitches.push(musicDefinition.intervall(9)!);
gitPitches.push(musicDefinition.intervall(11)!);
// console.log( "add Ionian" );
let scale = new IntervallArray("Ionian", gitPitches);
musicData.addScale(scale);

gitPitches = [];
gitPitches.push(musicDefinition.intervall(0)!);
gitPitches.push(musicDefinition.intervall(2)!);
gitPitches.push(musicDefinition.intervall(3)!);
gitPitches.push(musicDefinition.intervall(5)!);
gitPitches.push(musicDefinition.intervall(7)!);
gitPitches.push(musicDefinition.intervall(9)!);
gitPitches.push(musicDefinition.intervall(10)!);
// console.log( "add Ionian" );
scale = new IntervallArray("Dorian", gitPitches);
musicData.addScale(scale);

gitPitches = [];
gitPitches.push(musicDefinition.intervall(0)!);
gitPitches.push(musicDefinition.intervall(2)!);
gitPitches.push(musicDefinition.intervall(4)!);
gitPitches.push(musicDefinition.intervall(5)!);
gitPitches.push(musicDefinition.intervall(7)!);
gitPitches.push(musicDefinition.intervall(9)!);
gitPitches.push(musicDefinition.intervall(10)!);
scale = new IntervallArray("Mixolydian", gitPitches);
// console.log( "add aeoli" );
musicData.addScale(scale);

gitPitches = [];
gitPitches.push(musicDefinition.intervall(0)!);
gitPitches.push(musicDefinition.intervall(2)!);
gitPitches.push(musicDefinition.intervall(3)!);
gitPitches.push(musicDefinition.intervall(5)!);
gitPitches.push(musicDefinition.intervall(6)!);
gitPitches.push(musicDefinition.intervall(8)!);
gitPitches.push(musicDefinition.intervall(10)!);
scale = new IntervallArray("Aeolian", gitPitches);
// console.log( "add aeoli" );
musicData.addScale(scale);

gitPitches = [];
gitPitches.push(musicDefinition.intervall(0)!);
gitPitches.push(musicDefinition.intervall(4)!);
gitPitches.push(musicDefinition.intervall(7)!);
let chord = new IntervallArray("Major", gitPitches);
// console.log( "add aeoli" );
musicData.addChord(chord);

gitPitches = [];
gitPitches.push(musicDefinition.intervall(0)!);
gitPitches.push(musicDefinition.intervall(4)!);
gitPitches.push(musicDefinition.intervall(7)!);
gitPitches.push(musicDefinition.intervall(11)!);
chord = new IntervallArray("Major 7", gitPitches);
// console.log( "add aeoli" );
musicData.addChord(chord);

gitPitches = [];
gitPitches.push(musicDefinition.intervall(0)!);
gitPitches.push(musicDefinition.intervall(4)!);
gitPitches.push(musicDefinition.intervall(7)!);
gitPitches.push(musicDefinition.intervall(10)!);
chord = new IntervallArray("Dom 7", gitPitches);
// console.log( "add aeoli" );
musicData.addChord(chord);

gitPitches = [];
gitPitches.push(musicDefinition.intervall(0)!);
gitPitches.push(musicDefinition.intervall(3)!);
gitPitches.push(musicDefinition.intervall(7)!);
chord = new IntervallArray("Minor", gitPitches);
// console.log( "add aeoli" );
musicData.addChord(chord);

gitPitches = [];
gitPitches.push(musicDefinition.intervall(0)!);
gitPitches.push(musicDefinition.intervall(3)!);
gitPitches.push(musicDefinition.intervall(7)!);
gitPitches.push(musicDefinition.intervall(10)!);
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

export {
    musicData
};