/*:
 * @target MZ
 * @plugindesc Equalizza gli HP di tutti gli attori e nemici in battaglia alla media totale dei loro HP attuali
 * @author UltraLord & ChatGPT
 *
 * @command EqualizeAllHP
 * @text Equalizza HP Globali
 * @desc Calcola la media degli HP attuali di tutti e imposta lo stesso valore a tutti.
 */

(() => {
    PluginManager.registerCommand("EqualizzaHPGlobale", "EqualizeAllHP", () => {
        const allBattlers = [...$gameParty.members(), ...$gameTroop.members()];
        let totalHp = 0;
        let count = 0;

        for (const battler of allBattlers) {
            if (battler && battler.isAlive()) {
                totalHp += battler.hp;
                count++;
            }
        }

        if (count === 0) return;

        const averageHp = Math.floor(totalHp / count);

        for (const battler of allBattlers) {
            if (battler && battler.isAlive()) {
                battler.setHp(averageHp);
            }
        }

        // Messaggio di debug (facoltativo)
        console.log(`HP globali equalizzati a: ${averageHp}`);
    });
})();
