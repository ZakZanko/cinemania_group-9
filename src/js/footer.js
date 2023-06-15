const footerLink = document.querySelector('.footer__link');
const modalCloseButton = document.querySelector('[data-modal-close]');
const modalBackdrop = document.querySelector('.footer__backdrop');

function openModal() {
    modalBackdrop.classList.remove('is-hidden');
    footerLink.style.cursor = "not-allowed";
}

function closeModal() {
    modalBackdrop.classList.add('is-hidden');
    footerLink.style.cursor = "pointer";
}

footerLink.addEventListener('click', openModal);
modalCloseButton.addEventListener('click', closeModal);


