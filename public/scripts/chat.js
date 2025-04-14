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

document.addEventListener('DOMContentLoaded', () => {
    // Bestaande chat.js code behouden...

    // Profielknop functionaliteit
    const profileButton = document.querySelector('.profile-button');
    if (profileButton) {
        // Update initialen
        const userData = JSON.parse(localStorage.getItem('userData')) || window.DEFAULT_USER;
        profileButton.textContent = getInitials(userData.name);
        
        // Click handler
        profileButton.addEventListener('click', () => {
            window.location.href = '/profile.html';
        });
    }

    // New Chat button
    const newChatBtn = document.querySelector('.new-chat-btn');
    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            const chat = window.chatManager.createNewChat();
            updateChatList();
            clearChatWindow();
        });
    }

    // Chat list functionality
    function updateChatList() {
        const chatHistory = document.querySelector('.chat-history');
        if (!chatHistory) return;

        chatHistory.innerHTML = window.chatManager.chats
            .map(chat => `
                <div class="chat-item" data-chat-id="${chat.id}">
                    <div class="chat-icon">${chat.title[0]}</div>
                    <div class="chat-info">
                        <div class="chat-title">${chat.title}</div>
                        <div class="chat-date">${new Date(chat.timestamp).toLocaleDateString()}</div>
                    </div>
                </div>
            `).join('');

        // Add click handlers
        document.querySelectorAll('.chat-item').forEach(item => {
            item.addEventListener('click', () => {
                const chatId = item.dataset.chatId;
                loadChat(chatId);
            });
        });
    }

    // File upload
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    const attachBtn = document.querySelector('.attach');
    if (attachBtn) {
        attachBtn.addEventListener('click', () => {
            fileInput.click();
        });
    }

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            alert(`Bestand geselecteerd: ${file.name}`);
            // Later: upload via Supabase
        }
    });

    // Speech-to-text
    const micBtn = document.querySelector('.option-btn');
    const messageInput = document.querySelector('.message-input');

    if (micBtn && 'webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'nl-NL';
        recognition.continuous = false;
        recognition.interimResults = false;

        micBtn.addEventListener('click', () => {
            recognition.start();
            micBtn.style.color = 'red';
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            messageInput.value = transcript;
            micBtn.style.color = '';
        };

        recognition.onend = () => {
            micBtn.style.color = '';
        };
    }

    // Initialize
    updateChatList();
});

// Helper functions
function clearChatWindow() {
    const main = document.querySelector('.main');
    if (main) {
        main.innerHTML = `
            <div class="welcome-section">
                <h2 class="welcome-title">Nieuwe Chat</h2>
                <p class="welcome-subtitle">Start een nieuw gesprek met Impact IQ...</p>
            </div>
        `;
    }
}

function loadChat(chatId) {
    const chat = window.chatManager.loadChat(chatId);
    if (chat) {
        // Later: implement chat loading
        console.log('Loading chat:', chat);
    }
}