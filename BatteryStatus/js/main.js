var battery;

var batteryCanvas;
var context;

var battery_width = 100;
var battery_height = 200;

$(function () {
	battery = navigator.battery || navigator.mozBattery || navigator.webkitBattery;
  
	batteryCanvas = jQuery("#batteryCanvas")[0];

	context = batteryCanvas.getContext("2d");

	battery.addEventListener("chargingchange", updateBatteryStatus);
	battery.addEventListener("levelchange", updateBatteryStatus);

	updateBatteryStatus();

	drawBattery();
});

function drawBattery() {
	context.fillStyle = "#000";
	context.fillRect(0, 0, battery_width, battery_height);

	context.fillStyle = "#ccc";
	context.fillRect(3, 3 + (battery_height-6) - (battery_height-6) * battery.level,
					battery_width-6, (battery_height-6) * battery.level);

}

function updateBatteryStatus() {
	jQuery("#batteryStatus").html("Battery status: " + battery.level * 100 + " %");

	if (battery.charging) {
		jQuery("#batteryStatus2").html("Battery is charging"); 
	} else {
		jQuery("#batteryStatus2").html("Battery is not charging"); 
	}

	drawBattery();
}

