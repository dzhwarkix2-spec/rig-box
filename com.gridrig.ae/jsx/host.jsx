/* GridRig AE 1.3. Original ExtendScript implementation. */
var GridRig = {};
#include "lib/core.jsxinc"
#include "lib/expressions.jsxinc"
#include "lib/rig.jsxinc"
(function (G) {
    G.dispatch = function (action, options) {
        try {
            if (action === "inspect") { return G.json(G.inspect()); }
            if (action === "create") { return G.json(G.create(options)); }
            if (action === "controls") { return G.json(G.controls()); }
            if (action === "remove") { return G.json(G.remove()); }
            throw new Error("Unknown action.");
        } catch (e) {
            return G.json({ok:false, message:String(e.message || e) + (e.line ? " (line " + e.line + ")" : "")});
        }
    };
}(GridRig));
