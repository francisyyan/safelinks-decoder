"use strict";

function decode_urls() {
  const urldefense_prefix = /^https:\/\/urldefense\.com\/v3\/__(.+?)__;(.*?)!/;
  const safelinks_prefix = /^https:\/\/[a-z0-9]+\.safelinks\.protection\.outlook\.com\/\?url=(.+?)&/;

  var urls = document.getElementsByTagName('a');

  for (var i = 0; i < urls.length; i++) {
    const url = urls[i].innerText;

    // match URL Defense urls
    var matches = url.match(urldefense_prefix);
    if (matches && matches.length == 3) {
      // adapted from https://gist.github.com/baldwicc/3623b8eea96eb0cbbe41b1f51aeca21f
      var decode_pile = Array.from(matches[1]);
      var chars_pile = Array.from(atob(matches[2])).reverse();

      for (var match of url.matchAll(/\*/g)) {
        decode_pile[match.index] = chars_pile.pop();
      }

      urls[i].innerText = decode_pile.join('');
      continue;
    }

    // match Safe Links urls
    matches = url.match(safelinks_prefix);
    if (matches && matches.length == 2) {
      try {
        urls[i].innerText = decodeURIComponent(matches[1]);
      } catch (e) {
        console.error(e);
      }

      continue;
    }
  }
}

// run decode_urls() once the extension's icon is clicked
chrome.action.onClicked.addListener(function(tab) {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: decode_urls
  });
});
