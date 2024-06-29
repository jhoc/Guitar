import {
    musicData, Instrument, IntervallArray, ChordFingering
} from "./MusicDefinitions.js";
import {
    Diagram, MouseClickBehaviour
} from "./Diagram.js"
const template = document.createElement('template')

template.innerHTML = `
<style>

</style>
  <select id="chordFingering"></select>
  <select id="chordFingeringString"></select>
  <select id="scaleFingering"></select>
<select id="mouseBehaviour">
<option value="CUSTOM">Custom Notes</option>
  <option value="SETCHORDFINGERING">Set Fingering</option>
</select>
  `
interface callbackChordFingerChangeType {
    ( _fing: ChordFingering ) : void
}
interface callbackChordStringChangeType {
    ( _index: number ) : void
}
interface callbackScaleFingerChangeType {
    ( _fing: number ) : void
}
interface callbackChordFingerChangeType {
    ( _fing: ChordFingering ) : void
}
interface callbackScaleChangeType {
    ( _scale: IntervallArray ) : void
}
interface callbackMouseBehaviourChangeType {
    ( _v: MouseClickBehaviour ) : void
}
// create a class, and clone the content of the template into it
export class DiagramOptionsSelector extends HTMLElement {

    chordFingeringSelect: HTMLSelectElement;
    chordFingeringStringSelect: HTMLSelectElement;
    scaleFingeringSelect: HTMLSelectElement;
    mouseBehaviourSelect: HTMLSelectElement;
    instrument: Instrument;

    callbackOnChordFingeringChange : callbackChordFingerChangeType;
    callbackOnChordStringChange: callbackChordStringChangeType;
    callbackOnScaleFingeringChange : callbackScaleFingerChangeType;
    scaleSelect;
    callbackOnScaleChange : callbackScaleChangeType;
    callbackOnMouseBehaviourChange: callbackMouseBehaviourChangeType;

    constructor() {
        super()
        // console.log("DiagramOptionsSelector");

    }

    connectedCallback() {
        this.attachShadow({
            mode: 'open'
        })
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        // console.log("DiagramOptionsSelector.connected");


        this.chordFingeringSelect = this.shadowRoot.getElementById('chordFingering') as HTMLSelectElement;
        this.chordFingeringSelect.addEventListener('change', this.onChordFingeringChange.bind(this), false);
        this.chordFingeringStringSelect = this.shadowRoot.getElementById('chordFingeringString') as HTMLSelectElement;
        this.chordFingeringStringSelect.addEventListener('change', this.onChordStringChange.bind(this), false);
        this.scaleFingeringSelect = this.shadowRoot.getElementById('scaleFingering') as HTMLSelectElement;
        this.scaleFingeringSelect.addEventListener('change', this.onScaleFingeringChange.bind(this), false);
        this.mouseBehaviourSelect = this.shadowRoot.getElementById('mouseBehaviour') as HTMLSelectElement;
        this.shadowRoot.addEventListener('change', this.onMouseBehaviourChange.bind(this), false);

        this.fillChordFingeringContent();
        this.fillChordStringContent();
        this.fillScaleFingeringContent();
    }

    setInstrument( _instr: Instrument ) : void {
        // console.log( _instr );
        this.instrument = _instr;
        this.fillChordStringContent();
    }

    setCallbackOnChordFingeringChange( _function : callbackChordFingerChangeType ) : void {
        this.callbackOnChordFingeringChange = _function;
    }
    onChordFingeringChange() : void {
        const index: number = parseInt( this.chordFingeringSelect.value );
        // console.log( "onCHordFingChange ", index );
        if (index < 0) {
            this.mouseBehaviourSelect.disabled = true;
            this.mouseBehaviourSelect.selectedIndex = 0;
        } else {
            this.mouseBehaviourSelect.disabled = false;
        }
        this.callbackOnChordFingeringChange( musicData.chordFingeringAt( index ) );
    }

    setCallbackOnChordFingeringStringChange( _function: callbackChordStringChangeType ) {
        this.callbackOnChordStringChange = _function;
    }
    onChordStringChange() : void {
        console.log( "Never used" );
        // const index = this.chordSelect.selectedIndex - 1;
        const index: number = parseInt( this.chordFingeringStringSelect.value );
        this.callbackOnChordStringChange(index);
    }

