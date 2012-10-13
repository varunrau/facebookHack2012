
var pastUrls = new Array();

var historyNodes = [];
var visitItemsReady = false;
var allVisitItems = [];
var globalHistoryItems = [];
var historyItemsCurrentIndex = 0;
function sendURLtoServer(tab) {
	var serverURL = "http://blooming-falls-6379.herokuapp.com/from_links/link"; 
	var json = {
		"from_link[url]" : pastUrls[tab.index], 
		"from_link[to_link]": tab.url
		};
	//alert("sending to server");
	$.get("http://blooming-falls-6379.herokuapp.com/from_links/link", json, 
	function(data) {
		//alert(data);
	});
	
	retrieveHistoryNodesForURL(tab.url, function() {
	    var nodeURLs = [];
	    for(i in historyNodes) {
	        var node = historyNodes[i];
            nodeURLs.push(node.url);
            console.log("History node: {title: " + node.title + ", url: " + node.url + ", frequency: " + node.frequency + "}");
	    }
	    preloadResources(nodeURLs);
		});
});
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
	//alert("hello");
	if (tab.url !== undefined && tab.status == 'complete') {
		//alert("hel");
		sendURLtoServer(tab);
		
	}
});


chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    alert("key pressed request");
		chrome.tabs.getSelected(null, function(tab) {
		    chrome.tabs.sendMessage(tab.id, {greeting: "hi"}, function(response) {
            });
			chrome.tabs.executeScript(tab.id, {file: "overlay.js"});
			chrome.tabs.insertCSS(tab.id, {file: "overlay.css"});
			overlay();
		});
});
/*
chrome.browserAction.onClicked.addListener(function(tab) {
    alert("button clicked");
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.executeScript(tab.id, {file : "overlay.js"});
        chrome.tabs.insertCSS(tab.id, {file : "overlay.css"});
    }
    };
    */
