chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'start-scrolling') {
    scrollAndCapture();
  }
});

async function scrollAndCapture() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) {
    console.error('No active tab');
    return;
  }

  const results = [];
  let lastHeight = 0;
  while (true) {
    const newText = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        return Array.from(document.body.querySelectorAll('*'))
          .filter(el => el.innerText && el.offsetParent !== null)
          .map(el => el.innerText)
          .join('\n');
      }
    });
    results.push(newText[0].result);

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.scrollBy(0, window.innerHeight)
    });

    await new Promise(r => setTimeout(r, 1000));

    const currHeight = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.scrollHeight
    });

    if (currHeight[0].result === lastHeight) {
      break;
    }
    lastHeight = currHeight[0].result;
  }

  const finalText = results.join('\n');
  chrome.storage.local.set({ capturedText: finalText }, () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('results.html') });
  });
}
