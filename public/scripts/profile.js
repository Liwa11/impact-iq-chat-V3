// Constanten voor gebruikersdata
const DEFAULT_USER = {
    name: "Ouaïl Bouakka",
    email: "ouail@example.com"
};

// Helper functie voor initialen
function getInitials(fullName) {
    if (!fullName) return 'JS'; // Fallback
    return fullName
        .split(" ")
        .map(n => n[0].toUpperCase())
        .join("");
}

// Wacht tot DOM geladen is
document.addEventListener('DOMContentLoaded', () => {
    // DOM elementen
    const form = document.getElementById('profile-form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const logoutButton = document.querySelector('.logout-button');

    // Laad opgeslagen gebruikersdata
    const savedUser = JSON.parse(localStorage.getItem('userData')) || DEFAULT_USER;

    // Vul formulier met data
    if (usernameInput && emailInput) {
        usernameInput.value = savedUser.name;
        emailInput.value = savedUser.email;
    }

    // Form submission handler
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const updatedUser = {
                name: usernameInput.value.trim(),
                email: emailInput.value.trim()
            };

            // Validatie
            if (!updatedUser.name || !updatedUser.email) {
                alert('Vul alle velden in');
                return;
            }

            // Opslaan in localStorage
            localStorage.setItem('userData', JSON.stringify(updatedUser));
            alert('Profiel succesvol opgeslagen!');
        });
    }

    // Logout handler
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            if (confirm('Weet je zeker dat je wilt uitloggen?')) {
                localStorage.removeItem('userData');
                window.location.href = '/';
            }
        });
    }
});

// Exporteer functies en data voor gebruik in andere scripts
window.getInitials = getInitials;
window.DEFAULT_USER = DEFAULT_USER; 