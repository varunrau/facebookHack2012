//Show UCLA CS class dependencies (not complete)

var maxChildren = 3;

$(document).ready(function() {
    var width = $(document).width();
    var height = $(document).height();
    var g = new Graph();

    var curUrl = "Google";
	var curTitle = "TEST";
	var childrenUrls = ["fb", "te", "c"];
	var pageTitles = ["www.facebook.com", "b", "c"];
	
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
});