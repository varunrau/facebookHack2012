function sendURLtoServer(url) {
	var serverURL = "http://blooming-falls-6379.herokuapp.com/"; 
	var http = new XMLHttpRequest();
	http.open("PUT", serverURL, true);
	http.send(url);
	http.onreadystatechange = function() {
		if(http.readyState == 4) {
			alert("sent correctly");
		}
	}
	
};

/* 
 * Accepts an array of urls and regex's through them to find stylesheets and
 * images to preload.
 */ 
function preloadResources(urls) {
	var request = new XMLHttpRequest();
	for (i=0; i<urls.length; i++) {
		request.open("GET", urls[i], true);
		request.send(null);	
	}
}

// Event Listener for new tabs
// chrome.tabs.onCreated.addListener(function() {
//     alert("entered Lisenter");
// 	sendURLtoServer(tab.url);
// 	alert("ended listener");
// });

chrome.tabs.onUpdated.addListener(function(integer, changeInfo, tab) {
	if (tab.status == 'complete') {
		sendURLtoServer(tab.url);
	}
});
