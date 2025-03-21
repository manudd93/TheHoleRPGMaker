// ================= //
// PauseMenuInfos.js //
// ================= //

/*:
 * @target MZ
 * @plugindesc Adds pause menu info windows: map name, playtime, and/or variables.
 * @author Caethyril
 * @url https://forums.rpgmakerweb.com/threads/140600/
 * @help Leave a format string blank to hide that window.
 *
 * Free to use and/or modify for any project, no credit required.
 *
 * Update 2024-03-22: improved quality of underlying framework.
 *                    added multiple variables, alignment, and manual ordering.
 *
 * @param sMap
 * @text Format: Map Name
 * @type string
 * @desc Format string for the map name display.
 * %1 = map display name, %2 = map ID.
 * @default %1
 *
 * @param sTime
 * @text Format: Playtime
 * @type string
 * @desc Format string for the playtime display.
 * %1 = play time (as shown on save screen).
 * @default |%1|
 *
 * @param sVar
 * @text Format: Variable
 * @type string
 * @desc Format string for the variable display.
 * %1 = variable name, %2 = variable value.
 * @default \c[4]%1\c[0]|%2
 *
 * @param iVar
 * @text Variable IDs
 * @parent sVar
 * @type variable[]
 * @desc The game variable(s) to display.
 * @default []
 *
 * @param order
 * @text Info Order
 * @type select[]
 * @option 0 - Map Name
 * @value 0
 * @option 1 - Playtime
 * @value 1
 * @option 2 - Variables
 * @value 2
 * @desc Determines info window display order, top to bottom.
 * @default ["0", "1", "2"]
 *
 * @param sep
 * @text Alignment Separator
 * @type string
 * @desc Separator for "next alignment" in format strings.
 * Default: |
 * @default |
 */

