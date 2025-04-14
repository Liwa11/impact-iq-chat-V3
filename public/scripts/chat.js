function sendMessage() {
  const input = document.querySelector('.message-input');
  const userMessage = input.value.trim();
  if (!userMessage) return;

  const messageArea = document.querySelector('.main');

  // Toon gebruikersbericht
  const userMsgElem = document.createElement('div');
  userMsgElem.className = 'message user';
  userMsgElem.innerHTML = `
      <div class="message-avatar">YOU</div>
      <div class="message-content"><p>${userMessage}</p></div>`;
  messageArea.appendChild(userMsgElem);
  userMsgElem.scrollIntoView({ behavior: 'smooth' });

  input.value = '';

  // Toon assistant placeholder
  const assistantElem = document.createElement('div');
  assistantElem.className = 'message assistant';
  assistantElem.innerHTML = `
      <div class="message-avatar">IQ</div>
      <div class="message-content"><p>...</p></div>`;
  const msgContent = assistantElem.querySelector('.message-content p');
  messageArea.appendChild(assistantElem);
  assistantElem.scrollIntoView({ behavior: 'smooth' });

  // Verstuur bericht naar /api/chat
  fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
  })
  .then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamText = '';

      while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          streamText += decoder.decode(value, { stream: true });
          msgContent.textContent = streamText;
          msgContent.scrollIntoView({ behavior: 'smooth' });
      }
  })
  .catch(error => {
      msgContent.textContent = 'Er is een fout opgetreden.';
      console.error(error);
  });

  // Opslaan van bericht
  fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          role: 'user',
          content: userMessage,
          user_id: 'anonymous',
      })
  });
}

// Click op verzendknop
document.querySelector('.send').addEventListener('click', sendMessage);

// Enter verzendt bericht
document.querySelector('.message-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
  }
});
