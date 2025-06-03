document.getElementById('start').addEventListener('click', () => {
  const btn = document.getElementById('start');
  btn.disabled = true;
  document.getElementById('status').textContent = 'Capturing...';
  chrome.runtime.sendMessage({ action: 'start-scrolling' }, () => {
    document.getElementById('status').textContent = 'Working...';
  });
});
