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

    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let streamText = '';
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        streamText += decoder.decode(value);
        msgContent.textContent = streamText;
    }
});
