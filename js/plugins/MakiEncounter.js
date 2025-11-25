//=============================================================================
// Maliki's Random Encounter Step Options
// MalEncounterRateOptions.js
// version 1.6a
//=============================================================================
/*:  
* @plugindesc ver1.6a - Allows players to set a general random encounter rate in the Options Menu.  
 * @author Maliki79
 * 
 * @param RateUpperLimit
 * @desc The highest percentage the Encounter Rate can reach.  This number MUST be at or above 100.
 * Default: 100
 * @default 100
 *
 * @param RateLowerLimit
 * @desc The lowest percentage the Encounter Rate can reach.  This number MUST be at or below 100.
 * Default: 0
 * @default 0
 * 
 * @param EncounterOffset
 * @desc The value that the Encounter Rate will change when a direction or ok is pressed.
 * Default: 50
 * @default 50
 * 
 * @param EncounterRateShow
 * @desc Forces Encounter rate to be shown in Options even when locked. 0 = true 1 = false
 * Default: 0
 * @default 0
 * 
 * @param EncounterSpeed
 * @desc Enter an Interger higher than 0 to allow encounters to occur even when standing still.
 * Default: 0
 * @default 0
 *
 * @help Allows players to set a general random encounter rate in the Options Menu.  
 * This rate can be reduced to 0 to eliminate ALL random encounters.
 * Also allows developers to lock/unlock the encounter rate directly and set 
 * values to whatever they want.
 *
 * Once installed, run your game and go to Options to find the 
 * Encounter Rate setting. (If EncounterRateShow is NOT set to 0, the encounter rate will NOT appear 
 * on the Title Screen's Option Menu as the rate is considered locked when on the Title Screen.)
 *
 * Optional: You can set the Upper limit of the Encounter rate to any number over 100.
 * If set below, or to a non-number, it will default to 100.
 *
 * Optional: You can set the amount the Encounter Rate rises or falls via the Encounter Offset Param.
 *
 * You can set a timer to allow encounters while standing still.
 * If the param EncounterSpeed is set to a number higher than 0, encounters will be able to occur
 * even while players are not moving!
 * Increasing the number will speed up the enocounter rate.
 * Leaving it at 0 will disable this option.
 * (Other encounter rate option will still be in effect)
 * 
 * This plugin now also allows you to adjust the "weight" of random encounters by enemy troop Id.
 * In map notes, you can add the notetag:
 * 
 * <malEncAdj: troopId, amount, condition >>>
 * with troopId being the troop Id number in the database,
 * amount being the amount the weight will be adjusted (this can be negative, but it must be an integer.)
 * and condition can be a javascript eval that returns true or false.
 * (And note the 3 >>> at the end of the tag.)
 * 
 * For example, the tag <malEncAdj: 1, 10, $gameSwitches.value(1)>>>
 * will increase the weight of all instances of troop one on that map by 10 if switch 1 is turned ON.
 * 
 * <malEncAdj: 4, -25, $gameVariables.value(1) > 10>>> 
 * will decrease the weight of all instances of troop 4 on that map by 25 if variable 1 is greater than 10.
 *
 * <malEncAdj: 7, $gameVariables.value(2) * 5, $gameVariables.value(2) > 0>>> 
 * will increase the weight of all instances of troop 7 on that map by 5 * variable 2 if variable 2 is greater than 0.
 *
 * If you set the troop ID to -1, it will affect ALL troops on that map if the conditions are met.
 *
 * weights are cumulative, meaning you could potentially have a troop affected by multiple tages.
 * Note that any weight values that change to a value below 0 will NOT be encountered at all.
 * Conversely, any troops initially set to 0 in the database but brought above 1 or higher CAN be encountered.
 * (You can eval weight to an integer)
 *
 *  SCRIPT CALLS
 *
 * $gameSystem.lockEncounterRate();
 * This call will LOCK the Encounter Rate setting at whatever number it was when called.
 * You can add a number in the () to set the rate while locking it.
 * Note: Unless EncounterRateShow is set to 0, the Encounter Rate will not show on the Option
 * Menu while locked.
 *
 * $gameSystem.unlockEncounterRate();
 * This call will allow players to change the Encounter Rate again after it hs been locked.
 * You can add a number in the () to set the rate while unlocking it.
 *
 * $gameSystem.setEncounterRate(x);
 * This call will change the Encounter Rate to any positive integer.
 * Note that the player can change the number if the Encounter Rate is not locked.
 *
 * $gameSystem.getEncounterRate();
 * This call will return the current Encounter Rate.
 */
 
ConfigManager.commandEncounter = 100;
 
var MalEncounterTitle = Scene_Title.prototype.create;
Scene_Title.prototype.create = function() {
MalEncounterTitle.call(this);
$gameSystem._encountersLocked = true;
}
 
var MalEncounterInitialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
MalEncounterInitialize.call(this);
this._encountersLocked = false;
}
 
