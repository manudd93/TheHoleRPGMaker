/*:
 * @target MZ
 * @plugindesc HUD con 2 slot carta + testo caratteristiche + HUD personalizzabile. (By Ema & Copilot)
 *
 * @param HudImage
 * @text Immagine HUD
 * @desc Nome dell'immagine HUD (senza estensione) in img/pictures/
 * @default hud2
 * 
 * @param HudAltezza
 * @text Altezza Hud
 * @desc Imposta altezza hud
 * @default 120
 * 
 * @param HudLarghezza
 * @text Larghezza HUD
 * @desc Imposta Larghezza hud
 * @default 180
 *
 * @param HudX
 * @text HUD X
 * @desc Imposta altezza hud
 * @default 120
 *
 * @param HudY
 * @text HUDY
 * @desc Imposta altezza hud
 * @default 120
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
 *   AggiornaStats brut arc car sop
 *
 * Esempi:
 *   AggiornaCartaHUD 1 3   → Slot 1 mostra Carta3.png
 *   AggiornaStats 5 2 1 3  → aggiorna le 4 caratteristiche
 */

(() => {

    const params = PluginManager.parameters("Ema_HUD_CartePlus2");

    const HUD_IMAGE = String(params["HudImage"]);
    const CARD_W = Number(params["CardWidth"]);
    const CARD_H = Number(params["CardHeight"]);
    const Hud_Altezza=Number(params["HudAltezza"]);
    const Hud_Larghezza=Number(params["HudLarghezza"]);
    const Hud_X=Number(params["HudX"]);
    const Hud_Y=Number(params["HudY"]);

    const SLOT_POS = {
        1: { x: Number(params["Slot1_X"]), y: Number(params["Slot1_Y"]) },
        2: { x: Number(params["Slot2_X"]), y: Number(params["Slot2_Y"]) }
    };

    const HUD_PICTURE_ID = 40;
    const SLOT_PICTURE_ID = { 1: 41, 2: 42 };
    const TEXT_PICTURE_ID = 60;

    // --- Mostra HUD all'avvio della mappa ---
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
     
        // Mostra HUD
        $gameScreen.showPicture(HUD_PICTURE_ID,HUD_IMAGE,Hud_X,Hud_Y,Graphics.height - 150,100,100,255,0);

        // Mostra testo iniziale
        EmaHUD_CartePlus2.mostraStats(0, 0, 0, 0);
    };

    // --- Comandi Plugin ---
    PluginManager.registerCommand("Ema_HUD_CartePlus2", "AggiornaCartaHUD", args => {
        const slot = Number(args.slot);
        const numero = Number(args.numero);
        EmaHUD_CartePlus2.mostraCarta(slot, numero);
    });

    PluginManager.registerCommand("Ema_HUD_CartePlus2", "AggiornaStats", args => {
        const b = Number(args.brut);
        const a = Number(args.arc);
        const c = Number(args.car);
        const s = Number(args.sop);
        EmaHUD_CartePlus2.mostraStats(b, a, c, s);
    });

    const EmaHUD_CartePlus2 = {

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
        },

        mostraStats(b, a, c, s) {
            const text =
                `Brutalità: ${b}\n` +
                `Arcano: ${a}\n` +
                `Carisma: ${c}\n` +
                `Sopravvivenza: ${s}`;

            $gameScreen.erasePicture(TEXT_PICTURE_ID);

            $gameScreen.showPicture(
                TEXT_PICTURE_ID,
                "",
                0,
                20,
                Graphics.height - 120,
                100,
                100,
                255,
                0
            );

            const sprite = SceneManager._scene._spriteset._pictureSprites[TEXT_PICTURE_ID];
            if (!sprite) return;

            const bitmap = new Bitmap(300, 120);
            bitmap.fontSize = 22;
            bitmap.textColor = "#FFFFFF";
            bitmap.drawText(text, 0, 0, 300, 120, "left");

            sprite.bitmap = bitmap;
        }
    };

})();
