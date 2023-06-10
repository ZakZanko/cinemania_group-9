const refs = {
  backdrop: document.querySelector('.backdrop'),
  openModal: document.querySelector('.films'),
  cardList: document.querySelector('.films'),
  libraryList: document.querySelector('.library-list'),
  modalCont: document.querySelector('.modal__container'),
  FilmBtn: document.querySelector('.film__button'),
  closeModal: document.querySelector('.modal__close-btn'),
  cardsfilm: document.querySelector('.cards-film'),
};

let posterPath = '';
let genresList = [];
let filmMarkup = '';
let filmBtn;
let selectedMovieId;

if (refs.cardList) {
  refs.cardList.addEventListener('click', createModal);
}

function createModal(event) {
  const selectedMovie = event.target.closest('li');
  selectedMovieId = Number(selectedMovie.getAttribute('data-id'));
  refs.closeModal.addEventListener('click', closeModalDescr);

  createMarkup(selectedMovieId);

  openModal();
}
