class Menu {
    constructor (hwv) {
        this._hwv = hwv;
        this._initEvents();
    }

    _initEvents() {
        var customOperatorSelect = document.getElementById('operatorType');
        customOperatorSelect.onclick = () => {
            console.log(this._hwv.operatorManager);
            this._hwv.operatorManager.clear();
            this._hwv.operatorManager.push(Communicator.OperatorId.Orbit);
            if (customOperatorSelect.value === "Area Select") {
                this._hwv.operatorManager.push(Communicator.OperatorId.AreaSelect);
            } else if (customOperatorSelect.value === "Select") {
                this._hwv.operatorManager.push(this.selectOperatorId);
            } else if (customOperatorSelect.value === "Measure") {
                this._hwv.operatorManager.push(this.measureOperatorId);
            }
        }

        var drawModeSelect = document.getElementById("drawmodeType");
        drawModeSelect.onclick = () => {
            if (drawModeSelect.value === "Solid with Edges")
                this._hwv.view.setDrawMode(Communicator.DrawMode.WireframeOnShaded);
            else if (drawModeSelect.value === "Wireframe")
                this._hwv.view.setDrawMode(Communicator.DrawMode.Wireframe);
            else if (drawModeSelect.value === "HiddenLine")
                this._hwv.view.setDrawMode(Communicator.DrawMode.HiddenLine);
        }

        this.selectOperator = new SelectOperator(this._hwv);
        this.selectOperatorId = this._hwv.registerCustomOperator(this.selectOperator);

        this.measureOperator = new MeasureBetweenPointOperator(this._hwv);
        this.measureOperatorId = this._hwv.registerCustomOperator(this.measureOperator);
    }
}