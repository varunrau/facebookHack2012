/// $waitUntil
///     waits until a certain function returns true and then executes a code. checks the function periodically
/// parameters
///     check - a function that should return false or true
///     onComplete - a function to execute when the check function returns true
///     delay - time in milliseconds, specifies the time period between each check. default value is 100
///     timeout - time in milliseconds, specifies how long to wait and check the check function before giving up
function $waitUntil(check,onComplete,delay,timeout) {
  // if the check returns true, execute onComplete immediately
  if (check()) {
  //console.log(check);
  //console.log(onComplete);
    onComplete();
    return;
  }
  if (!delay) delay=100;
  var timeoutPointer;
  var intervalPointer=setInterval(function () {
    if (!check()) return; // if check didn't return true, means we need another check in the next interval
    // if the check returned true, means we're done here. clear the interval and the timeout and execute onComplete
    clearInterval(intervalPointer);
    if (timeoutPointer) clearTimeout(timeoutPointer);
      onComplete();
  },delay);
  // if after timeout milliseconds function doesn't return true, abort
  if (timeout) timeoutPointer=setTimeout(function () {
    clearInterval(intervalPointer);
  },timeout);
}

$(document).ready(function() {
  retrieveHistoryNodesForURL("http://www.google.com/", function() {
    var ul = document.getElementById('org');
    var li = document.createElement('li');
    li.appendChild(document.createTextNode("http://www.google.com/"));
    var childul = document.createElement('ul');
    li.appendChild(childul);
    ul.appendChild(li);
    console.log(historyNodes.length);
    for (var i = 0; i < 3; i++) {
      var node = historyNodes[i];
      if (node.frequency > 0) {
        var a = document.createElement('a');
        var childli = document.createElement('li');
        a.href = node.url;
        a.appendChild(document.createTextNode(node.title));
        childli.appendChild(a);
        childul.appendChild(childli);
      }
    }
    $('#org').jOrgChart();
  });
  /*retrieveHistoryNodesForURL("http://www.google.com/", function() {
    for(index in historyNodes) {
      var node = historyNodes[index];
      console.log("History node: {title: " + node.title + ", url: " + node.url + ", frequency: " + node.frequency);
    }
  });*/
});

var historyNodes = [];
var visitItemsReady = false;
var allVisitItems = [];
var globalHistoryItems = [];
var historyItemsCurrentIndex = 0;
/*
 * Given a URL, constructs the history nodes for that URL and returns
 * them in a sorted list.
 */
function retrieveHistoryNodesForURL(targetURL, onComplete) {
  // To look for history items visited in the last week,
  // subtract a week of microseconds from the current time.
  var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

  var timeStamp = 0;
  var timeWindow = 1000 * 100; // Time window in milliseconds
  var URLtitles = [];
  var URLfrequencies = [];
  var numURLtitles = 0;
  var numAllVisitItems = 0;
  var historyNodesReady = false;
  var targetVisitItemsReady = false;

  chrome.history.search({
      'text': '',              // Return every history item....
      'startTime': oneWeekAgo  // that was accessed less than one week ago.
    },
    function(historyItems) {
      globalHistoryItems = historyItems;
      var targetVisitItems = [];
      
      for (i in globalHistoryItems) { 
        url = globalHistoryItems[i].url;
        URLtitles[url] = globalHistoryItems[i].title;
      }

      chrome.history.getVisits({
          'url': targetURL
        },
        function(visitItems) {
          targetVisitItems = visitItems;
          targetVisitItemsReady = true;
        }
      );
      $waitUntil(
        function() {
          return targetVisitItemsReady == true;
        },
        recursiveVisitItemRetrievalWrapper
      );
      $waitUntil(
        function() {
          return visitItemsReady == true;
        },
        function() {
          for (targetVisitItem in targetVisitItems) {
            var targetTimeStamp = targetVisitItems[targetVisitItem].visitTime;
            for (url in allVisitItems) {
              var visitItems = allVisitItems[url];
              for (item in visitItems) {
                var timeStamp = visitItems[item].visitTime;
                if(!URLfrequencies[url])
                  URLfrequencies[url] = 0;
                if(timeStamp <= targetTimeStamp + timeWindow && timeStamp >= targetTimeStamp)
                  URLfrequencies[url]++; 
              }
            }
          }
          for (url in URLfrequencies) {
            //console.log("Url: " + url + " has frequency " + URLfrequencies[url]);
          }
          for (url in URLtitles) {
            //console.log("History node: {title: " + URLtitles[url] + ", url: " + url + ", frequency: " + URLfrequencies[url] + "}");
            var historyNode = {url: url, title: URLtitles[url], frequency: URLfrequencies[url]};
            //console.log(historyNode);
            historyNodes.push(historyNode);
          }
          historyNodes.sort(function(a, b) {
            return b.frequency - a.frequency;
          });
          historyNodesReady = true;
        }
      )
    }
  );
  $waitUntil(
    function() {
      return historyNodesReady == true;
    },
    onComplete
  );
}

function recursiveVisitItemRetrievalWrapper() {
  recursiveVisitItemRetrieval(historyItemsCurrentIndex);
}

function recursiveVisitItemRetrieval(i) {
  if (i == globalHistoryItems.length) {
    visitItemsReady = true;
    return;
  }
  var iterationComplete = false;
  var url = globalHistoryItems[i].url
  historyItemsCurrentIndex++;
  chrome.history.getVisits({
      'url': url
    },
    function(visitItems) {
      allVisitItems[url] = visitItems;
      iterationComplete = true;
    }
  );
  $waitUntil(
    function() {
      return iterationComplete == true;
    },
    recursiveVisitItemRetrievalWrapper
  );
}
