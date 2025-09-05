chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  if (request.action === 'startSelection') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'startSelection' });
    });
  } else if (request.action === 'stopSelection') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'stopSelection' });
    });
  } else if (request.action === 'selectionStopped') {
    chrome.runtime.sendMessage(request).catch(() => {
      // Ignore errors if popup is not open
    });
  }
  
  sendResponse({ status: 'ok' });
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});