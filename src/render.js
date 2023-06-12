export async function getMovieGenres() {
  const { data } = await axios.get(
    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
  );
  return data;
}

export async function getGenres() {
  const genres = await getMovieGenres().then(({ genres }) => genres);

  return { genres };
}

export function renderMarkup(data) {
  getGenres().then(({ genres }) => {
    //Добавление списка жанров в localStorage
    saveLs('genresList', genres);
    if (data.results) {
      data.results.forEach(film => {
        const { genre_ids, release_date } = film;
        genres.forEach(({ name, id }) => {
          if (genre_ids.includes(id)) {
            if (genre_ids.length > 2) {
              genre_ids.splice(2, genre_ids.length - 1);
            }
            genre_ids.splice(genre_ids.indexOf(id), 1, name);
          }
          film.genre_names = genre_ids.join(', ');
          if (film.release_date) {
            film.release_date = release_date.slice(0, 4);
          }
        });
      });
    }
    const markupList = createListMarkup(data.results);
    if (cards) {
      cards.innerHTML = markupList;
    }
  });
}

export function createListMarkup(data) {
  if (data) {
    return data
      .map(
        ({
          original_title,
          poster_path,
          vote_average,
          id,
          genre_names,
          release_date,
        }) => {
          let posterPath = ``;
          if (poster_path) {
            posterPath = `${IMG_BASE_URL}${IMG_W400}${poster_path}`;
          } else {
            posterPath = 'https://i.ibb.co/C0LFwTh/OIF.jpg';
          }

          let starIcons = '';
          for (let i = 1; i <= 5; i++) {
            let starClass = 'fa-star-o';
            if (i * 2 < vote_average) {
              starClass = 'fa-star';
            } else if (i * 2 - 1 < vote_average) {
              starClass = 'fa-star-half-o';
            }
            starIcons += `<span class="fa star ${starClass}"> </span>`;
          }

          return `<li class='cards-list__item hover-cursor' data-id='${id}'>
              <img
                class='cards-list__img'
                src='${posterPath}'
                alt='${original_title}'
                width
                loading='lazy'
                data-id='${id}'
              />
              <div class='cards-list__wrap'>
                <div class='cards-list__info'>
                  <h2 class='cards-list__title'>${original_title}</h2>
                  <div class='cards-list_second_line'>
                    <div class='cards-list__text'>
                      <p>${genre_names} | ${release_date}</p>
                  </div>
                </div>
                </div>
                <div class='star-rate'>
                  ${starIcons}
                </div>     
              </div>
              </li>
              `;
        }
      )
      .join('');
  }
}
