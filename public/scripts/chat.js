document.querySelector('.send').addEventListener('click', async () => {
  const input = document.querySelector('.message-input');
  const userMessage = input.value.trim();
  if (!userMessage) return;

  const messageArea = document.querySelector('.main');
  const userMsgElem = document.createElement('div');
  userMsgElem.className = 'message user';
  userMsgElem.innerHTML = `<div class="message-avatar">YOU</div><div class="message-content"><p>${userMessage}</p></div>`;
  messageArea.appendChild(userMsgElem);

  input.value = '';
  
  const assistantElem = document.createElement('div');
  assistantElem.className = 'message assistant';
  assistantElem.innerHTML = '<div class="message-avatar">IQ</div><div class="message-content"><p>...</p></div>';
  const msgContent = assistantElem.querySelector('.message-content p');
  messageArea.appendChild(assistantElem);

  // FIXED FETCH naar correcte API input
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

  // Stream reader om AI-respons op te bouwen
  const data = await res.json();
const answer = data.choices?.[0]?.message?.content || 'No response';
msgContent.textContent = answer;
});
