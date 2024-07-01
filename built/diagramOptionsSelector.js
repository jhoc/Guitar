import { musicData } from "./MusicDefinitions.js";
import { MouseClickBehaviour } from "./Diagram.js";
const template = document.createElement('template');
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
  `;
// create a class, and clone the content of the template into it
export class DiagramOptionsSelector extends HTMLElement {
    constructor() {
        super();
        this.chordFingeringSelect = null;
        this.chordFingeringStringSelect = null;
        this.scaleFingeringSelect = null;
        this.mouseBehaviourSelect = null;
        this.instrument = null;
        this.callbackOnChordFingeringChange = null;
        this.callbackOnChordStringChange = null;
        this.callbackOnScaleFingeringChange = null;
        this.callbackOnScaleChange = null;
        this.callbackOnMouseBehaviourChange = null;
        // console.log("DiagramOptionsSelector");
    }
    connectedCallback() {
        this.attachShadow({
            mode: 'open'
        });
        if (this.shadowRoot == null)
            return;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        // console.log("DiagramOptionsSelector.connected");
        this.chordFingeringSelect = this.shadowRoot.getElementById('chordFingering');
        this.chordFingeringSelect.addEventListener('change', this.onChordFingeringChange.bind(this), false);
        this.chordFingeringStringSelect = this.shadowRoot.getElementById('chordFingeringString');
        this.chordFingeringStringSelect.addEventListener('change', this.onChordStringChange.bind(this), false);
        this.scaleFingeringSelect = this.shadowRoot.getElementById('scaleFingering');
        this.scaleFingeringSelect.addEventListener('change', this.onScaleFingeringChange.bind(this), false);
        this.mouseBehaviourSelect = this.shadowRoot.getElementById('mouseBehaviour');
        this.shadowRoot.addEventListener('change', this.onMouseBehaviourChange.bind(this), false);
        this.fillChordFingeringContent();
        this.fillChordStringContent();
        this.fillScaleFingeringContent();
    }
    setInstrument(_instr) {
        // console.log( _instr );
        this.instrument = _instr;
        this.fillChordStringContent();
    }
    setCallbackOnChordFingeringChange(_function) {
        this.callbackOnChordFingeringChange = _function;
    }
    onChordFingeringChange() {
        if (this.chordFingeringSelect == null)
            return;
        const index = parseInt(this.chordFingeringSelect.value);
        // console.log( "onCHordFingChange ", index );
        if (this.mouseBehaviourSelect != null) {
            if (index < 0) {
                this.mouseBehaviourSelect.disabled = true;
                this.mouseBehaviourSelect.selectedIndex = 0;
            }
            else {
                this.mouseBehaviourSelect.disabled = false;
            }
        }
        if (this.callbackOnChordFingeringChange == null || musicData.chordFingeringAt(index) == null)
            return;
        this.callbackOnChordFingeringChange(musicData.chordFingeringAt(index));
    }
    setCallbackOnChordFingeringStringChange(_function) {
        this.callbackOnChordStringChange = _function;
    }
    onChordStringChange() {
        console.log("Never used");
        // const index = this.chordSelect.selectedIndex - 1;
        if (this.chordFingeringStringSelect == null)
            return;
        const index = parseInt(this.chordFingeringStringSelect.value);
        if (this.callbackOnChordStringChange == null)
            return;
        this.callbackOnChordStringChange(index);
    }
    setCallbackOnScaleFingeringChange(_function) {
        this.callbackOnScaleFingeringChange = _function;
    }
    onScaleFingeringChange() {
        console.log("Never used");
        // const index: number = parseInt( this.scaleSelect.value );
        // console.log( "Never used", index );
        // this.callbackOnScaleChange(musicData.scaleAt(index));
    }
    setCallbackOnMouseBehaviourChange(_function) {
        // console.log( "diaOptSel.setCallbackonMouseBehav");
        this.callbackOnMouseBehaviourChange = _function;
    }
    onMouseBehaviourChange() {
        // console.log( "diaOptSel.onMouseBehav");
        // const v = this.mouseBehaviourSelect.value as MouseClickBehaviour;
        // console.log( v );
        if (this.mouseBehaviourSelect == null)
            return;
        var v = MouseClickBehaviour.CUSTOM;
        // switch ( v ) {
        switch (this.mouseBehaviourSelect.value) {
            case 'SETCHORDFINGERING': {
                v = MouseClickBehaviour.SETCHORDFINGERING;
                break;
            }
            case 'CUSTOM': {
                v = MouseClickBehaviour.CUSTOM;
                break;
            }
        }
        if (this.callbackOnMouseBehaviourChange == null)
            return;
        this.callbackOnMouseBehaviourChange(v);
    }
    fillChordFingeringContent() {
        if (this.chordFingeringSelect == null)
            return;
        const elem = this.chordFingeringSelect;
        var opt = document.createElement("option");
        opt.setAttribute('value', '-1');
        opt.innerHTML = "Chord Fingering";
        elem.add(opt);
        for (var i = 0; i < musicData.chordFingering().length; i++) {
            var opt = document.createElement("option");
            // opt.setAttribute("value", i);
            if (musicData.chordFingeringAt(i) == null)
                continue;
            opt.setAttribute("value", musicData.chordFingeringAt(i).index().toString());
            opt.innerHTML = musicData.chordFingeringAt(i).name();
            elem.add(opt);
        }
    }
    fillChordStringContent() {
        if (this.instrument == null || this.chordFingeringStringSelect == null) {
            return;
        }
        const elem = this.chordFingeringStringSelect;
        for (var i = 0; i < this.instrument.pitch().length; i++) {
            var opt = document.createElement("option");
            opt.setAttribute("value", i.toString());
            if (this.instrument.pitchAt(i) == null)
                continue;
            opt.innerHTML = this.instrument.pitchAt(i).name();
            elem.add(opt);
        }
    }
    fillScaleFingeringContent() {
        if (this.scaleFingeringSelect == null)
            return;
        const elem = this.scaleFingeringSelect;
        var opt = document.createElement("option");
        opt.setAttribute('value', '-1');
        opt.innerHTML = "Scale Fingering";
        elem.add(opt);
        for (var i = 0; i < musicData.scaleFingering().length; i++) {
            var opt = document.createElement("option");
            opt.setAttribute("value", i.toString());
            if (musicData.scaleFingeringAt(i) == null)
                continue;
            opt.innerHTML = musicData.scaleFingeringAt(i).toString();
            elem.add(opt);
        }
    }
    setDiagram(_dia) {
        // return;
        // console.log( _dia.getRoot(), _dia.getChord(), _dia.getScale() );
        // this.pitchSelect[_dia.getRoot().index()].selected = true;
        if (_dia.getChord() != null) {
            if (this.chordFingeringSelect) {
                this.chordFingeringSelect.disabled = false;
            }
            if (this.chordFingeringStringSelect != null) {
                this.chordFingeringStringSelect.disabled = false;
            }
            if (this.chordFingeringSelect != null && _dia.getChordFingering() != null) {
                this.chordFingeringSelect.value = _dia.getChordFingering().index().toString();
            }
            if (this.mouseBehaviourSelect != null) {
                this.mouseBehaviourSelect.disabled = false;
            }
        }
        else {
            // this.chordFingeringSelect[0].selected = true;
            if (this.chordFingeringSelect) {
                this.chordFingeringSelect.value = '-1';
                this.chordFingeringSelect.disabled = true;
            }
            if (this.chordFingeringStringSelect) {
                this.chordFingeringStringSelect.disabled = true;
            }
            if (this.mouseBehaviourSelect != null) {
                this.mouseBehaviourSelect.disabled = true;
                this.mouseBehaviourSelect.selectedIndex = 0;
            }
        }
        if (this.scaleFingeringSelect != null) {
            if (_dia.getScale() != undefined) {
                this.scaleFingeringSelect.disabled = false;
            }
            else {
                // this.scaleFingeringSelect[0].selected = true;
                this.scaleFingeringSelect.value = '-1';
                this.scaleFingeringSelect.disabled = true;
            }
        }
    }
}
// define a custom element called 'nav-bar' using the navBar class
customElements.define('jui-diagramoptionsselector', DiagramOptionsSelector);
//# sourceMappingURL=diagramOptionsSelector.js.map