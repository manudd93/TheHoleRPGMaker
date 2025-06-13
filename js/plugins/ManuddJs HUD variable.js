/*:
 * @target MZ
 * @plugindesc Mostra un semplice HUD con tre variabili personalizzate sullo schermo - Brutalità, Sopravvivenza, Arcano
 * @author Manudd
 */

(() => {
   const hudX = 10; // Posizione X sullo schermo
   const hudY = 10 // Posizione Y sullo schermo
   const lineHeight = 16; // Altezza delle righe di testo

   class VariableHUD extends Sprite {
       constructor() {
           super(new Bitmap(300, 100));
           this.x = hudX;
           this.y = hudY;
           this.updateText();
       }

       updateText() {
    
        const v = $gameVariables._data;
        const b = this.bitmap;
        b.clear();
    
        const width = 150;
        const height = 250;
        const borderSize = 5;
        const borderColor = "#0e1144";
        const backgroundColor = "#871d1d";
        const fontSize = 16;
        const lineSpacing = 2
    
        // Sfondo
        b.fillRect(0, 0, width, height, backgroundColor);
    
        // Cornice
        b.fillRect(0, 0, width, borderSize, borderColor); // top
        b.fillRect(0, height - borderSize, width, borderSize, borderColor); // bottom
        b.fillRect(0, 0, borderSize, height, borderColor); // left
        b.fillRect(width - borderSize, 0, borderSize, height, borderColor); // right
    
        // Testo
        b.fontSize = fontSize;
        b.textColor = "#ffffff";
    
        const labels = [
            { name: "Brutalità", id: 4 },
            { name: "Sopravvivenza", id: 6 },
            { name: "Arcano", id: 9 },
            { name: "Carisma", id: 5 }, // nuova variabile!
            { name: "Karma", id: 1 }
        ];
    
        let y = 8;
        for (const label of labels) {
            const value = v[label.id] || 0;
            b.drawText(`${label.name}: ${value}`, 10, y, width - 20, fontSize + 4, "left");
            y += fontSize + lineSpacing;
        }
    }

       update() {
           super.update();
           this.updateText();
       }
   }

   const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
   Scene_Map.prototype.createAllWindows = function() {
       _Scene_Map_createAllWindows.call(this);
       this._variableHUD = new VariableHUD();
       this.addChild(this._variableHUD);
   };
})();