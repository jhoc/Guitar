import { musicData } from "./MusicDefinitions.js";
const template = document.createElement('template');
template.innerHTML = `
<style>

</style>
  <select id="pitchSelect"></select>
  <select id="chordSelect"></select>
  <select id="scaleSelect"></select>

  `;
// create a class, and clone the content of the template into it
export class DiagramSelector extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.pitchSelect = this.shadowRoot.getElementById('pitchSelect');
        this.pitchSelect.addEventListener('change', this.onRootChange.bind(this), false);
        this.chordSelect = this.shadowRoot.getElementById('chordSelect');
        this.chordSelect.addEventListener('change', this.onChordChange.bind(this), false);
        this.scaleSelect = this.shadowRoot.getElementById('scaleSelect');
        this.scaleSelect.addEventListener('change', this.onScaleChange.bind(this), false);
        this.fillPitchContent();
        this.fillChordContent();
        this.fillScaleContent();
    }
    setCallbackOnRootChange(_function) {
        this.callbackOnRootChange = _function;
    }
    onRootChange() {
        const index = this.pitchSelect.selectedIndex;
        this.callbackOnRootChange(musicData.pitchAt(index));
    }
    setCallbackOnChordChange(_function) {
        this.callbackOnChordChange = _function;
    }
    onChordChange() {
        // const index = this.chordSelect.selectedIndex - 1;
        const index = parseInt(this.chordSelect.value);
        this.callbackOnChordChange(musicData.chordAt(index));
        this.filterScaleContent(musicData.chordAt(index));
    }
    setCallbackOnScaleChange(_function) {
        this.callbackOnScaleChange = _function;
    }
    onScaleChange() {
        // console.log("onScaleChange");
        // const index = this.scaleSelect.selectedIndex - 1;
        const index = parseInt(this.scaleSelect.value);
        this.callbackOnScaleChange(musicData.scaleAt(index));
        this.filterChordContent(musicData.scaleAt(index));
    }
    fillPitchContent() {
        const elem = this.pitchSelect;
        for (var i = 0; i < musicData.pitch().length; i++) {
            var opt = document.createElement("option");
            opt.setAttribute("value", i.toString());
            opt.innerHTML = musicData.pitchAt(i).name();
            elem.appendChild(opt);
        }
    }
    fillChordContent() {
        const elem = this.chordSelect;
        var opt = document.createElement("option");
        opt.setAttribute("value", '-1');
        opt.innerHTML = "Chord";
        elem.appendChild(opt);
        for (var i = 0; i < musicData.chord().length; i++) {
            var opt = document.createElement("option");
            // console.log("addCHord", musicData.chordAt(i).index());
            opt.setAttribute("value", musicData.chordAt(i).index().toString());
            opt.innerHTML = musicData.chordAt(i).name();
            elem.appendChild(opt);
        }
    }
    filterChordContent(_scale) {
        var prevSelectedValue = parseInt(this.chordSelect.value);
        this.chordSelect.options.length = 0;
        if (_scale == undefined) {
            this.fillChordContent();
            this.chordSelect.value = prevSelectedValue.toString();
            return;
        }
        const elem = this.chordSelect;
        var opt = document.createElement("option");
        opt.setAttribute("value", '-1');
        opt.innerHTML = "Chord";
        elem.add(opt);
        for (var i = 0; i < musicData.chord().length; i++) {
            if (musicData.chordAt(i).intervall().every(r => _scale.intervall().includes(r))) {
                var opt = document.createElement("option");
                opt.setAttribute("value", musicData.chordAt(i).index().toString());
                opt.innerHTML = musicData.chordAt(i).name();
                elem.appendChild(opt);
            }
        }
        elem.value = prevSelectedValue.toString();
    }
    fillScaleContent() {
        const elem = this.scaleSelect;
        var opt = document.createElement("option");
        opt.setAttribute('value', '-1');
        opt.innerHTML = "Scale";
        elem.appendChild(opt);
        for (var i = 0; i < musicData.scale().length; i++) {
            var opt = document.createElement("option");
            opt.setAttribute("value", i.toString());
            opt.innerHTML = musicData.scaleAt(i).name();
            elem.appendChild(opt);
        }
    }
    filterScaleContent(_chord) {
        var prevSelectedValue = parseInt(this.scaleSelect.value);
        this.scaleSelect.options.length = 0;
        if (_chord == undefined) {
            this.fillScaleContent();
            this.scaleSelect.value = prevSelectedValue.toString();
            return;
        }
        const elem = this.scaleSelect;
        var opt = document.createElement("option");
        opt.setAttribute("value", '-1');
        opt.innerHTML = "Scale";
        elem.add(opt);
        for (var i = 0; i < musicData.scale().length; i++) {
            if (_chord.intervall().every(r => musicData.scaleAt(i).intervall().includes(r))) {
                var opt = document.createElement("option");
                opt.setAttribute("value", musicData.scaleAt(i).index().toString());
                opt.innerHTML = musicData.scaleAt(i).name();
                elem.appendChild(opt);
            }
        }
        this.scaleSelect.value = prevSelectedValue.toString();
    }
    setDiagram(_dia) {
        console.log(_dia.getRoot(), _dia.getChord(), _dia.getScale());
        // this.pitchSelect[_dia.getRoot().index()].selected = true;
        this.pitchSelect.value = _dia.getRoot().index().toString();
        if (_dia.getChord() != undefined) {
            // console.log( "setDia chird.idx", _dia.getChord().index() );
            this.chordSelect.value = _dia.getChord().index().toString();
        }
        else {
            // this.chordSelect[0].selected = true;
            this.chordSelect.value = '-1';
        }
        if (_dia.getScale() != undefined) {
            this.scaleSelect.value = _dia.getScale().index().toString();
        }
        else {
            // this.scaleSelect[0].selected = true;
            this.scaleSelect.value = '-1';
        }
    }
}
// define a custom element called 'nav-bar' using the navBar class
customElements.define('jui-diagramselector', DiagramSelector);
//# sourceMappingURL=DiagramSelector.js.map