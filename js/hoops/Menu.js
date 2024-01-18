class Menu {
    constructor (hwv) {
        this._hwv = hwv;
        this._initEvents();
    }

    _initEvents() {
        var customOperatorSelect = document.getElementById('operatorType');
        customOperatorSelect.onclick = () => {
            this._hwv.operatorManager.clear();
            this._hwv.operatorManager.push(Communicator.OperatorId.Orbit);
            if (customOperatorSelect.value === "Area Select") {
                this._hwv.operatorManager.push(Communicator.OperatorId.AreaSelect);
            } else if (customOperatorSelect.value === "Select") {
                this._hwv.operatorManager.push(this.selectOperatorId);
            }
        }

        var drawModeSelect = document.getElementById("drawmodeType");
        drawModeSelect.onclick = () => {
            if (drawModeSelect.value === "Solid With Edges")
                this._hwv.view.setDrawMode(Communicator.DrawMode.WireframeOnShaded);
            else if (drawModeSelect.value === "Wireframe")
                this._hwv.view.setDrawMode(Communicator.DrawMode.Wireframe);
            else if (drawModeSelect.value === "Wireframe")
                this._hwv.view.setDrawMode(Communicator.DrawMode.HiddenLine);
        }

        this.selectOperator = new SelectOperator(this._hwv);
        this.selectOperatorId = this._hwv.registerCustomOperator(this.selectOperator);
    }
}