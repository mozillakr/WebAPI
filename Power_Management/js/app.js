var app = function(){
  
  return {
    /**
     * common
     */
    $: function(id){
      if(!id){
        return null;
      }
      return document.getElementById(id);
    },
    addEvent: function(id, event, callBack){
      var obj = $(id);
      if (obj.addEventListener) {
        obj.addEventListener(event, callBack, false);
      }
      else{
        obj.attachEvent('on'+event, callBack, false);
      }
    },
    changeBrightness: function(){
      var power = window.navigator.mozPower;
      var isTheScreenEnabled = power.screenEnabled
      if (isTheScreenEnabled) {
        power.screenBrightness = $('changeValue').value;
      }
      else{
        power.screenEnabled = true;
        power.screenBrightness = $('changeValue').value;
      }
    }
  } //-- return
}();

window.$ = app.$;

window.onload = function(){
  app.addEvent('changeBrightness', 'click', app.changeBrightness);
}