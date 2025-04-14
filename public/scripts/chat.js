const input = document.querySelector('.message-input');
const sendButton = document.querySelector('.send');
const messageArea = document.querySelector('.main');

// Verzenden bij klik op knop
sendButton.addEventListener('click', sendMessage);

// Verzenden bij Enter (zonder Shift)
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Automatische hoogte aanpassen (max 5 regels)
input.addEventListener('input', () => {
  input.style.height = 'auto'; // reset hoogte
  const maxHeight = 5 * 24; // 5 regels x ~24px regelhoogte
  input.style.height = Math.min(input.scrollHeight, maxHeight) + 'px';
});

async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Gebruikerstekst toevoegen
  const userMsgElem = document.createElement('div');
  userMsgElem.className = 'message user';
  userMsgElem.innerHTML = `<div class="message-avatar">YOU</div><div class="message-content"><p>${userMessage}</p></div>`;
  messageArea.appendChild(userMsgElem);

  input.value = '';
  input.style.height = 'auto'; // reset hoogte na verzenden

  // AI placeholder
  const assistantElem = document.createElement('div');
  assistantElem.className = 'message assistant';
  assistantElem.innerHTML = '<div class="message-avatar">IQ</div><div class="message-content"><p>...</p></div>';
  const msgContent = assistantElem.querySelector('.message-content p');
  messageArea.appendChild(assistantElem);

  // Scroll naar nieuwste bericht
  messageArea.scrollTop = messageArea.scrollHeight;

  // Chat response ophalen
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: userMessage }]
    })
  });

  // Opslaan blijft hetzelfde
  await fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      role: 'user',
      content: userMessage,
      user_id: 'anonymous',
    }),
  });

  // Respons tonen
  const data = await res.json();
  const answer = data.choices?.[0]?.message?.content || 'No response';
  msgContent.textContent = answer;

  // Scroll naar onder na antwoord
  messageArea.scrollTop = messageArea.scrollHeight;
}