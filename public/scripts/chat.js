const input = document.querySelector('.message-input');
const sendBtn = document.querySelector('.send');
const messageArea = document.querySelector('.main');

// Bericht versturen
async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Voeg gebruikersbericht toe aan UI
  const userMsgElem = document.createElement('div');
  userMsgElem.className = 'message user';
  userMsgElem.innerHTML = `<div class="message-avatar">YOU</div><div class="message-content"><p>${userMessage}</p></div>`;
  messageArea.appendChild(userMsgElem);
  scrollToBottom();

  input.value = '';

  // Voeg placeholder voor antwoord toe
  const assistantElem = document.createElement('div');
  assistantElem.className = 'message assistant';
  assistantElem.innerHTML = '<div class="message-avatar">IQ</div><div class="message-content"><p>...</p></div>';
  const msgContent = assistantElem.querySelector('.message-content p');
  messageArea.appendChild(assistantElem);
  scrollToBottom();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!res.ok || !res.body) {
      msgContent.textContent = '⚠️ Error: Chat response failed';
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let streamText = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      streamText += decoder.decode(value, { stream: true });
      msgContent.textContent = streamText;
      scrollToBottom();
    }

  } catch (err) {
    msgContent.textContent = `{"error":"${err.message}"}`;
  }

  // Opslaan in database (optioneel)
  await fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      role: 'user',
      content: userMessage,
      user_id: 'anonymous',
    }),
  });
}

// Scroll automatisch naar onder
function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}

// EventListeners
sendBtn.addEventListener('click', sendMessage);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});