;void (() => {
    'use strict';
    
        /** Plugin filename. @type {string} */
        const PLUGIN_NAME = 'PauseMenuInfos';
    
        /** Plugin parameters. @type {object.<string, string>} */
        const P = PluginManager.parameters(PLUGIN_NAME);
    
        /** Placement order (top to bottom) for new pause menu info game windows on `Scene_Menu`. */
        const ORDER = Object.freeze(Array.from(
            JSON.parse(P.order || "[]"),
            s => parseInt(s, 10)
        ).filter((s, n, a) => a.indexOf(s) === n));
    
        /** Heading/value separator for format strings, for text alignment. @type {string} */
        const SEP = P.sep;
    
        /**
         * @param {string} s
         * Input parameter value.
         * @returns {string[]}
         * Parsed format string.
         */
        const splitForm = function(s) {
            return s.split(SEP);
        };
    
        /** Format strings for each new info window. */
        const F = Object.freeze(Array.from([P.sMap, P.sTime, P.sVar], splitForm));
    
        /** Variable IDs for display. */
        const iVar = Object.freeze(Array.from(
            JSON.parse(P.iVar || "[]"),
            s => parseInt(s, 10) || 0
        ));
    
        /** Rows for each new info window. */
        const R = Object.freeze([
            F[0].some(s => s) ? 1 : 0,
            F[1].some(s => s) ? 1 : 0,
            F[2].some(s => s) ? iVar.length : 0
        ]);
    
        /** Global constructor name for new base pause menu info game window. */
        const BASE = "Window_CaeMenuExtraBase";
    
        /** Global constructor names for new pause menu info game windows. */
        const N = Object.freeze([
            "Window_CaeMapName",
            "Window_CaePlaytime",
            "Window_CaeVariable"
        ]);
    
        /** Property identifiers for new pause menu info game windows on `Scene_Menu`. */
        const I = Object.freeze([
            "_mapNameWindowCae",
            "_playtimeWindowCae",
            "_varWindowCae"
        ]);
    
        // ======= Base ======= //
    
        Object.assign((globalThis[BASE] = function() {
            this.initialize(...arguments)
        }).prototype = Object.create(Window_Selectable.prototype), {
            constructor: globalThis[BASE],
            initialize: function(rect) {
                Window_Selectable.prototype.initialize.apply(this, arguments);
                this.refresh();
            },
            maxItems: function() {
                return 1;
            },
            colSpacing: function() {
                return 0;
            },
            rowSpacing: function() {
                return 0;
            },
            itemHeight: function() {
                return Window_Base.prototype.itemHeight.apply(this, arguments);
            },
            isRTL: function(text) {
                return Utils.containsArabic(text);
            },
            format: function() {
                return [];
            },
            values: function(index) {
                return [];
            },
            texts: function(index) {
                const v = this.values(index);
                const r = Array.from(this.format(), (s, n) => String(s).format(...v));
                return r.some(t => this.isRTL(t)) ? r.reverse() : r;
            },
            drawItemBackground: function(index) {},
            drawItem: function(index) {
                const rect = this.itemLineRect(index);
                const v  = this.texts(index);
                const t  = s => s ? Math.ceil(this.textSizeEx(s).width) : 0;
                const w2 = t(v[2]);
                const w1 = t(v[1]);
                const w0 = w1 || w2 ? t(v[0]) : rect.width;
                if (w0)
                    this.drawTextEx(v[0], rect.x, rect.y, w0);
                if (w1)
                    this.drawTextEx(v[1], rect.x + ((rect.width - w1) >> (v.length > 2 ? 1 : 0)), rect.y, w1);
                if (w2)
                    this.drawTextEx(v[2], rect.x + rect.width - w2, rect.y, w2);
            }
        });
    
        // ===== Map Name ===== //
    
        Object.assign((globalThis[N[0]] = function() {
            this.initialize(...arguments);
        }).prototype = Object.create(globalThis[BASE].prototype), {
            constructor: globalThis[N[0]],
            format: function() {
                return F[0];
            },
            values: function(index) {
                return [$gameMap.displayName(), $gameMap.mapId()];
            }
        });
    
        // ===== Playtime ===== //
    
        Object.assign((globalThis[N[1]] = function() {
            this.initialize(...arguments);
        }).prototype = Object.create(globalThis[BASE].prototype), {
            constructor: globalThis[N[1]],
            format: function() {
                return F[1];
            },
            values: function(index) {
                return [$gameSystem.playtimeText()];
            },
            update: function() {
                globalThis[BASE].prototype.update.apply(this, arguments);
                if ($gameSystem.playtime() !== this._cache)
                    this.refresh();
            },
            refresh: function() {
                globalThis[BASE].prototype.refresh.apply(this, arguments);
                this._cache = $gameSystem.playtime();
            }
        });
    
        // ===== Variable ===== //
    
        Object.assign((globalThis[N[2]] = function() {
            this.initialize(...arguments);
        }).prototype = Object.create(globalThis[BASE].prototype), {
            constructor: globalThis[N[2]],
            format: function() {
                return F[2];
            },
            values: function(index) {
                const id = iVar[index];
                return [$dataSystem.variables[id], $gameVariables.value(id)];
            },
            maxItems: function() {
                return R[2];
            }
        });
    
        // ======= Menu ======= //
    
        // Patch - reduce command window height to accommodate new windows.
        void (alias => {
            Scene_Menu.prototype.commandWindowRect = function() {
                const rect = alias.apply(this, arguments);
                rect.height -= ORDER.reduce(
                    (a, c) => a + (R[c] ? this.calcWindowHeight(R[c], false) : 0)
                , 0);
                return rect;
            };
        })(Scene_Menu.prototype.commandWindowRect);
    
        // Patch - add new windows.
        void (alias => {
            Scene_Menu.prototype.create = function() {
                alias.apply(this, arguments);
                const rect = this.goldWindowRect();
                for (let i = ORDER.length; i--;) {
                    const n = ORDER[i];
                    if (R[n]) {
                        rect.height = this.calcWindowHeight(R[n], false);
                        rect.y -= rect.height;
                        this.addWindow(this[I[n]] = new globalThis[N[n]](rect));
                    }
                }
            };
        })(Scene_Menu.prototype.create);
    
    })();