Game_System.prototype.lockEncounterRate = function(setting) {
$gameSystem._encountersLocked = true;
if (setting) this.setEncounterRate(setting);
}
 
Game_System.prototype.unlockEncounterRate = function(setting) {
$gameSystem._encountersLocked = false;
if (setting) this.setEncounterRate(setting);
}
 
Game_System.prototype.getEncounterRate = function() {
return $gameSystem._encounterRate;
}
 
Game_System.prototype.setEncounterRate = function(setting) {
var numb = Number(eval(setting)) || 100;
if (numb < 0) numb = 0;
ConfigManager['commandEncounterVolume'] = numb;
$gameSystem._encounterRate = numb;
}
 
Object.defineProperty(ConfigManager, 'encounterRate', {
    get: function() {
        return ConfigManager.commandEncounterVolume;
    },
    set: function(value) {
        ConfigManager.commandEncounterVolume = value;
    },
    configurable: true
});
 
var Mal_Config_MakeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
    var config = Mal_Config_MakeData.call(this);
    config.encounterRate = this.encounterRate;  
    return config;
};
 
var Mal_Config_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
    Mal_Config_applyData.call(this, config);
    this.encounterRate = this.readEncounter(config, 'encounterRate');
};
 
ConfigManager.readEncounter = function(config, name) {
    var value = config[name];
    if (value !== undefined) {
        return Number(value);
    } else {
        return 100;
    }
};
 
Window_Options.prototype.encounterOffset = function() {
    var num = Number(PluginManager.parameters('MalEncounterRateOptions')['EncounterOffset']) || 50;
    if (num !== undefined) {
    return Math.floor(num);
    } else {
    return 50;
}   
};
 
var Mal_Window_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
Window_Options.prototype.addGeneralOptions = function() {
    Mal_Window_addGeneralOptions.call(this);
    if (PluginManager.parameters('MalEncounterRateOptions')['EncounterRateShow'] == 0 || $gameSystem._encountersLocked == false ) this.addCommand("Encounter Rate", 'commandEncounterVolume');
    };
    
Game_Player.prototype.encounterProgressValue = function() {
    var value = $gameMap.isBush(this.x, this.y) ? 2 : 1;
    var val2 = ConfigManager.encounterRate;
    if ($gameParty.hasEncounterHalf()) {
        value *= 0.5;
    }
    if (this.isInShip()) {
        value *= 0.5;
    }
    return value * (val2 / 100.0);
};
 
ConfigManager.readEncounter = function(config, name) {
    var value = config[name];
    var limit = Number(PluginManager.parameters('MalEncounterRateOptions')['RateUpperLimit']);
    var lowLimit = Number(PluginManager.parameters('MalEncounterRateOptions')['RateLowerLimit']);
    if (limit < 100) limit = 100;
    if (lowLimit < 0) lowLimit = 0;
    if (value !== undefined) {
        return Number(value).clamp(lowLimit, limit);
    } else {
        return 100;
    }
};
 
Window_Options.prototype.isEncounterSymbol = function(symbol) {
    return symbol.contains('Encounter');
};
 
var Mal_Win_Options_processOk = Window_Options.prototype.processOk
Window_Options.prototype.processOk = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (this.isEncounterSymbol(symbol) ) {
        var value = this.getConfigValue(symbol);
        var offset = this.encounterOffset();
        var limit = Math.floor(Number(PluginManager.parameters('MalEncounterRateOptions')['RateUpperLimit'])) || 100;
        var lowLimit = Math.floor(Number(PluginManager.parameters('MalEncounterRateOptions')['RateLowerLimit'])) || 0;
        if (limit < 100) limit = 100;
        if ($gameSystem._encountersLocked == false){
        if (value + offset > limit && value != limit) {
        value = limit;
        } else {
        value += offset;
        }
        if (value > limit) value = lowLimit;
        this.changeValue(symbol, value);
        $gameSystem._encounterRate = value;
        } else {
        SoundManager.playBuzzer(); 
        }
        } else {
            Mal_Win_Options_processOk.call(this);
        }
};
 
var Mal_Win_Options_cursorRight = Window_Options.prototype.cursorRight
Window_Options.prototype.cursorRight = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (this.isEncounterSymbol(symbol)) {
        var value = this.getConfigValue(symbol);
        var offset = this.encounterOffset();
        var limit = Math.floor(Number(PluginManager.parameters('MalEncounterRateOptions')['RateUpperLimit'])) || 100;
        var lowLimit = Math.floor(Number(PluginManager.parameters('MalEncounterRateOptions')['RateLowerLimit'])) || 0;
        if (limit < 100) limit = 100;
        if ($gameSystem._encountersLocked == false){
        if (value + offset > limit && value != limit) {
        value = limit;
        } else {
        value += offset;
        }
        if (value > limit) value = lowLimit;
        this.changeValue(symbol, value);
        $gameSystem._encounterRate = value;
        } else {
        SoundManager.playBuzzer(); 
        }
        } else {
            Mal_Win_Options_cursorRight.call(this, wrap);
        }
};
 
