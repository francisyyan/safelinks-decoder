// run function 'convert_safelinks' once the extension's icon is clicked
chrome.action.onClicked.addListener(function(tab) {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: convert_safelinks
  });
});

function convert_safelinks() {
  const safelinks_prefix = /^https:\/\/[a-z0-9]+\.safelinks\.protection\.outlook\.com\/\?url=(.+?)&amp;/;

  var urls = document.getElementsByTagName('a');

  for (var i = 0; i < urls.length; i++) {
    // only convert the URLs that appear as Safe Links
    const url = urls[i].innerText;

    const result = url.match(safelinks_prefix);
    if (result === null || result.length !== 2) {
      continue;
    }

    try {
      const decoded_url = decodeURIComponent(result[1]);
      urls[i].innerText = decoded_url;
    } catch (e) {
      console.error(e);
    }
  }
}
