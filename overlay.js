chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    alert("received message");
    if (request.greeting == "hi") {
        overlay();
    }
});

var overlay = function() {
alert("hellow");
$('body').prepend('<div id="boxes">');

$('body').prepend('<div id="dialog" class="window">
<a href="#"class="close"/>Close it</a>
</div>');

$('body').prepend('<div id="mask"></div></div>');

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
    var url = chrome.extension.getURL('classes.html');
    window.popUpWindow = window.open(url, "Bwser Hack", true);
}
