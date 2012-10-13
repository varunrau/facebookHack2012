/*
 * Given a URL, constructs the history nodes for that URL and returns
 * them in a sorted list.
 */
function retrieveHistoryNodesForURL(targetURL) {
  // To look for history items visited in the last week,
  // subtract a week of microseconds from the current time.
  var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

  var historyNodes = [];
  //var targetURL = "http://www.google.com/";
  var timeStamp = 0;
  var URLfrequencies = [];
  var URLtitles = [];
  var timeWindow = 10000; // Time window in milliseconds

  chrome.history.search({
      'text': '',              // Return every history item....
      'startTime': oneWeekAgo  // that was accessed less than one week ago.
    },
    function(historyItems) {
      // For each history item, get details on all visits.
      var targetVisitItems = [];
      var allVisitItems = [];
      for (var i = 0; i < historyItems.length; ++i) {
        var url = historyItems[i].url
        if (url != targetURL) {
          URLtitles[url] = historyItems[i].title;
          chrome.history.getVisits({
              'url': url
            },
            function(visitItems) {
              allVisitItems[url] = visitItems;
            }
          );
        }
        else {
          chrome.history.getVisits({
              'url': targetURL
            },
            function(visitItems) {
              targetVisitItems = visitItems;
            }
          );
        }
      }
      for (targetVisitItem in targetVisitItems) {
        var targetTimeStamp = targetVisitItem.visitTime;
        for (url in allVisitItems) {
          var visitItems = allVisitItems[url];
          for (item in visitItems) {
            var timeStamp = visitItem.visitTime;
            if(timeStamp <= targetTimeStamp + timeWindow && timeStamp >= targetTimeStamp) {
              if(!URLfrequencies[url]) {
                URLfrequencies[url] = 0;
              }
              URLfrequencies[url]++;
            }
          }
        }
      }
      for (url in URLtitles) {
        historyNodes.push({url: url, title: URLtitles[url], frequency: URLfrequencies[url]});
      }
      historyNodes.sort(function(a, b) {
        return b.frequency - a.frequency;
      }

      return historyNodes;
    }
  );
}

