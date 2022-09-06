const input = document.getElementById("input-search");
const moviesBlock = document.querySelector(".movies-block");
const paginationContainer = document.querySelector(".pagination-container");
const modal = document.querySelector('.modal')
const modalClose = document.querySelector('.modal-close')
const modalContent = document.querySelector('.modal-content')
const container = document.querySelector('.container')
const modalHeader = document.querySelector('.modal-header')
const modalMovieTitle = document.querySelector('.modal-movie-title')

let paginationButtons;
let startPage = 1;
let endPage = 10;
let currentPage = 1;
let leftArrow;

modal.style.display = 'none'

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '',
    'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com'
  }
};

input.addEventListener("keypress", (evt) => {
  const enteredTitle = input.value;
  if (evt.key === "Enter") {
    getMovie(enteredTitle, (page = 1));
  }
});

async function getMovie(title, page) {
  const data = await fetch(
    `https://movie-database-alternative.p.rapidapi.com/?s=${title}&r=json&page=${page}`,
    options
  );
  const movie = await data.json();
  showContent(movie);
}

function showContent(movie) {
  const { Search: listOfMovies, totalResults } = movie;

  const pages = Number(totalResults) / listOfMovies.length;
  const arrLeft = document.createElement("button");
  arrLeft.innerHTML = '<i class="fa fa-arrow-left" aria-hidden="true"></i>';
  arrLeft.classList.add("arrow-left");
  paginationContainer.prepend(arrLeft);
  if (currentPage === 1) {
    arrLeft.disabled = true;
  }

  for (let i = startPage; i <= endPage; i++) {
    let style = currentPage === i ? "button highlighted" : "button";
    paginationContainer.innerHTML += `<button class='${style}' value=${i}>${i}</button>`;
  }

  const arrRight = document.createElement("button");
  arrRight.innerHTML = '<i class="fa fa-arrow-right" aria-hidden="true"></i>';
  arrRight.classList.add("arrow-right");
  paginationContainer.appendChild(arrRight);

  for (let i = 0; i < listOfMovies.length; i++) {
    const { Title, Poster, Type, Year, imdbID } = listOfMovies[i];
    moviesBlock.innerHTML += `<div onclick={openModal('${imdbID}')} class=movie>
            <img src=${
              Poster !== "N/A" ? Poster : "https://via.placeholder.com/150"
            } alt=poster/>
            <p class=title>${Title}</p>
            <p class=year>${Year}</p>
            <p class=type>${Type}</p>
        </div>`;
  }

  paginationButtons = document.querySelectorAll(".button");

  for (let i = 0; i < paginationButtons.length; i++) {
    const button = paginationButtons[i];
    button.addEventListener("click", (e) => {
      if (Number(e.target.value) === endPage) {
        startPage = endPage;
        endPage += 10;
      }
      currentPage = Number(e.target.value);
      moviesBlock.innerHTML = "";
      paginationContainer.innerHTML = "";
      getMovie(input.value, e.target.value);
    });
  }

  document.querySelector(".arrow-left").addEventListener("click", () => {
    currentPage -= 1;
    if (currentPage <= 10) {
      startPage = 1
      endPage = 10
    } else {
      startPage -= 10
      endPage -= 10
    }
    
    paginationContainer.innerHTML = "";
    moviesBlock.innerHTML = "";
    getMovie(input.value, currentPage);
  });

  document.querySelector(".arrow-right").addEventListener("click", () => {
    currentPage += 1;
    if (currentPage === endPage) {
      startPage = endPage;
      endPage += 10;
    }

    console.log(currentPage, startPage, endPage);

    paginationContainer.innerHTML = "";
    moviesBlock.innerHTML = "";
    getMovie(input.value, currentPage);
  });
}

async function openModal(id) {
  modal.style.display = 'flex'
  const movieDescription = await getMovieDescription(id)
  const {Poster, Title} = movieDescription
  modalMovieTitle.textContent = Title
  modalContent.innerHTML = 
  `<div>
    <img src=${Poster} alt=poster/>
  </div>`
}

async function getMovieDescription(id) {
  const data = await fetch(`https://movie-database-alternative.p.rapidapi.com/?r=json&i=${id}`, options)
  const movieDescription = await data.json()
  return movieDescription
}

modalClose.addEventListener('click', () => {
  modal.style.display = 'none'
  modalContent.innerHTML = ''
  modalMovieTitle.textContent = ''
})


