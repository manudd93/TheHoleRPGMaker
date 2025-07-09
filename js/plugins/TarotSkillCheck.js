/*:
 * @target MZ
 * @plugindesc Magia con estrazione carte: evento mostra la carta, poi si confronta risultato con variabile Arcano per decidere se lanciare o no. (tag <TarotCheck>) - UltraLord
 * @author UltraLord
 */

(() => {
    const ARCANO_VAR_ID = 9;        // Variabile che contiene soglia "Arcano"
    const RISULTATO_VAR_ID = 20;     // Variabile dove l'evento comune salva il risultato del tiro
    const EVENTO_COMUNE_ID = 18;     // Evento comune che mostra la carta

    const _Game_Action_apply = Game_Action.prototype.apply;

    Game_Action.prototype.apply = function(target) {
        const item = this.item();

        if (item.meta.TarotCheck) {
            // STEP 1: Primo lancio → chiama evento comune visivo
            if (!this._tarotStarted) {
                this._tarotStarted = true;
                $gameTemp.reserveCommonEvent(EVENTO_COMUNE_ID);
                this._tarotWaiting = true;
                return;
            }

            // STEP 2: Dopo l’evento → ora leggiamo il risultato salvato
            if (this._tarotWaiting) {
                this._tarotWaiting = false;

                const user = this.subject();
                const tiro = $gameVariables.value(RISULTATO_VAR_ID);
                const arcano = $gameVariables.value(ARCANO_VAR_ID);

                // Mostra il confronto
                $gameMessage.add(`${user.name()} ha estratto ${tiro}, serviva meno di ${arcano}`);

                if (tiro >= arcano) {
                    $gameMessage.add(`La magia fallisce!`);
                    return; // annulla effetto
                } else {
                    $gameMessage.add(`Successo! La magia ha effetto.`);
                }
            }
        }

        // STEP 3: La magia parte normalmente
        _Game_Action_apply.call(this, target);
    };
})();
