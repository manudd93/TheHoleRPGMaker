/*:
 * @target MZ
 * @plugindesc HUD avanzato: immagine HUD, ritratto, barre HP/MP e barra Corruzione. Mostrato solo sulla mappa. Include scaling HUD e ritratto.
 * @author Copilot
 *
 * @param HudImage
 * @text Immagine HUD
 * @default hud
 *
 * @param HudX
 * @text HUD X
 * @default 0
 *
 * @param HudY
 * @text HUD Y
 * @default 0
 *
 * @param HudScaleX
 * @text Scala HUD X
 * @default 1.0
 *
 * @param HudScaleY
 * @text Scala HUD Y
 * @default 1.0
 *
 * @param Portrait
 * @text Ritratto
 * @default portrait
 *
 * @param PortraitX
 * @text Ritratto X
 * @default 10
 *
 * @param PortraitY
 * @text Ritratto Y
 * @default 10
 *
 * @param PortraitScaleX
 * @text Scala Ritratto X
 * @default 1.0
 *
 * @param PortraitScaleY
 * @text Scala Ritratto Y
 * @default 1.0
 *
 * @param HpBarX
 * @text Barra HP X
 * @default 120
 *
 * @param HpBarY
 * @text Barra HP Y
 * @default 20
 *
 * @param MpBarX
 * @text Barra MP X
 * @default 120
 *
 * @param MpBarY
 * @text Barra MP Y
 * @default 50
 *
 * @param BarWidth
 * @text Larghezza barre HP/MP
 * @default 150
 *
 * @param CorruptionVar
 * @text Variabile Corruzione
 * @default 1
 *
 * @param CorruptionMax
 * @text Corruzione Max
 * @default 100
 *
 * @param CorruptionWidth
 * @text Larghezza barra Corruzione
 * @default 150
 *
 * @param CorruptionX
 * @text Corruzione X
 * @default 120
 *
 * @param CorruptionY
 * @text Corruzione Y
 * @default 80
 *
 * @help
 * Inserisci:
 *  - HUD in /img/pictures/
 *  - Ritratto in /img/pictures/
 *
 * L'HUD appare solo sulla mappa.
 */

(() => {
    const p = PluginManager.parameters("AdvancedHUD_Plus");

    const hudImage = String(p["HudImage"]);
    const hudX = Number(p["HudX"]);
    const hudY = Number(p["HudY"]);
    const hudScaleX = Number(p["HudScaleX"]);
    const hudScaleY = Number(p["HudScaleY"]);

    const portrait = String(p["Portrait"]);
    const portraitX = Number(p["PortraitX"]);
    const portraitY = Number(p["PortraitY"]);
    const portraitScaleX = Number(p["PortraitScaleX"]);
    const portraitScaleY = Number(p["PortraitScaleY"]);

    const hpX = Number(p["HpBarX"]);
    const hpY = Number(p["HpBarY"]);
    const mpX = Number(p["MpBarX"]);
    const mpY = Number(p["MpBarY"]);
    const barWidth = Number(p["BarWidth"]);

    const corruptionVar = Number(p["CorruptionVar"]);
    const corruptionMax = Number(p["CorruptionMax"]);
    const corruptionWidth = Number(p["CorruptionWidth"]);
    const corruptionX = Number(p["CorruptionX"]);
    const corruptionY = Number(p["CorruptionY"]);

    // --- HUD SOLO SULLA MAPPA ---
    const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _Scene_Map_createDisplayObjects.call(this);
        this.createHud();
    };

    Scene_Map.prototype.createHud = function() {
        this._hudContainer = new Sprite();
        this.addChild(this._hudContainer);

        // Immagine HUD
        this._hudImage = new Sprite(ImageManager.loadPicture(hudImage));
        this._hudImage.x = hudX;
        this._hudImage.y = hudY;
        this._hudImage.scale.x = hudScaleX;
        this._hudImage.scale.y = hudScaleY;
        this._hudContainer.addChild(this._hudImage);

        // Ritratto
        this._portrait = new Sprite(ImageManager.loadPicture(portrait));
        this._portrait.x = portraitX;
        this._portrait.y = portraitY;
        this._portrait.scale.x = portraitScaleX;
        this._portrait.scale.y = portraitScaleY;
        this._hudContainer.addChild(this._portrait);

        // Barre HP/MP
        this._hpBar = new Sprite(new Bitmap(barWidth, 20));
        this._hpBar.x = hpX;
        this._hpBar.y = hpY;
        this._hudContainer.addChild(this._hpBar);

        this._mpBar = new Sprite(new Bitmap(barWidth, 20));
        this._mpBar.x = mpX;
        this._mpBar.y = mpY;
        this._hudContainer.addChild(this._mpBar);

        // Barra Corruzione
        this._corruptionBar = new Sprite(new Bitmap(corruptionWidth, 20));
        this._corruptionBar.x = corruptionX;
        this._corruptionBar.y = corruptionY;
        this._hudContainer.addChild(this._corruptionBar);
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this.updateHud();
    };

    Scene_Map.prototype.updateHud = function() {
        if (!this._hudContainer) return;

        const actor = $gameParty.leader();
        if (!actor) return;

        // --- HP BAR ---
        const hpRatio = actor.hp / actor.mhp;
        const hpWidth = Math.floor(barWidth * hpRatio);
        const hpBmp = this._hpBar.bitmap;
        hpBmp.clear();
        hpBmp.fillRect(0, 0, hpWidth, 20, "#FF4444");
        hpBmp.strokeRect(0, 0, barWidth, 20, "#000000");

        // --- MP BAR ---
        const mpRatio = actor.mp / actor.mmp;
        const mpWidth = Math.floor(barWidth * mpRatio);
        const mpBmp = this._mpBar.bitmap;
        mpBmp.clear();
        mpBmp.fillRect(0, 0, mpWidth, 20, "#4488FF");
        mpBmp.strokeRect(0, 0, barWidth, 20, "#000000");

        // --- CORRUZIONE ---
        const corruption = $gameVariables.value(corruptionVar);
        const cRatio = Math.min(corruption / corruptionMax, 1);
        const cWidth = Math.floor(corruptionWidth * cRatio);
        const cBmp = this._corruptionBar.bitmap;
        cBmp.clear();
        cBmp.fillRect(0, 0, cWidth, 20, "#AA00FF");
        cBmp.strokeRect(0, 0, corruptionWidth, 20, "#000000");
    };

    // --- NASCONDI HUD FUORI DALLA MAPPA ---
    const scenesToHide = [Scene_Menu, Scene_Battle, Scene_Item, Scene_Status, Scene_Equip];

    scenesToHide.forEach(scene => {
        const _start = scene.prototype.start;
        scene.prototype.start = function() {
            _start.call(this);
            if (SceneManager._scene._hudContainer) {
                SceneManager._scene._hudContainer.visible = false;
            }
        };
    });

})();
