document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('capturedText', (data) => {
    const output = document.getElementById('output');
    output.value = data.capturedText || 'No text captured.';
  });

  document.getElementById('copy').addEventListener('click', async () => {
    const text = document.getElementById('output').value;
    await navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  });
});
