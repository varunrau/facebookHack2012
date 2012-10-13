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
	var childrenUrls = ["fb", "te", "c"];
	//var pageTitles = ["www.facebook.com", "b", "c"];
	
	for (i = 0; i < childrenUrls.length && i < maxChildren; i++) {
		g.addEdge(curUrl, pageTitles[i]);
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
