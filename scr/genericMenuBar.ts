const mtemplate = document.createElement('template')

mtemplate.innerHTML = `
<style>
.menubar{
  padding: 0px;
  margin: 0px;
  width: 100%;
}

.background {
background: rgb(212, 212, 212);
height: 42px;
}

#navigation-btn {
  background: url('./images/mi--chevron-down.svg') center no-repeat;
  // background-color: rgba(255, 255, 255, 100);
  background-size: cover;
  border: 0em; 
}

#left-btn {
display: flex;
float: left;
// height: 100%;
  // background-color: rgba(155, 0, 255, 255);
  }

#right-btn {
display: flex;
float: right;
height: 100%;
  // background-color: rgba(255, 0, 255, 255);

  }

#burger-btn {
  background: url('./images/mi--menu.svg') center no-repeat;
  // background-color: rgba(255, 255, 255, 100);
  background-size: cover;
  border: 0em; 
}

.menu-btn {
  //background-color: rgba(55, 0, 255, 155);
   margin: 6px;
  min-width: 28px;
  height: 28px;
  border: none;
}
.menu-btn:hover {
background-color: rgba(55, 0, 255, 55);
height: 30px;
}

#menu-box {
  visibility: hidden;
position: absolute;
// top: 40px;
padding: 10px 10px;
  list-style: none;
  background-color: #ECEFF1;
  box-shadow: 2px 2px 6px rgb(0, 0, 0);
  transition-duration: .25s;
  z-index: 5;
}

.menu__item {
  display: block;
  padding: 6px 12px;
  color: #333;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
}
.menu__item:hover {
  background-color: #CFD8DC;
}
  
dialog:not([open]) {
  display: none;
}

iFrame {
border: none;
  }

/* Styling der geöffneten Popup-Box */
dialog[open] { 
  /* width: 20em;  */
  /* background: #fffbf0;  */
  /* border: thin solid #ffdec8; */
  /* margin: 0; */
  border: none;
  border-radius: 1rem;
  padding: 20;
}

</style>
   <div class="menubar">
        <div class="background">
          <div id="left-btn">
             </div>
            <div id="right-btn">
          </div>
        </div>
<ul id="menu-box">
</ul>
    </div>

  `
// create a class, and clone the content of the template into it
export class GenericMenuBar extends HTMLElement {
    constructor() {
        super()

    }

    connectedCallback(): void {
        this.attachShadow({
            mode: 'open'
        })
        if (this.shadowRoot == null) return;
        this.shadowRoot.appendChild(mtemplate.content.cloneNode(true))

        document.addEventListener("click", evt => {
            this.handleMouse(evt);
        }, true);
    }

    handleMouse(evt: MouseEvent): void {
        if (this.shadowRoot == null) return;
        // console.log("docClick", menus.length );
        var menu: HTMLUListElement = this.shadowRoot.getElementById('menu-box') as HTMLUListElement;
        if (menu.style.visibility != 'hidden') {
            menu.style.visibility = 'hidden';
            menu.style.opacity = '0';

        }

    }

    isInElem(evt: MouseEvent, elem: DOMRect): boolean {
        if (
            evt.clientX < elem.left ||
            evt.clientX > elem.right ||
            evt.clientY < elem.top ||
            evt.clientY > elem.bottom
        ) {
            return false;
        }
        return true;
    }

    placeMenu(_sourceElem: HTMLElement, _menuElem: HTMLElement): void {
        var rect: DOMRect = _sourceElem.getBoundingClientRect();
        var menuDim: DOMRect = _menuElem.getBoundingClientRect();
        // console.log( "placeMenu", rect );
        // console.log(document.getElementById('menu-boxR'), document.getElementById('menu-boxR').style.visibility, rect.left);

        if (_menuElem.style.visibility == '' || _menuElem.style.visibility == 'hidden') {
            _menuElem.style.visibility = 'visible';
            _menuElem.style.opacity = '1';
            if (rect.left + menuDim.width > document.body.clientWidth) {
                _menuElem.style.left = document.body.clientWidth - menuDim.width + 'px';
                // document.getElementById('menu-boxR').style.left = rect.left + 'px';
            } else {
                _menuElem.style.left = rect.left + 'px';
            }
            _menuElem.style.top = rect.bottom + 'px';
        } else {
            _menuElem.style.visibility = 'hidden';
            _menuElem.style.opacity = '0';
        }
    }

    clearMenu(): void {
        if (this.shadowRoot == null) return;
        const myNode: HTMLUListElement = this.shadowRoot.getElementById("menu-box") as HTMLUListElement;
        // if( myNode == null ) return;
        myNode.textContent = '';
    }

    createMenuElement(_name: string): HTMLLIElement {
        var li: HTMLLIElement = document.createElement("li");
        var a: HTMLAnchorElement = document.createElement("a") as HTMLAnchorElement;
        a.setAttribute('class', 'menu__item');
        a.innerHTML = _name;
        li.appendChild(a);
        this.addMenuElement(li);
        return li;
    }

    addMenuElement(_elem: HTMLLIElement): void {
        if (this.shadowRoot != null && this.shadowRoot.getElementById('menu-box') != null) {
            this.shadowRoot.getElementById('menu-box') !.append(_elem);
        }
    }

    openMenu(_elem: HTMLElement): void {
        if (this.shadowRoot == null || this.shadowRoot.getElementById('menu-box') == null) return;
        // if (this.isInElem(evt, _elem.getBoundingClientRect())) {
        this.placeMenu(_elem, this.shadowRoot.getElementById('menu-box') !);
        // 
    }

    addHeaderRightIcon(_elem: HTMLElement): void {
        if (this.shadowRoot == null || this.shadowRoot.getElementById('right-btn') == null) return;
        this.shadowRoot.getElementById('right-btn') !.prepend(_elem);
    }

    addHeaderLeftIcon(_elem: HTMLElement): void {
        if (this.shadowRoot == null || this.shadowRoot.getElementById('left-btn') == null) return;
        this.shadowRoot.getElementById('left-btn') !.append(_elem);
    }


    createButton(id: string, iconPath: string): HTMLButtonElement {
        // var elem = document.createElement("button");
        var elem: HTMLButtonElement = document.createElement("button");
        // console.log( "url(\'" + iconPath + "\') center no-repeat" );
        elem.style.backgroundColor = '#aaeeff';
        elem.style.background = "url(\'" + iconPath + "\') center no-repeat";
        elem.setAttribute('class', 'menu-btn');
        // elem.setAttribute('margin', '0px');
        elem.setAttribute("id", id);
        // 
        // elem.style.backgroundColor = 'rgba(100,200,200,100)';
        elem.style.color = 'black';
        // elem.style.border = 'none';
        if (iconPath == "") {
            elem.innerHTML = id;
        }

        elem.style.backgroundSize = 'cover';

        return elem;
    }

}
// define a custom element called 'nav-bar' using the navBar class
customElements.define('jui-genericmenubar', GenericMenuBar);