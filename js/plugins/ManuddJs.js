/*:
 * @target MZ
 * @plugindesc Aggiunge o rimuove un bonus variabile quando si equipaggia un oggetto.
 * @author UltraLord
 *
 * @help
 * Scrivi <bonusEquip> nelle note di un oggetto equipaggiabile per aumentare la variabile 10.
 *
 * Quando il giocatore equipaggia un oggetto con <bonusEquip>, la variabile 10 aumenta di 5.
 * Quando lo rimuove, la variabile 10 diminuisce di 5.
 */

(() => {
    const alias_changeEquip = Game_Actor.prototype.changeEquip;
    Game_Actor.prototype.changeEquip = function(slotId, item) {
        const oldItem = this.equips()[slotId]; // Salva l'oggetto rimosso
        alias_changeEquip.call(this, slotId, item);

        if (oldItem && oldItem.meta.bonusEquip) {
            console.log("oggetto rimosso");
            $gameVariables.setValue(4, $gameVariables.value(4) - 1);
            $gameMap.requestRefresh();
        }
        if (item && item.meta.bonusEquip) {
            console.log("oggetto equipaggiato");
            $gameVariables.setValue(4, $gameVariables.value(4) + 1);
            $gameMap.requestRefresh();
        }
       
    };
})();