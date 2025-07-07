/*:
 * @target MZ
 * @plugindesc Uccide un membro casuale del party e un nemico casuale, ma se il nemico è un boss, non lo uccide. Protezione boss inclusa.
 * @author UltraLord & ChatGPT
 *
 * @command SacrificioCasuale
 * @text Scambio Letale (Protegge Boss)
 * @desc Sceglie un alleato e un nemico a caso. Se il nemico è un boss, sopravvive. L’alleato muore comunque.
 */

(() => {
    PluginManager.registerCommand("ScambioMorteConBoss", "SacrificioCasuale", () => {
        const partyMembers = $gameParty.aliveMembers();
        const enemyMembers = $gameTroop.aliveMembers();

        if (partyMembers.length < 2 || enemyMembers.length < 1) {
            console.log("Non abbastanza membri per lo scambio letale.");
            return;
        }

        const chosenAlly = partyMembers[Math.floor(Math.random() * partyMembers.length)];
        const chosenEnemy = enemyMembers[Math.floor(Math.random() * enemyMembers.length)];

        // Check se il nemico è un "Boss"
        const isBoss = chosenEnemy.name().toLowerCase().includes("boss") ||
                       chosenEnemy.name().includes("Ω") ||
                       chosenEnemy.enemy().note.includes("<BOSS>");

        // Uccide l’alleato
        chosenAlly.setHp(0);

        if (!isBoss) {
            chosenEnemy.setHp(0);
            console.log(`${chosenAlly.name()} e ${chosenEnemy.name()} sono morti.`);
        } else {
            console.log(`${chosenAlly.name()} è morto, ma ${chosenEnemy.name()} è un BOSS e sopravvive!`);
        }
    });
})();
