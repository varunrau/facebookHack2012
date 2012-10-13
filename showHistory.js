// Event Listener for new tabs
chrome.tabs.onCreated.addListener(function(tab) {
	sendURLtoServer(tab.url);
});

chrome.tabs.onUpdated.addListener(function(integer, changeInfo, tab) {
	sendUrltoServer(tab.url);
});



var sendURLtoServer = function(url) {
	var serverURL = "REQUEST URL";
	var http = getXMLHttpRequestObject();
	http.open("PUT", serverURL, true);
	http.onreadystatechange = function() {
		if(http.readyState == 4) {
			alert("sent correctly");
		}
	}
	http.sent(url);
};