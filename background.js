chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes('perplexity.ai')) {
    chrome.tabs.sendMessage(tab.id, { action: 'extractConversation' }, (response) => {
      if (response && response.conversations) {
        chrome.storage.local.set({ conversations: response.conversations }, () => {
          chrome.runtime.openOptionsPage();
        });
      }
    });
  }
});
