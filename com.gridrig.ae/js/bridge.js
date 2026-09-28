/* Minimal original wrapper for CEP's injected native bridge. No Node or remote dependencies. */
(function (w) {
  'use strict';
  var pending = false;
  w.GridRigBridge = {
    available: function () { return !!(w.__adobe_cep__ && w.__adobe_cep__.evalScript); },
    call: function (action, options, callback) {
      if (!this.available()) { callback({ok:false, message:'Open this panel inside After Effects.'}); return; }
      if (pending) { callback({ok:false, message:'Please wait for the current action to finish.'}); return; }
      pending = true;
      var code = 'GridRig.dispatch(' + JSON.stringify(action) + ',' + JSON.stringify(options || {}) + ')';
      try {
        w.__adobe_cep__.evalScript(code, function (raw) {
          pending = false;
          var result;
          try { result=JSON.parse(raw); }
          catch (e) { result={ok:false, message:'Could not read the AE response. Reopen the panel. Details: ' + String(raw).slice(0,240)}; }
          callback(result);
        });
      } catch (e) { pending = false; callback({ok:false, message:e.message}); }
    }
  };
}(window));
