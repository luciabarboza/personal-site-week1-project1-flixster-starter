const APIKEY = "69edf5c9109661df5a4d334d7e999158"; //enter your own API key here
const LANGUAGE = "en-US";


let page = 1;
let currentSearch = "";

const movieInput = document.querySelector("#search-input");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

const movieForm = document.querySelector(".form");
const movieMain = document.querySelector(".main");

const movieHeader = document.querySelector(".headerArea");
const modalContent = document.querySelector(".modal-content");




const movieArea = document.querySelector("#movies-grid");
const movieMoreBtn = document.querySelector(".load-more-movies-btn");
const movieMoreDiv = document.querySelector(".more-area");
const movieCurrent = document.querySelector(".close-search-btn");

const mybutton = document.getElementById("myBtn");

// || EVENT LISTENERS
movieForm.addEventListener("submit", handleFormSubmit);
movieMoreBtn.addEventListener("click", handleMore);
movieCurrent.addEventListener("click", handleCurrent);
document.addEventListener("click", function (event) {
    if (event.target.matches('.open')) {
		// Run your code to open a modal
        handleModal(event);
	}
    if (event.target.matches('.close')) {
        handleClose(event);
    }
});

async function getCurrent() {
    currentSearch = "";
    let apiURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${APIKEY}&language=${LANGUAGE}&page=${page}&include_adult=false`;
    let response = await fetch(apiURL);
    let responseData = await response.json();
    movieHeader.innerHTML = `<h2>Now Playing</h2>`
    displayResults(responseData);
}

async function getDetails(movieId) {
    let apiURL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${APIKEY}&language=${LANGUAGE}`;
    let response = await fetch(apiURL);
    let responseData = await response.json();
    return responseData;
}

async function getVideos(movieId) {
    let apiURL = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${APIKEY}&language=${LANGUAGE}`;
    let response = await fetch(apiURL);
    let responseData = await response.json();
    return responseData;
}

async function getResults(query) {
    let apiURL = `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${query}&language=${LANGUAGE}&page=${page}&include_adult=false`;
    let response = await fetch(apiURL);
    let responseData = await response.json();
    displayResults(responseData);
    movieHeader.innerHTML = `<h2>Movie Results</h2>`
    movieMoreDiv.classList.remove("hidden");
    movieMoreBtn.classList.remove("hidden");  
}

function displayResults(responseData) {
    responseData.results.forEach(element => {
        //handle if no poster path
        let src = element.poster_path ? `https://image.tmdb.org/t/p/w300${element.poster_path}` : "images/no-img.png";
        movieArea.innerHTML += `
            <div class="movie-card" movieId="${element.id} id="id${element.id}">
                <img class="movie-poster" src=${src} alt="Movie poster image"/>
                <h2 class="movie-title">${element.title}</h2>
                <p class="movie-votes">&#11088;   ${element.vote_average}/10</p>
                <button class="open" movieId="${element.id}">See movie details</button>
            </div>
        `;
    });
} 



function handleClose(evt) {
    modalContent.innerHTML = ``;
    modal.style.display = "none";
}

function handleFormSubmit(evt) {
    evt.preventDefault();
    //clear current div
    movieArea.innerHTML = ``;
    let searchTerm = evt.target.input.value;
    currentSearch = searchTerm;
    page = 1;
    getResults(searchTerm);

}

function handleMore(evt) {
    evt.preventDefault();
    page++;
    if(currentSearch !== "") {
        getResults(currentSearch);
    } else {
        getCurrent();
    }
}

function handleCurrent(evt) {
    movieArea.innerHTML = ``;
    page = 1;
    movieInput.value = "";
    getCurrent();
}

async function handleModal(evt) {
    let movieId = evt.target.attributes[1].nodeValue;
    //another api call to get more details
    let responseData = await getDetails(movieId);
    let videoData = await getVideos(movieId);
    let genreList = "";
    let movieTrailer = ``;
    videoData["results"].forEach(movie => {movie.type === "Trailer" && movie.name.includes("Official Trailer") ||  movie.name.includes("Original Trailer")? movieTrailer = `<h4 class="modalCat">Official Trailer:</h4><iframe width="560" height="315" src="https://www.youtube.com/embed/${movie.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : 
    null});
    responseData.genres.forEach(genre => {genreList += genre.name + ", "});
    let src = responseData.backdrop_path ? `https://image.tmdb.org/t/p/w400${responseData.backdrop_path}` : "";
    modalContent.innerHTML += `
        <span class="close">&times;</span>
        <div class="modal-details">
            <img class="backdrop" src="${src}"/>
            <h2>${responseData.title} | &#11088;   ${responseData.vote_average}/10</h2>
            <div class="dataRow">
                <h4 class="modalCat">Genres: </h4>
                <p> ${genreList}</p>
            </div>
            <div class="dataRow">
                <h4 class="modalCat">Runtime: </h4>
                <p> ${responseData.runtime} minutes</p>
            </div>
            <div class="dataRow">
                <h4 class="modalCat">Release Date: </h4>
                <p> ${responseData.release_date}</p>
            </div>
            <div class="overview">
                <h4 class="modalCat">Overview: </h4>
                <p> ${responseData.overview}</p>
            </div>
            ${movieTrailer}
            
        </div>
    `;
    modal.style.display = "block";
}



window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.documentElement.scrollTop = 0; 
}


window.onload = function () {
    getCurrent();
}
