/*:
 * @target MZ
 * @plugindesc HUD carte con 3 slot + caricamento HUD da parametro + ridimensionamento automatico. (By Ema & Copilot)
 *
 * @param HudImage
 * @text Immagine HUD
 * @desc Nome dell'immagine HUD (senza estensione) presente in img/pictures/
 * @default hud2
 *
 * @param Slot1_X
 * @text Slot 1 - X
 * @default 180
 *
 * @param Slot1_Y
 * @text Slot 1 - Y
 * @default 200
 *
 * @param Slot2_X
 * @text Slot 2 - X
 * @default 320
 *
 * @param Slot2_Y
 * @text Slot 2 - Y
 * @default 200
 *
 * @param Slot3_X
 * @text Slot 3 - X
 * @default 460
 *
 * @param Slot3_Y
 * @text Slot 3 - Y
 * @default 200
 *
 * @param CardWidth
 * @text Larghezza Carta
 * @default 120
 *
 * @param CardHeight
 * @text Altezza Carta
 * @default 180
 *
 * @help
 * Comandi Plugin:
 *
 *   AggiornaCartaHUD slot numero
 *
 * Esempi:
 *   AggiornaCartaHUD 1 3   → nello slot 1 carica Carta3.png
 *   AggiornaCartaHUD 2 1   → nello slot 2 carica Carta1.png
 *   AggiornaCartaHUD 3 5   → nello slot 3 carica Carta5.png
 *
 * Lo HUD viene caricato automaticamente all'avvio della mappa.
 */

(() => {

    const params = PluginManager.parameters("Ema_HUD_CartePlus");

    const HUD_IMAGE = String(params["HudImage"]);
    const CARD_W = Number(params["CardWidth"]);
    const CARD_H = Number(params["CardHeight"]);

    const SLOT_POS = {
        1: { x: Number(params["Slot1_X"]), y: Number(params["Slot1_Y"]) },
        2: { x: Number(params["Slot2_X"]), y: Number(params["Slot2_Y"]) },
        3: { x: Number(params["Slot3_X"]), y: Number(params["Slot3_Y"]) }
    };

    const HUD_PICTURE_ID = 40;
    const SLOT_PICTURE_ID = { 1: 41, 2: 42, 3: 43 };

    // --- Mostra HUD all'avvio della mappa ---
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        $gameScreen.showPicture(
            HUD_PICTURE_ID,
            HUD_IMAGE,
            0,
            0,
            Graphics.height - 200,
            100,
            100,
            255,
            0
        );
    };

    // --- Comando Plugin ---
    PluginManager.registerCommand("Ema_HUD_CartePlus", "AggiornaCartaHUD", args => {
        const slot = Number(args.slot);
        const numero = Number(args.numero);
        EmaHUD_CartePlus.mostraCarta(slot, numero);
    });

    const EmaHUD_CartePlus = {

        mostraCarta(slot, numero) {
            const id = SLOT_PICTURE_ID[slot];
            const nome = `Carta${numero}`;
            const pos = SLOT_POS[slot];

            $gameScreen.erasePicture(id);

            $gameScreen.showPicture(
                id,
                nome,
                0,
                pos.x,
                pos.y,
                100,
                100,
                255,
                0
            );

            this.ridimensiona(id, CARD_W, CARD_H);
        },

        ridimensiona(id, w, h) {
            const sprite = SceneManager._scene._spriteset._pictureSprites[id];
            if (!sprite) return;

            const bitmap = sprite.bitmap;
            if (!bitmap) return;

            bitmap.addLoadListener(() => {
                const scaleX = w / bitmap.width * 100;
                const scaleY = h / bitmap.height * 100;
                $gameScreen.picture(id)._scaleX = scaleX;
                $gameScreen.picture(id)._scaleY = scaleY;
            });
        }
    };

})();
