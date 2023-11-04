let data = [];
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'get_data') {
    sendResponse(data);
  } else if (request.message === 'set_data') {
    data = request.data;
  }
});