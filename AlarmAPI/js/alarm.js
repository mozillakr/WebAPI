var alarmPage = {
  vibrateInterval : null,
  get debugMsg() {
    delete this.debugMsg;
    return this.debugMsg = document.getElementById('debugMsg');
  },
  get closeButton() {
    delete this.closeButton;
    return this.closeButton = document.getElementById('btnClose');
  },
  handleEvent : function(event) {
    switch(event.type) {
      case 'click':
        var el = event.target;
        switch(el) {
          case this.closeButton:    
            window.clearInterval(this.vibrateInterval);
            window.close();
          break;
        }
        break;
    }
  },  
  debug : function(msg) {
    this.debugMsg.innerHTML = ( msg || '' ) + '<br />' + this.debugMsg.innerHTML;
  },  
  vibrate : function rv_vibrate() {
    if ('vibrate' in navigator) {
      this.vibrateInterval = window.setInterval(function vibrate() {
        navigator.vibrate([200, 100, 100, 100, 200, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]);
      }, 3000);
      var duration = 60000 * 1;
      window.setTimeout(function clearVibrate() {
        window.clearInterval(this.vibrateInterval);
      }, duration);
    }
  },
  init : function() {
    this.closeButton.addEventListener('click', this);
    this.vibrate();
  }  
}
window.addEventListener('load', function alarmInit() {
  window.removeEventListener('load', alarmInit);
  alarmPage.init();
});