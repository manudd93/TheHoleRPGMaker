/*:
 * @target MZ
 * @plugindesc HUD con 2 carte dinamiche controllabili via evento
 * @author UltraLord
 *
 * @param Hud2Image
 * @text Immagine HUD
 * @type file
 * @dir img/pictures/
 *
 *  @param Hud2X
 * @text HUD X
 * @default 0
 *
 * @param Hud2Y
 * @text HUD Y
 * @default 0
 * 
 * @param HudScale2X
 * @text Scala HUD X
 * @default 1.0
 *
 * @param HudScale2Y
 * @text Scala HUD Y
 * @default 1.0
 *
 * @param Card1X
 * @text Carta 1 X
 * @default 50
 *
 * @param Card1Y
 * @text Carta 1 Y
 * @default 50
 *
 * @param Card2X
 * @text Carta 2 X
 * @default 150
 *
 * @param Card2Y
 * @text Carta 2 Y
 * @default 50
 * 
 * @command delCurse
 * @text Cancella Maledizione
 *
 * @command delBless
 * @text Cancella Benedizione
 *
 * @command setCards
 * @text Cambia Carte
 *
 * @arg card1
 * @text Carta 1 Maledizione
 * @type file
 * @dir img/pictures/
 *
 * @arg card2
 * @text Carta 2 Benedizione
 * @type file
 * @dir img/pictures/
 * 
 * @param CardScale
 * @text Scala Carte
 * @type number
 * @decimals 2
 * @default 0.5
 */

(() => {

    const pluginName = "CardHUD";

    const params = PluginManager.parameters(pluginName);
    const hud2Image = params["Hud2Image"];
    const hud2X = Number(params["Hud2X"]);
    const hud2Y = Number(params["Hud2Y"]);
    const hudScale2X = Number(params["HudScale2X"]);
    const hudScale2Y = Number(params["HudScale2Y"]);
    const card1X = Number(params["Card1X"]);
    const card1Y = Number(params["Card1Y"]);
    const card2X = Number(params["Card2X"]);
    const card2Y = Number(params["Card2Y"]);
    const cardScale = Number(params["CardScale"]);

    let currentCard1 = null;
    let currentCard2 = null;

    PluginManager.registerCommand(pluginName, "setCards", args => {
        currentCard1 = args.card1;
        currentCard2 = args.card2;
        if (SceneManager._scene._card1Sprite) {
        SceneManager._scene.updateCardHUD();
    }
    });
    PluginManager.registerCommand(pluginName, "delCurse", args => {
         currentCard1 = null;
        
        if (SceneManager._scene._card1Sprite) {
        SceneManager._scene.cancelCurse();
    }
    });
     PluginManager.registerCommand(pluginName, "delBless", args => {
        currentCard2 = null;
        
        if (SceneManager._scene._card2Sprite) {
        SceneManager._scene.cancelBlessing();
    }
    });
const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    _Scene_Map_createAllWindows.call(this);
    this.createUltraHUDLayer();
};

Scene_Map.prototype.createUltraHUDLayer = function() {
    if (this._ultraHudLayer) return;

    this._ultraHudLayer = new Sprite();
    //this._ultraHudLayer.z = 10000; // sopra tutto

    this.addChild(this._ultraHudLayer);

    this.createCardHUD(); // crea HUD dentro questo layer
};

    Scene_Map.prototype.createCardHUD = function() {
    this._hudContainer = new Sprite();

    // HUD base
    this._hudSprite = new Sprite(ImageManager.loadPicture(hud2Image));
    this._hudSprite.x = hud2X;
    this._hudSprite.y = hud2Y;
    this._hudSprite.scale.x = hudScale2X;
    this._hudSprite.scale.y = hudScale2Y;
    this._hudContainer.addChild(this._hudSprite);

    // Carta 1
    this._card1Sprite = new Sprite();
    this._card1Sprite.x = card1X;
    this._card1Sprite.y = card1Y;
    this._card1Sprite.scale.set(cardScale, cardScale);
    this._hudContainer.addChild(this._card1Sprite);

    // Carta 2
    this._card2Sprite = new Sprite();
    this._card2Sprite.x = card2X;
    this._card2Sprite.y = card2Y;
    this._card2Sprite.scale.set(cardScale, cardScale);
    this._hudContainer.addChild(this._card2Sprite);

    this._ultraHudLayer.addChild(this._hudContainer); // 👈 QUI STA LA DIFFERENZA
};
    Scene_Map.prototype.updateCardHUD = function() {
        if (!this._card1Sprite) return;

        if (currentCard1) {
        const bitmap1 = ImageManager.loadPicture(currentCard1);
        this._card1Sprite.bitmap = bitmap1;
    }

        if (currentCard2) {
        const bitmap2 = ImageManager.loadPicture(currentCard2);
        this._card2Sprite.bitmap = bitmap2;
    }
    };
 Scene_Map.prototype.cancelCurse = function() {
       

      
        this._card1Sprite.bitmap = null;
    
    
    };
     Scene_Map.prototype.cancelBlessing = function() {
       

      
        this._card2Sprite.bitmap = null;
    
    
    };
})();