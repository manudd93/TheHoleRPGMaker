/*:
 * @target MZ
 * @plugindesc Inseguimento con commento [CHASE] e stop fuori vista - v1.1 by UltraLord
 * @author UltraLord
 *
 * @param Vision Radius
 * @type number
 * @min 1
 * @default 5
 * @desc Distanza in tile in cui il nemico vede il giocatore
 *
 * @help
 * 📌 Inserisci il commento [CHASE] nella prima pagina di un evento per farlo
 * inseguire automaticamente il giocatore solo se lo vede.
 *
 * ✅ Il nemico smette di inseguire se perdi di vista il giocatore
 */

(() => {
  const parameters = PluginManager.parameters("ChaseByComment");
  const visionRadius = Number(parameters["Vision Radius"] || 5);

  Game_Event.prototype.hasChaseTag = function() {
    if (!this.page() || !this.list()) return false;
    return this.list().some(cmd =>
      cmd.code === 108 && typeof cmd.parameters[0] === 'string' && cmd.parameters[0].includes("[CHASE]")
    );
  };

  Game_Event.prototype.isPlayerInSight = function() {
    const dx = this.x - $gamePlayer.x;
    const dy = this.y - $gamePlayer.y;
    const distSquared = dx * dx + dy * dy;
    return distSquared <= visionRadius * visionRadius;
  };

  const _Game_Event_update = Game_Event.prototype.update;
  Game_Event.prototype.update = function() {
    _Game_Event_update.call(this);

    if (!this._erased && this.hasChaseTag()) {
      if (this.isPlayerInSight()) {
        this.moveTowardPlayer();
      } else {
        // Quando il giocatore esce dalla vista, il nemico non fa nulla (puoi aggiungere altro qui)
        // Ad esempio, qui potresti farlo tornare alla posizione originale o stare fermo
      }
    }
  };
})();

