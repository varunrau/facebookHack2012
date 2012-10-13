alert("loaded");

var pastUrls = new Array();

function sendURLtoServer(tab) {
	var serverURL = "http://blooming-falls-6379.herokuapp.com/from_links/link"; 
	//var http = new XMLHttpRequest();
	
	//http.open("PUT", serverURL, true);
	var json = {
		"from_link[url]" : pastUrls[tab.index], 
		"from_link[to_link]": tab.url
		};
	alert("sending to server");
	$.get("http://blooming-falls-6379.herokuapp.com/from_links/link", json, 
	function(data) {
		alert(data);
	});
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

chrome.tabs.onRemoved.addListener(function(tab) {
	var curIndex = tab.index;
	pastUrls.splice(curIndex, curIndex + 1);
});

chrome.tabs.onUpdated.addListener(function(integer, changeInfo, tab) {
	console.write("updated");
	alert("hello");
	if (tab.url !== undefined && tab.status == 'complete') {
		alert("hel");
		sendURLtoServer(tab);
	}
});
