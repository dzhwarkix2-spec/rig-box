(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var busy = false, ready = false;
  var fields = ['padding','stroke','color','live','horizontal','vertical'];
  var defaults = {padding:16,stroke:1,color:'#c4c4c4',live:true,horizontal:40,vertical:40};
  function status(message, type) { $('status').textContent = message; $('status').className = 'status ' + (type || ''); }
  function lock(value) {
    busy = value;
    ['create','controls','remove','refresh'].forEach(function (id) { $(id).disabled = value || !ready; });
    $('create').textContent = value ? 'Working…' : 'Create Rig';
  }
  function settings() {
    var o = {};
    fields.forEach(function (id) { var el=$(id); o[id] = el.type === 'checkbox' ? el.checked : el.type === 'number' ? Number(el.value) : el.value; });
    return o;
  }
  function put(o) { fields.forEach(function (id) { if (Object.prototype.hasOwnProperty.call(o,id)) { var el=$(id); if(el.type==='checkbox') el.checked=!!o[id]; else el.value=o[id]; } }); }
  function save() { try { localStorage.setItem('gridrig-shortguides-v13',JSON.stringify(settings())); } catch(e) {} }
  function call(action, options, done) {
    if(busy) return;
    lock(true);
    GridRigBridge.call(action,options,function(r){lock(false);if(done)done(r);});
  }
  function refresh() {
    if(busy || !ready) return;
    call('inspect',{},function(r){
      $('target').textContent=r.ok ? r.label : r.message;
      $('target').title=$('target').textContent;
      $('dot').className='dot'+(r.ok && r.selected ? ' ready':'');
    });
  }
  $('rig-form').addEventListener('submit',function(e){
    e.preventDefault(); if(busy) return;
    var o=settings();
    save();
    call('create',o,function(r){status(r.message,r.ok?'success':'error');if(r.ok)refresh();});
  });
  $('controls').addEventListener('click',function(){call('controls',{},function(r){status(r.message,r.ok?'success':'error');});});
  $('remove').addEventListener('click',function(){call('remove',{},function(r){status(r.message,r.ok?'success':'error');if(r.ok)refresh();});});
  $('refresh').addEventListener('click',refresh);
  $('defaults').addEventListener('click',function(){put(defaults);save();status('Setup reset. Existing rigs are unchanged.');});
  $('help-toggle').addEventListener('click',function(){var open=$('help').hidden;$('help').hidden=!open;this.setAttribute('aria-expanded',String(open));});
  fields.forEach(function(id){$(id).addEventListener('change',save);});
  try { var stored=JSON.parse(localStorage.getItem('gridrig-shortguides-v13')); if(stored)put(stored); } catch(e) {}
  ready=GridRigBridge.available();lock(false);
  if(ready){refresh();window.addEventListener('focus',function(){window.setTimeout(refresh,200);});}
  else{$('target').textContent='Panel preview';status('Install and open from Window → Extensions → GridRig AE.');}
}());
