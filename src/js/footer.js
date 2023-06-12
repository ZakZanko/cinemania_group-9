const footerLink = document.querySelector('.footer__link');
const modalCloseButton = document.querySelector('[data-modal-close]');
const modalBackdrop = document.querySelector('.footer__backdrop');

// Функція для відкриття модального вікна
function openModal() {
    modalBackdrop.classList.remove('is-hidden');
    footerLink.style.cursor = "not-allowed";
}

// Функція для закриття модального вікна
function closeModal() {
    modalBackdrop.classList.add('is-hidden');
    footerLink.style.cursor = "pointer";
}

// Додаємо обробники подій для відкриття і закриття модального вікна
footerLink.addEventListener('click', openModal);
modalCloseButton.addEventListener('click', closeModal);

// function removeListeners() {
//     footerLink.removeEventListener('click', openModal);
//     modalCloseButton.removeEventListener('click', closeModal);
//     document.querySelector('.body').classList.remove('noScroll');
// }
