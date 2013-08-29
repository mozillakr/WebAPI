
$(function () {
	
	jQuery("#userAgent").html(navigator.userAgent);
	jQuery("#appVersion").html(navigator.appVersion);

	// At first, let's check if we have permission for notification
	// If not, let's ask for it
	if (Notification && Notification.permission !== "granted") {
		Notification.requestPermission(function (status) {
			if (Notification.permission !== status) {
				Notification.permission = status;
			}
		});
	}

	Notification.onshow = function() {
		jQuery("#notificationEvent").html("<strong>The notification was showed.</strong>");
	};
	Notification.onclick = function() {
		jQuery("#notificationEvent").html("<strong>The notification was clicked.</strong>");
	};
	Notification.onclose = function() {
		jQuery("#notificationEvent").html("<strong>The notification was closed.</strong>");
	};


});


/**
 * navigator.mozNotification
 * deprecated
 */
function notificationTestOld() {
    var notification = navigator.mozNotification.createNotification(
        "Hey, check this out!",
        "This is a notification posted by Firefox. You should take some action. Right now!");
      
    /* watch for events on the notification */
    notification.onclick = function() {
    	jQuery("#notificationOldEvent").html("<strong>The notification was clicked.</strong>");
    };
    notification.onclose = function() {
        jQuery("#notificationOldEvent").html("<strong>The notification was closed.</strong>");
    };
      
    /* show the notification */
    notification.show();
}


/**
 * Notification
 */
function notificationTest() {

	// If the user agreed to get notified
	if (Notification && Notification.permission === "granted") {
		var n = new Notification("Hi!");
	}

	// If the user haven't tell if he want to be notified or not
	// Note: because of Chrome, we are not sure the permission property
	// is set, therefore it's unsafe to check for the "default" value.
	else if (Notification && Notification.permission !== "denied") {
		Notification.requestPermission(function (status) {
			if (Notification.permission !== status) {
				Notification.permission = status;
			}

			// If the user said okay
			if (status === "granted") {
				var n = new Notification("Hi!");
			}

			// Otherwise, we can fallback to a regular modal alert
			else {
				alert("Hi!");
			}
		});
	}

	// If the user refuse to get notified
	else {
		// We can fallback to a regular modal alert
		alert("Hi!");
	}

}

