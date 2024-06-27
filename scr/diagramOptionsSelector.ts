import {
    musicData
} from "./MusicDefinitions.js";

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
// create a class, and clone the content of the template into it
export class DiagramOptionsSelector extends HTMLElement {

    chordFingeringSelect;
    chordFingeringStringSelect;
    scaleFingeringSelect;
    mouseBehaviourSelect;
    instrument;

    callbackOnChordFingeringChange;
    callbackOnChordStringChange;
    callbackOnScaleFingeringChange;
    scaleSelect;
    callbackOnScaleChange;
    callbackOnMouseBehaviourChange;

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


        this.chordFingeringSelect = this.shadowRoot.getElementById('chordFingering');
        this.chordFingeringSelect.addEventListener('change', this.onChordFingeringChange.bind(this), false);
        this.chordFingeringStringSelect = this.shadowRoot.getElementById('chordFingeringString');
        this.chordFingeringStringSelect.addEventListener('change', this.onChordStringChange.bind(this), false);
        this.scaleFingeringSelect = this.shadowRoot.getElementById('scaleFingering');
        this.scaleFingeringSelect.addEventListener('change', this.onScaleFingeringChange.bind(this), false);
        this.mouseBehaviourSelect = this.shadowRoot.getElementById('mouseBehaviour');
        this.shadowRoot.addEventListener( 'change', this.onMouseBehaviourChange.bind(this), false );

        this.fillChordFingeringContent();
        this.fillChordStringContent();
        this.fillScaleFingeringContent();
    }

setInstrument( _instr ) {
    // console.log( _instr );
    this.instrument = _instr;
    this.fillChordStringContent();
}

    setCallbackOnChordFingeringChange(_function) {
        this.callbackOnChordFingeringChange = _function;
    }
    onChordFingeringChange() {
        const index = this.chordFingeringSelect.value;
        // console.log( "onCHordFingChange ", index );
        if( index < 0 ) {
            this.mouseBehaviourSelect.disabled = true;
            this.mouseBehaviourSelect.selectedIndex = 0;
        } else {
            this.mouseBehaviourSelect.disabled = false;
        }
        this.callbackOnChordFingeringChange(musicData.chordFingeringAt(index));
    }

    setCallbackOnChordFingeringStringChange(_function) {
        this.callbackOnChordStringChange = _function;
    }
    onChordStringChange() {
      // const index = this.chordSelect.selectedIndex - 1;
      const index = this.chordFingeringStringSelect.value;
      this.callbackOnChordStringChange( index );
    }

    setCallbackOnScaleFingeringChange(_function) { 
        this.callbackOnScaleFingeringChange = _function;
    }
    onScaleFingeringChange() {
        const index = this.scaleSelect.value;
        this.callbackOnScaleChange(musicData.scaleAt(index));
    }

    setCallbackOnMouseBehaviourChange( _function ) {
        // console.log( "diaOptSel.setCallbackonMouseBehav");
        this.callbackOnMouseBehaviourChange = _function;
    }
    onMouseBehaviourChange() {
        // console.log( "diaOptSel.onMouseBehav");
        this.callbackOnMouseBehaviourChange( this.mouseBehaviourSelect.value );
    }

    fillChordFingeringContent() {
        const elem = this.chordFingeringSelect;
        var opt = document.createElement("option");
        opt.setAttribute('value', '-1');
        opt.innerHTML = "Chord Fingering";
        elem.add(opt);
        for (var i = 0; i < musicData.chordFingering().length; i++) {
            var opt = document.createElement("option");
            // opt.setAttribute("value", i);
            opt.setAttribute("value", musicData.chordFingeringAt(i).index() );
            opt.innerHTML = musicData.chordFingeringAt(i).name();
            elem.add( opt );
        }
    }

    fillChordStringContent() {
        if( this.instrument == undefined ) {
            return;
        }
        const elem = this.chordFingeringStringSelect
        for (var i = 0; i < this.instrument.pitch().length; i++) {
            var opt = document.createElement("option");
            opt.setAttribute("value", i.toString());
            opt.innerHTML = this.instrument.pitchAt(i).name();
            elem.add(opt);
        }
    }

    fillScaleFingeringContent() {
        const elem = this.scaleFingeringSelect;
        var opt = document.createElement("option");
        opt.setAttribute('value', '-1');
        opt.innerHTML = "Scale Fingering";
        elem.add(opt);
        for (var i = 0; i < musicData.scaleFingering().length; i++) {
            var opt = document.createElement("option");
            opt.setAttribute("value", i.toString());
            opt.innerHTML = musicData.scaleFingeringAt(i);
            elem.add(opt);
        }
    }

    setDiagram(_dia) {
        // return;
        // console.log( _dia.getRoot(), _dia.getChord(), _dia.getScale() );
        // this.pitchSelect[_dia.getRoot().index()].selected = true;
        if (_dia.getChord() != undefined) {
             this.chordFingeringSelect.disabled = false;
             this.chordFingeringStringSelect.disabled = false;
             if( _dia.getChordFingering() != undefined ) {
                this.chordFingeringSelect.value = _dia.getChordFingering().index();
             }
             this.mouseBehaviourSelect.disabled = false;
        } else {
            this.chordFingeringSelect[0].selected = true;
            this.chordFingeringSelect.disabled = true;
            this.chordFingeringStringSelect.disabled = true;  
            this.mouseBehaviourSelect.disabled = true;
            this.mouseBehaviourSelect.selectedIndex = 0;
        }
        if (_dia.getScale() != undefined) {
            this.scaleFingeringSelect.disabled = false;
        } else {
            this.scaleFingeringSelect[0].selected = true;
            this.scaleFingeringSelect.disabled = true;
        }
    }
}
// define a custom element called 'nav-bar' using the navBar class
customElements.define('jui-diagramoptionsselector', DiagramOptionsSelector);