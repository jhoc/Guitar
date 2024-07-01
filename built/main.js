"use strict";
window.onload = () => {
    'use strict';
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./scr/sw.js');
    }
};
//# sourceMappingURL=main.js.map