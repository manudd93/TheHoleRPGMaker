/*:
 * @target MZ
 * @plugindesc Mostra una finestra nel menu con variabili: Brutalità, Sopravvivenza, Arcano, Carisma - stile RPG classico
 * @author UltraLord
 */

(() => {
    // === Finestra custom ===
    class Window_VariableDisplay extends Window_Base {
        constructor(x, y, width, height) {
            super(new Rectangle(x, y, width, height));
            this.refresh();
        }

        refresh() {
            this.contents.clear();
            const v = $gameVariables._data;
            const labels = [
                { name: "Brutalità", id: 4 },
                { name: "Sopravvivenza", id: 6 },
                { name: "Arcano", id: 9 },
                { name: "Carisma", id: 5 },
                { name: "Destino", id: 1 }

            ];

            let y = 0;
            for (const label of labels) {
                const value = v[label.id] || 0;
                this.drawText(`${label.name}:`, 0, y, 120, "left");
                this.drawText(value, 120, y, 60, "right");
                y += this.lineHeight();
            }
        }
    }

    // === Aggiunta alla scena del menu ===
    const _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.call(this);
        this.createVariableWindow();
    };

    Scene_Menu.prototype.createVariableWindow = function() {
        const x = 565;
        const y = this._commandWindow.height - 184; // sotto al menu principale
        const width = 250;
        const height =  this.calcWindowHeight(4, true); // 4 righe
        this._variableWindow = new Window_VariableDisplay(x, y, width, height);
        this.addWindow(this._variableWindow);
    };

//     // === Aggiunta della finestra anche in battaglia ===
// const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
// Scene_Battle.prototype.createAllWindows = function() {
//     _Scene_Battle_createAllWindows.call(this);
//     this.createVariableWindow();
// };

// Scene_Battle.prototype.createVariableWindow = function() {
//     const x = -100;
//     const y = this._statusWindow.y - this.calcWindowHeight(4, true) -210 ; // sopra la finestra dello status
//     const width = 210;
//     const height = this.calcWindowHeight(4, true);
//     this._variableWindow = new Window_VariableDisplay(x, y, width, height);
//     this.addWindow(this._variableWindow);
// };

})();
