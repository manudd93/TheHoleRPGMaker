/*:
 * @target MZ
 * @plugindesc Controlla un evento comune prima dell'uso della skill. Se fallisce, la skill non viene eseguita.
 * @author UltraLord
 *
 * @help
 * Usa il tag <CartaCheck:IDevento> nella nota della skill.
 * Esempio: <CartaCheck:15>
 * 
 * Funzionamento:
 * 1. Quando la skill viene usata, avvia l'evento comune con ID specificato.
 * 2. L'evento deve scrivere 1 nella variabile 20 se la magia può essere lanciata.
 * 3. Se la variabile è diversa da 1, la skill viene annullata.
 * 
 * 💡 Variabili fisse:
 * - Evento comune: specificato nel tag
 * - Variabile risultato: ID 20
 */

(function() {
    const RESULT_VARIABLE_ID = 20; // cambia se vuoi usare un'altra variabile

    const _Scene_Battle_commandSkill = Scene_Battle.prototype.commandSkill;
    Scene_Battle.prototype.commandSkill = function() {
        const skill = BattleManager.inputtingAction().item();
        const note = skill.note;
        const cartaTag = /<CartaCheck:(\d+)>/i.exec(note);

        if (cartaTag) {
            const commonEventId = Number(cartaTag[1]);

            // Salva lo stato della skill da eseguire
            this._storedAction = BattleManager.inputtingAction();
            this._storedSubject = BattleManager.actor();
            this._storedSkill = skill;

            // Pulisce la variabile risultato
            $gameVariables.setValue(RESULT_VARIABLE_ID, 0);

            // Avvia l'evento comune
            $gameTemp.reserveCommonEvent(commonEventId);

            // Torna al menu battaglia per ora, in attesa della conclusione evento
            this._skillWaiting = true;
            this._actorCommandWindow.close();
            this._actorCommandWindow.deactivate();
            return;
        }

        _Scene_Battle_commandSkill.call(this);
    };

    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update.call(this);

        if (this._skillWaiting && !$gameMessage.isBusy() && !$gameTemp.isCommonEventReserved()) {
            this._skillWaiting = false;
            const result = $gameVariables.value(RESULT_VARIABLE_ID);

            if (result === 1 && this._storedAction && this._storedSubject) {
                BattleManager.inputtingAction().setSkill(this._storedSkill.id);
                this.commandSkill(); // rilancia la skill
            } else {
                $gameMessage.add("La magia non si attiva...");
                BattleManager.actor().clearActions();
                BattleManager.selectNextCommand();
            }

            this._storedAction = null;
            this._storedSubject = null;
            this._storedSkill = null;
        }
    };
})();
