const template = document.createElement('template')

template.innerHTML = `
<style>
.hamburger-menu{
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

.menu-boxR {
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
   <div class="hamburger-menu">
        <div class="background">
          <div id="left-btn">
            <button class="menu-btn" id="navigation-btn"></button>
             </div>
            <div id="right-btn">
            <button class="menu-btn" id="burger-btn"></button>
          </div>
        </div>

         <ul class="menu-boxR" id="menu-box">
                <li><a class="menu__item" href="index.html">Diagram List</a></li>
                <li><a class="menu__item" href="score.html">Score</a></li>
                <li><a class="menu__item" href="manager.html">Manager</a></li>
                <li><a class="menu__item" id="save">Save As...</a></li>
                <li><a class="menu__item" id="saveAs">Save</a></li>
                <li><a class="menu__item" id="settings">Settings</a></li>
                <li><a class="menu__item" id="info">Info</a></li>
            </ul>
              <ul class="menu-boxR" id="menu-boxR">
                <li><a class="menu__item" href="#">Lo</a></li>
                <li><a class="menu__item" href="#">vxcv</a></li>
                <li><a class="menu__item" href="#">Team</a></li>
                <li><a class="menu__item" href="#">Contact</a></li>
                <li><a class="menu__item" href="#">Twitter</a></li>
            </ul>

            <dialog id="dialog">
            <button id="dialogCloseButton">Close</button>
              <iframe id="dialogFrame"><\iframe>
            </dialog>
    </div>

  `
// create a class, and clone the content of the template into it
export class MenuHeader extends HTMLElement {
    menuButton: HTMLElement[] = [];
    // menuBox;
    constructor() {
        super()

        this.menuButton = [];
        // this.menuBox = [];
    }

    connectedCallback(): void {
        this.attachShadow({
            mode: 'open'
        })
        if (this.shadowRoot == null) return;
        this.shadowRoot.appendChild(template.content.cloneNode(true))

        document.addEventListener("click", evt => {
            this.handleMouse(evt);
        }, false);

        var dialog: HTMLDialogElement = this.shadowRoot.getElementById("dialog") as HTMLDialogElement || null;
        var dialogFrame: HTMLIFrameElement = this.shadowRoot.getElementById("dialogFrame") as HTMLIFrameElement || null;
        if (this.shadowRoot.getElementById("info") != null) {
            this.shadowRoot.getElementById("info") !.addEventListener('click', function () {
                console.log("Info", dialog);
                dialogFrame.src = "info.html";
                dialog.showModal();
            })
        }
        if (this.shadowRoot.getElementById("settings") != null) {
            this.shadowRoot.getElementById("settings") !.addEventListener('click', function () {
                console.log("Settings", dialog);
                dialogFrame.src = "settings.html";
                dialog.showModal();
            })
        }

        dialog.addEventListener("click", e => {
            const dialogDimensions: DOMRect = dialog.getBoundingClientRect()
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                dialog.close();
            }
        })
        if (this.shadowRoot.getElementById("dialogCloseButton") != null) {
            this.shadowRoot.getElementById("dialogCloseButton") !.addEventListener('click', function () {
                dialog.close();
            })
        }
    }

    handleMouse(evt: MouseEvent): void {
        if (this.shadowRoot == null) return;
        // console.log("docClick", menus.length );
        var menu: HTMLUListElement = this.shadowRoot.getElementById('menu-box') as HTMLUListElement;
        if (menu.style.visibility != 'hidden') {
            menu.style.visibility = 'hidden';
            menu.style.opacity = '0';

        }
        menu = this.shadowRoot.getElementById('menu-boxR') as HTMLUListElement;
        if (menu.style.visibility != 'hidden') {
            menu.style.visibility = 'hidden';
            menu.style.opacity = '0';

        }

        // console.log( evt.clientX, evt.clientY );
        if (this.shadowRoot.getElementById('navigation-btn') != null && this.shadowRoot.getElementById('menu-box') != null) {
            if (this.isInElem(evt, this.shadowRoot.getElementById('navigation-btn') !.getBoundingClientRect())) {
                this.placeMenu(this.shadowRoot.getElementById('navigation-btn') !, this.shadowRoot.getElementById('menu-box') !);
            }
        }

        if (this.shadowRoot.getElementById('burger-btn') != null && this.shadowRoot.getElementById('menu-boxR') != null) {
            if (this.isInElem(evt, this.shadowRoot.getElementById('burger-btn') !.getBoundingClientRect())) {
                this.placeMenu(this.shadowRoot.getElementById('burger-btn') !, this.shadowRoot.getElementById('menu-boxR') !);
            }
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

    placeMenu(_sourceElem: HTMLElement, _menuElem: HTMLElement) {
        var rect = _sourceElem.getBoundingClientRect();
        var menuDim = _menuElem.getBoundingClientRect();

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

    addMenuEntry(_name: string, _function: any): void {

    }

    addHeaderRightIcon(_elem: HTMLElement): void {
        if (this.shadowRoot != null && this.shadowRoot.getElementById('right-btn') == null) return;
        this.shadowRoot!.getElementById('right-btn') !.prepend(_elem);
        this.menuButton.push(_elem);
    }

    addHeaderLeftIcon(_elem: HTMLElement): void {
        if (this.shadowRoot != null && this.shadowRoot.getElementById('left-btn') == null) return;
        this.shadowRoot!.getElementById('left-btn') !.append(_elem);
        this.menuButton.push(_elem);
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
customElements.define('jui-menuheader', MenuHeader);