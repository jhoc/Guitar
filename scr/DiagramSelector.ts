import {
    musicData, Pitch, IntervallArray
} from "./MusicDefinitions.js";
import {
    Diagram
} from "./Diagram.js"

const template = document.createElement('template')

template.innerHTML = `
<style>

</style>
  <select id="pitchSelect"></select>
  <select id="chordSelect"></select>
  <select id="scaleSelect"></select>

  `

interface callbackRootChangeType {
    ( _pitch: Pitch ) : void
}
interface callbackChordChangeType {
    ( _chord: IntervallArray ) : void
}
interface callbackScaleChangeType {
    ( _pitch: IntervallArray ) : void
}

// create a class, and clone the content of the template into it
export class DiagramSelector extends HTMLElement {
    pitchSelect: HTMLSelectElement;
    chordSelect: HTMLSelectElement;
    scaleSelect: HTMLSelectElement;

callbackOnRootChange: callbackRootChangeType;
callbackOnChordChange: callbackChordChangeType;
callbackOnScaleChange: callbackScaleChangeType;

    constructor() {
        super()
    }

    connectedCallback() {
        this.attachShadow({
            mode: 'open'
        })
        this.shadowRoot.appendChild(template.content.cloneNode(true))


        this.pitchSelect = this.shadowRoot.getElementById('pitchSelect') as HTMLSelectElement;
        this.pitchSelect.addEventListener('change', this.onRootChange.bind(this), false);
        this.chordSelect = this.shadowRoot.getElementById('chordSelect') as HTMLSelectElement;
        this.chordSelect.addEventListener('change', this.onChordChange.bind(this), false);
        this.scaleSelect = this.shadowRoot.getElementById('scaleSelect') as HTMLSelectElement;
        this.scaleSelect.addEventListener('change', this.onScaleChange.bind(this), false);

        this.fillPitchContent();
        this.fillChordContent();
        this.fillScaleContent();
    }

    setCallbackOnRootChange( _function: callbackRootChangeType ) {
        this.callbackOnRootChange = _function;
    }
    onRootChange() {
        const index: number = this.pitchSelect.selectedIndex;
        this.callbackOnRootChange( musicData.pitchAt(index ) );
    }

    setCallbackOnChordChange( _function: callbackChordChangeType ) {
        this.callbackOnChordChange = _function;
    }
    onChordChange() : void {
        // const index = this.chordSelect.selectedIndex - 1;
        const index: number = parseInt( this.chordSelect.value );
        this.callbackOnChordChange( musicData.chordAt( index ) );
        this.filterScaleContent( musicData.chordAt( index ) );
    }

    setCallbackOnScaleChange( _function: callbackScaleChangeType ) {
        this.callbackOnScaleChange = _function;
    }
    onScaleChange() : void {
        // console.log("onScaleChange");
        // const index = this.scaleSelect.selectedIndex - 1;
        const index: number = parseInt( this.scaleSelect.value );
        this.callbackOnScaleChange( musicData.scaleAt( index ) );
        this.filterChordContent(musicData.scaleAt( index ) );
    }

    fillPitchContent() : void {
        const elem: HTMLSelectElement = this.pitchSelect;
        for (var i: number = 0; i < musicData.pitch().length; i++) {
            var opt: HTMLOptionElement = document.createElement("option");
            opt.setAttribute("value", i.toString());
            opt.innerHTML = musicData.pitchAt(i).name();
            elem.appendChild(opt);
        }
    }

    fillChordContent() : void {
        const elem: HTMLSelectElement = this.chordSelect;
        var opt: HTMLOptionElement = document.createElement("option");
        opt.setAttribute("value", '-1');
        opt.innerHTML = "Chord";
        elem.appendChild(opt);
        for (var i: number = 0; i < musicData.chord().length; i++) {
            var opt: HTMLOptionElement = document.createElement("option");
            // console.log("addCHord", musicData.chordAt(i).index());
            opt.setAttribute("value", musicData.chordAt(i).index().toString() );
            opt.innerHTML = musicData.chordAt(i).name();
            elem.appendChild(opt);
        }
    }

    filterChordContent( _scale: IntervallArray ) : void {
        var prevSelectedValue: number = parseInt( this.chordSelect.value );
        this.chordSelect.options.length = 0;
        if (_scale == undefined) {
            this.fillChordContent();
            this.chordSelect.value = prevSelectedValue.toString();
            return;
        }

        const elem: HTMLSelectElement = this.chordSelect;
        var opt: HTMLOptionElement = document.createElement("option");
        opt.setAttribute("value", '-1');
        opt.innerHTML = "Chord";
        elem.add(opt);
        for (var i: number = 0; i < musicData.chord().length; i++) {
            if (musicData.chordAt(i).intervall().every(r => _scale.intervall().includes(r))) {
                var opt: HTMLOptionElement = document.createElement("option");
                opt.setAttribute( "value", musicData.chordAt(i).index().toString() );
                opt.innerHTML = musicData.chordAt(i).name();
                elem.appendChild(opt);
            }
        }
        elem.value = prevSelectedValue.toString();
    }

    fillScaleContent() : void {
        const elem: HTMLSelectElement = this.scaleSelect;
        var opt: HTMLOptionElement = document.createElement("option");
        opt.setAttribute('value', '-1');
        opt.innerHTML = "Scale";
        elem.appendChild(opt);
        for (var i: number = 0; i < musicData.scale().length; i++) {
            var opt: HTMLOptionElement = document.createElement("option");
            opt.setAttribute("value", i.toString());
            opt.innerHTML = musicData.scaleAt(i).name();
            elem.appendChild(opt);
        }
    }

    filterScaleContent( _chord: IntervallArray ) : void {
        var prevSelectedValue: number = parseInt( this.scaleSelect.value );
        this.scaleSelect.options.length = 0;
        if (_chord == undefined) {
            this.fillScaleContent();
            this.scaleSelect.value = prevSelectedValue.toString();
            return;
        }

        const elem: HTMLSelectElement = this.scaleSelect;
        var opt: HTMLOptionElement = document.createElement("option");
        opt.setAttribute("value", '-1');
        opt.innerHTML = "Scale";
        elem.add(opt);
        for (var i: number = 0; i < musicData.scale().length; i++) {
            if (_chord.intervall().every(r => musicData.scaleAt(i).intervall().includes(r))) {
                var opt: HTMLOptionElement = document.createElement("option");
                opt.setAttribute("value", musicData.scaleAt(i).index().toString() );
                opt.innerHTML = musicData.scaleAt(i).name();
                elem.appendChild(opt);
            }
        }
        this.scaleSelect.value = prevSelectedValue.toString();
    }

    setDiagram( _dia: Diagram ) : void {
        console.log( _dia.getRoot(), _dia.getChord(), _dia.getScale() );
        // this.pitchSelect[_dia.getRoot().index()].selected = true;
        this.pitchSelect.value = _dia.getRoot().index().toString();
        if (_dia.getChord() != undefined) {
            // console.log( "setDia chird.idx", _dia.getChord().index() );
            this.chordSelect.value = _dia.getChord().index().toString();
        } else {
            // this.chordSelect[0].selected = true;
            this.chordSelect.value = '-1';
        }
        if (_dia.getScale() != undefined) {
            this.scaleSelect.value = _dia.getScale().index().toString();
        } else {
            // this.scaleSelect[0].selected = true;
            this.scaleSelect.value = '-1';
        }
    }
}
// define a custom element called 'nav-bar' using the navBar class
customElements.define('jui-diagramselector', DiagramSelector);