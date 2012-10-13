
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
	    // Current url
	    
		chrome.tabs.getSelected(null, function(tab) {
		    graph(tab.url, nodeURLs);
        });
});
    };


window.addEventListener("keydown", function(event) {
	// Bind to both control (for windows/linux) and command (for mac)
	var modifier = event.ctrlKey || event.metaKey;
	/* We'll listen for Command + Alt + J */
	if (modifier || event.altKey || event.keyCode == 75) {
	    console.log("key pressed");
	    overlay();
	    chrome.extension.sendMessage({data: "hello"}, function(response) {
	        console.log(response.farewell);
        });
	}
}, false);


var overlay = function() {
    /*
$('body').prepend('<div id=\"boxes\">');

$('body').prepend('<div id=\"dialog\" class=\"window\">
<a href="#"class="close"/>Close it</a>
</div>');

$('body').prepend('<div id=\"mask\"></div></div>');

$('#mask').fadeIn(1000);
$('#mask').fadeTo("slow", 0.8);

$(id).fadeIn(2000);

$('#mask').click(function() {
	$(this).hide();
	$('.window').hide();
});

$(window).resize(function() {
	var box = $('#boxes .window');
	//Get the screen height and width
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
  
    //Set height and width to mask to fill up the whole screen
    $('#mask').css({'width':maskWidth,'height':maskHeight});
           
    //Get the window height and width
    var winH = $(window).height();
    var winW = $(window).width();

    //Set the popup window to center
    box.css('top',  winH/2 - box.height()/2);
    box.css('left', winW/2 - box.width()/2);
});

    alert("OVErLAY");
    */
    var url = chrome.extension.getURL('classes.html');
    window.popUpWindow = window.open(url, "Browser Hack", true);
}


// The stuff that was in classes.js will go here...


//Show UCLA CS class dependencies (not complete)

var maxChildren = 3;

var graph = function(curUrl, childrenUrls) {
    var width = $(document).width();
    var height = $(document).height();
    var g = new Graph();

	//var curTitle = "TEST";
	//var childrenUrls = ["fb", "te", "c"];
	//var pageTitles = ["www.facebook.com", "b", "c"];
	
	for (i = 0; i < childrenUrls.length && i < maxChildren; i++) {
		g.addEdge(curUrl, childrenUrls[i]);
	}
	
	alert("i");
	var counter = 0;
	for (i in g.nodes) {
		g.nodes[i].url = childrenUrls[counter];//addUrl(childrenUrls[counter]);
		counter++;
	}
	
	
	
    var layouter = new Graph.Layout.Ordered(g, topological_sort(g));
    var renderer = new Graph.Renderer.Raphael('canvas', g, width - width/2, height - height/2);
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