var Mal_Win_Options_cursorLeft = Window_Options.prototype.cursorLeft
Window_Options.prototype.cursorLeft = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (this.isEncounterSymbol(symbol)) {
        var value = this.getConfigValue(symbol);
        var offset = this.encounterOffset();
        var limit = Math.floor(Number(PluginManager.parameters('MalEncounterRateOptions')['RateUpperLimit'])) || 100;
        var lowLimit = Math.floor(Number(PluginManager.parameters('MalEncounterRateOptions')['RateLowerLimit'])) || 0;
        if (limit < 100) limit = 100;
        if ($gameSystem._encountersLocked == false){
        if (value - offset < lowLimit && value != lowLimit) {
        value = lowLimit;
        } else {
        value -= offset;
        }
        if (value < lowLimit) value = limit;
        this.changeValue(symbol, value);
        $gameSystem._encounterRate = value;
        } else {
        SoundManager.playBuzzer(); 
        }
        } else {
            Mal_Win_Options_cursorLeft.call(this, wrap);
        }
};
 
var MalEncounter_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
Scene_Load.prototype.onLoadSuccess = function() {
MalEncounter_onLoadSuccess.call(this);
ConfigManager['commandEncounterVolume'] = $gameSystem._encounterRate || 100;
//$gamePlayer.encounterTick = 0;
}
 
//var MalEncounter_updateNonmoving = Game_Player.prototype.updateNonmoving;
Game_Player.prototype.updateNonmoving = function(wasMoving) {
    if (!$gamePlayer.encounterTick) $gamePlayer.encounterTick = 0;
    if (!$gameMap.isEventRunning()) {
        if (wasMoving) {
            $gameParty.onPlayerWalk();
            this._firstStep = false;
            this.checkEventTriggerHere([1,2]);
            if ($gameMap.setupStartingEvent()) {
                return;
            }
        }
        if (this.triggerAction()) {
            return;
        }
        if ($gamePlayer.encounterTick >= 1000) {
            this.updateEncounterCount();
            $gamePlayer.encounterTick = 0;
        } else {
            if(!this._firstStep) $gamePlayer.encounterTick += 1 * Math.floor(Number(PluginManager.parameters('MalEncounterRateOptions')['EncounterSpeed']));
            //console.log($gamePlayer.encounterTick);
        }
        if (wasMoving) {
            this.updateEncounterCount();
        } else {
            $gameTemp.clearDestination();
        }
    }
};
 
var MalEncounterCount = Game_Player.prototype.makeEncounterCount;
Game_Player.prototype.makeEncounterCount = function() {
    MalEncounterCount.call(this);
    if(PluginManager.parameters('MalEncounterRateOptions')['EncounterSpeed'] != 0) this._encounterCount += 3;
    this._firstStep = true;
};
 
//TESTING
var malEncounterGMSetup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    if (!$dataMap) {
        throw new Error('The map data is not available');
    }
    malEncounterGMSetup.call(this, mapId);
    this.setupEncounterAdjusts();
};
 
Game_Map.prototype.setupEncounterAdjusts = function() {
    this._encounterAdjusts = [];
var noteread = $dataMap.note;
while(noteread.indexOf("malEncAdj") > -1)
{ 
    var notereg = noteread.split("<malEncAdj: ");
    var match = notereg[1].split(">>>");
    match = match[0].split(", ");
    match[0] = parseInt(match[0]);
    //match[1] = parseInt(match[1]);
    this._encounterAdjusts.push(match);
    noteread = noteread.replace("<malEncAdj: ", " ");
}
};
 
Game_Player.prototype.makeEncounterTroopId = function() {
    var encounterList = [];
    var weightSum = 0;
    $gameMap.encounterList().forEach(function(encounter) {
        if (this.meetsEncounterConditions(encounter)) {
            var encounterCopy = encounter;
            encounterCopy = this.malEncounterAdjust(encounterCopy);
            if (encounterCopy.weight > 0) {
                encounterList.push(encounterCopy);
                weightSum += encounterCopy.weight;
            }
        }
    }, this);
    if (weightSum > 0) {
        var value = Math.randomInt(weightSum);
        for (var i = 0; i < encounterList.length; i++) {
            value -= encounterList[i].weight;
            if (value < 0) {
                return encounterList[i].troopId;
            }
        }
    }
    return 0;
};
 
Game_Player.prototype.malEncounterAdjust = function (encounter) {
    var ec = encounter;
    var id = ec.troopId;
    var ea = $gameMap._encounterAdjusts;
    for (var i = 0; i < ea.length; i++) {
        var line = ea[i];
        var value = Number(eval(line[1])) || 0;
        var check = eval(line[2]);
        if ((line[0] == id || line[0] == -1) && check) ec.weight += value;
    }
    return ec;
}