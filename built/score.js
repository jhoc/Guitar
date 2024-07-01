// import {
//     Diagram,
// } from "./Diagram.js";
import { dataScore } from "./Data_Score.js";
export var StaffType;
(function (StaffType) {
    StaffType[StaffType["SHORT"] = 0] = "SHORT";
    StaffType[StaffType["TAB"] = 1] = "TAB";
    StaffType[StaffType["NOTE"] = 2] = "NOTE";
})(StaffType || (StaffType = {}));
export class Score {
    constructor(_canvas, _instrument) {
        this.canvas = _canvas;
        this.ctx = _canvas.getContext('2d');
        this.m_dataScore = dataScore;
    }
    update() {
        if (this.ctx == null)
            return;
        this.ctx.fillText("SCORE", 100, 100);
    }
}
//# sourceMappingURL=score.js.map