    setCallbackOnScaleFingeringChange( _function: callbackScaleFingerChangeType ) {
        this.callbackOnScaleFingeringChange = _function;
    }
    onScaleFingeringChange() : void {
        console.log( "Never used" );
        // const index: number = parseInt( this.scaleSelect.value );
        // console.log( "Never used", index );
        // this.callbackOnScaleChange(musicData.scaleAt(index));
    }

    setCallbackOnMouseBehaviourChange( _function: callbackMouseBehaviourChangeType ) {
        // console.log( "diaOptSel.setCallbackonMouseBehav");
        this.callbackOnMouseBehaviourChange = _function;
    }
    onMouseBehaviourChange() : void {
        // console.log( "diaOptSel.onMouseBehav");
        // const v = this.mouseBehaviourSelect.value as MouseClickBehaviour;
        // console.log( v );
        var v;
        // switch ( v ) {
            switch ( this.mouseBehaviourSelect.value ) {
            case 'SETCHORDFINGERING': {
                v = MouseClickBehaviour.SETCHORDFINGERING;
                break;
            }
            case 'CUSTOM': {
                v = MouseClickBehaviour.CUSTOM;
                break;
            }
        }
        this.callbackOnMouseBehaviourChange(v);
    }

    fillChordFingeringContent() : void {
        const elem: HTMLSelectElement = this.chordFingeringSelect;
        var opt: HTMLOptionElement = document.createElement("option");
        opt.setAttribute('value', '-1');
        opt.innerHTML = "Chord Fingering";
        elem.add(opt);
        for (var i: number = 0; i < musicData.chordFingering().length; i++) {
            var opt: HTMLOptionElement = document.createElement("option");
            // opt.setAttribute("value", i);
            opt.setAttribute("value", musicData.chordFingeringAt(i).index().toString() );
            opt.innerHTML = musicData.chordFingeringAt(i).name();
            elem.add(opt);
        }
    }

    fillChordStringContent() : void {
        if (this.instrument == undefined) {
            return;
        }
        const elem: HTMLSelectElement = this.chordFingeringStringSelect
        for (var i: number = 0; i < this.instrument.pitch().length; i++) {
            var opt: HTMLOptionElement = document.createElement("option");
            opt.setAttribute("value", i.toString());
            opt.innerHTML = this.instrument.pitchAt(i).name();
            elem.add(opt);
        }
    }

    fillScaleFingeringContent() : void {
        const elem: HTMLSelectElement = this.scaleFingeringSelect;
        var opt: HTMLOptionElement = document.createElement("option");
        opt.setAttribute('value', '-1');
        opt.innerHTML = "Scale Fingering";
        elem.add(opt);
        for (var i: number = 0; i < musicData.scaleFingering().length; i++) {
            var opt = document.createElement("option");
            opt.setAttribute("value", i.toString());
            opt.innerHTML = musicData.scaleFingeringAt(i).toString();
            elem.add(opt);
        }
    }

    setDiagram( _dia: Diagram ) : void {
        // return;
        // console.log( _dia.getRoot(), _dia.getChord(), _dia.getScale() );
        // this.pitchSelect[_dia.getRoot().index()].selected = true;
        if (_dia.getChord() != undefined) {
            this.chordFingeringSelect.disabled = false;
            this.chordFingeringStringSelect.disabled = false;
            if (_dia.getChordFingering() != undefined) {
                this.chordFingeringSelect.value = _dia.getChordFingering().index().toString();
            }
            this.mouseBehaviourSelect.disabled = false;
        } else {
            // this.chordFingeringSelect[0].selected = true;
            this.chordFingeringSelect.value = '-1';
            this.chordFingeringSelect.disabled = true;
            this.chordFingeringStringSelect.disabled = true;
            this.mouseBehaviourSelect.disabled = true;
            this.mouseBehaviourSelect.selectedIndex = 0;
        }
        if (_dia.getScale() != undefined) {
            this.scaleFingeringSelect.disabled = false;
        } else {
            // this.scaleFingeringSelect[0].selected = true;
            this.scaleFingeringSelect.value = '-1';
            this.scaleFingeringSelect.disabled = true;
        }
    }
}
// define a custom element called 'nav-bar' using the navBar class
customElements.define( 'jui-diagramoptionsselector', DiagramOptionsSelector );