// alarmObj = { id, date, respectTimezone, data }
navigator.mozSetMessageHandler("alarm", function (alarmObj) { 
  var protocol = window.location.protocol;
  var host = window.location.host;
  window.open(protocol + '//' + host + '/alarm.html', 'ring_screen', 'attention');
});

var alarmApi = {
  get data(){
    delete this.data;
    return {
      alarmMsg : "alarm~"
    };
  },
  get popMsg() {
    delete this.popMsg;
    return this.popMsg = document.getElementById('popMsg');
  },
  get inpTime() {
    delete this.inpTime;
    return this.inpTime = document.getElementById('inpTime');
  },
  get btnSetAlarm() {
    delete this.btnSetAlarm;
    return this.btnSetAlarm = document.getElementById('btnSetAlarm');
  },
  get alarmList() {
    delete this.alarmList;
    return this.alarmList = document.getElementById('alarmList');
  },
  debug : function(msg, delay) {
    delay = delay || 1000;
    var that = this;
    this.popMsg.style.display = 'block';
    this.popMsg.innerHTML = msg;
    setTimeout( function() {
      that.popMsg.style.display = 'none';
    }, delay );
  },
  setAlarm : function() {
    var that = this;
    var dateArr = this.inpTime.value.split(':');
    var alarmDate = new Date();
    alarmDate.setHours(dateArr[0]);
    alarmDate.setMinutes(dateArr[1]);
    alarmDate.setSeconds(0);
    var request = navigator.mozAlarms.add(alarmDate, "ignoreTimezone", this.data);
    
    request.onsuccess = function () {
      that.printAlarmList();
      that.debug( '알람이 설정 되었습니다.' );
    };

    request.onerror = function () { 
      that.debug( '오류 : ' + this.error.name );
    };

    this.inpTime.value = '';
  },
  removeAlarm : function(evt) {
    var el = evt.target;
    var that = this;
    var alarmId = el.id.split('_')[1];
    if( confirm('삭제 하시겠습니까?') ) {
      navigator.mozAlarms.remove(alarmId);
      that.printAlarmList();
    }
  },
  printAlarmList : function() {
    var request = navigator.mozAlarms.getAll();
    var self = this;
    
    request.onsuccess = function () {
      var html = [];
      this.result.forEach(function (alarm) {
        html.push('<li id="alarm_'+ alarm.id +'">');
        html.push('Id: ' + alarm.id);
        html.push(', date: ' + alarm.date);        
        html.push('</li>');
      });

      if( html.length == 0 ) {
        html.push('<li>등록된 알람이 없습니다.</li>');
      }
      self.alarmList.innerHTML = html.join('');
    };

    request.onerror = function () { 
      self.debug( '오류 : ' + this.error.name );
    };
  },
  init : function() {
    this.printAlarmList();
    this.btnSetAlarm.addEventListener('click', this.setAlarm.bind(this) );
    this.alarmList.addEventListener('click', this.removeAlarm.bind(this) );
  }
}

window.addEventListener('load', function alarmApiInit(event) {
  window.removeEventListener('load', alarmApiInit);
  alarmApi.init();
});
