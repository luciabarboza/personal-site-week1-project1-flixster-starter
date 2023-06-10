// || CONSTANTS
const APIKEY = "69edf5c9109661df5a4d334d7e999158"; //enter your own API key here
const LANGUAGE = "en-US";

// || OTHER VARIABLES
let page = 1;
let currentSearch = "";

//DOM OBJECTS

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


// || ASYNC FUNCTIONS TO GET DATA FROM API

/*This function takes in no parameters. It fetches the data for movies now playing and calls displayResults
with the responseData. It has no return value*/
async function getCurrent() {
    currentSearch = "";
    let apiURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${APIKEY}&language=${LANGUAGE}&page=${page}&include_adult=false`;
    let response = await fetch(apiURL);
    let responseData = await response.json();
    movieHeader.innerHTML = `<h2>Now Playing</h2>`
    displayResults(responseData);
}
/*This function takes in a movieId. It fetches the data for the details of a single movie and 
returns the responseData json*/
async function getDetails(movieId) {
    let apiURL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${APIKEY}&language=${LANGUAGE}`;
    let response = await fetch(apiURL);
    let responseData = await response.json();
    return responseData;
}
/*This function takes in a movieId. It fetches the data for the videos of a single movie and 
returns the responseData json*/
async function getVideos(movieId) {
    let apiURL = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${APIKEY}&language=${LANGUAGE}`;
    let response = await fetch(apiURL);
    let responseData = await response.json();
    return responseData;
}
/*This function takes in a query. It fetches the data for the movies given a search query and 
calls displayResults and changes the DOM*/
async function getResults(query) {
    let apiURL = `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${query}&language=${LANGUAGE}&page=${page}&include_adult=false`;
    let response = await fetch(apiURL);
    let responseData = await response.json();
    displayResults(responseData);
    movieHeader.innerHTML = `<h2>Movie Results</h2>`
    movieMoreDiv.classList.remove("hidden");
    movieMoreBtn.classList.remove("hidden");  
}
/*This function takes in responseData from the API calls and updates the DOM to add movie information for
each movie in the data array. It has no return value*/
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


// || EVENT HANDLERS
/*This function closes the modal by changing the styling of the modalto display: none. This function
is fired when a user presses the x button in the corner of the modal*/
function handleClose(evt) {
    modalContent.innerHTML = ``;
    modal.style.display = "none";
}

/*This function handles a search query by clearing the movie Area, updating variables, and fetching 
the search data. It is fired when the user clicks the submit button after entering a keyword*/
function handleFormSubmit(evt) {
    evt.preventDefault();
    //clear current div
    movieArea.innerHTML = ``;
    let searchTerm = evt.target.input.value;
    currentSearch = searchTerm;
    page = 1;
    getResults(searchTerm);

}
/*This function increments the page variable and if there is an active search then it gets more search
results, otherwise it gets more now playing results. This function is fired when the Show More Movies 
button is clicked*/
function handleMore(evt) {
    evt.preventDefault();
    page++;
    if(currentSearch !== "") {
        getResults(currentSearch);
    } else {
        getCurrent();
    }
}
/*This function clears the movie area, resets the page number, clears the text input field, and gets the
current movies*/
function handleCurrent(evt) {
    movieArea.innerHTML = ``;
    page = 1;
    movieInput.value = "";
    getCurrent();
}
/*This function gets the details of a movie given a movie id and fetches the trailer of the movie. Then
the DOM is updated to include the modal HTML with details of the movie and trailer.*/
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


// || BACK TO TOP BUTTON
// When the user scrolls down 500px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};
/*This function makes the back to top button appear or disappear when scrolling*/
function scrollFunction() {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

/*When the website loads, display the Now Playing movies*/
window.onload = function () {
    getCurrent();
}