window.addEventListener("keydown", function(event) {
	// Bind to both control (for windows/linux) and command (for mac)
	var modifier = event.ctrlKey || event.metaKey;
	/* We'll listen for Command + Alt + J */
	if (modifier && event.altKey && event.keyCode == 74) {
		chrome.extension.sendRequest({open_overlay: true}, function(response) {
			// Error checking!?!? This is a hackathon.
		});
	}
}, false);