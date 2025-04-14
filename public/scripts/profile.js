document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('profile-form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');

    // Vul formulier met bestaande data
    usernameInput.value = window.userData.name;
    emailInput.value = window.userData.email;

    // Handle form submission
    form.addEventListener('submit', 