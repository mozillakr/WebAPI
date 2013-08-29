var app = function() {
  var power = window.navigator.mozPower;
  var lock;
  var screenTimeout;
  return {
    /**
     * common
     */
    $ : function(id) {
      if (!id) {
        return null;
      }
      return document.getElementById(id);
    },
    addEvent : function(id, event, callBack) {
      var obj = $(id);
      if (obj.addEventListener) {
        obj.addEventListener(event, callBack, false);
      }
      else {
        obj.attachEvent('on' + event, callBack, false);
      }
    },
    changeBrightness : function() {

      var isTheScreenEnabled = power.screenEnabled
      if (isTheScreenEnabled) {
        power.screenBrightness = $('changeValue').value;
      }
      else {
        power.screenEnabled = true;
        power.screenBrightness = $('changeValue').value;
      }
    },
    reboot : function() {
      power.reboot();
    },
    powerOff : function() {
      power.powerOff();
    },
    wakeLock : function() {
      lock = window.navigator.requestWakeLock('screen');
    },
    unlock : function() {
      lock.unlock();
    }
  } // -- return
}();

window.$ = app.$;

window.onload = function() {
  app.addEvent('changeBrightness', 'click', app.changeBrightness);
  app.addEvent('reboot', 'click', app.reboot);
  app.addEvent('powerOff', 'click', app.powerOff);
  app.addEvent('wakeLock', 'click', app.wakeLock);
  app.addEvent('unlock', 'click', app.unlock);

  navigator.mozPower.addWakeLockListener(function(name, stat) {
    var message = "The lock state for the resource '" + name + "' is: <b>"
        + stat + '</b>';
    $('message').innerHTML = message;
    console.log(message);
  });

}
